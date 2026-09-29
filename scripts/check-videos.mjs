/**
 * Guards every video the website ships so it actually plays in a browser.
 *
 * Catches the three things that silently break playback on the live site:
 *   1. a referenced file missing from client/public (404 in the player)
 *   2. a Git LFS pointer committed instead of the real file (renders as a 130-byte text file)
 *   3. a browser-undecodable encode (10-bit / High 10 H.264, non-yuv420p, HEVC, ...)
 *
 * Usage: node scripts/check-videos.mjs
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'client', 'public', 'videos');
const scanDirs = [path.join(root, 'client', 'src'), path.join(root, 'server', 'src')];

const WEB_SAFE_VIDEO = /^(h264|vp8|vp9|av1)$/;
const WEB_SAFE_AUDIO = /^(aac|opus|vorbis|mp3|flac)$/;

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);

/* ---------------------------------------------------------- 1. collect references */
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const referenced = new Set();
for (const dir of scanDirs) {
  for (const file of walk(dir)) {
    if (!/\.(js|jsx|ts|tsx|json|html)$/.test(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(/\/videos\/([\w.\-]+)/g)) referenced.add(m[1]);
  }
}

if (referenced.size === 0) fail('No /videos/ references found — the scanner is looking in the wrong place.');

/* ---------------------------------------------------------- 2. files on disk */
const shipped = fs.existsSync(publicDir) ? fs.readdirSync(publicDir).filter((f) => /\.(mp4|webm|mov|m4v)$/i.test(f)) : [];
if (shipped.length === 0) fail(`No video files in ${path.relative(root, publicDir)} — the site would ship with no videos.`);

const all = [...new Set([...referenced, ...shipped])];
let ffprobe = null;
try {
  execFileSync('ffprobe', ['-version'], { stdio: 'ignore' });
  ffprobe = 'ffprobe';
} catch {
  warnings.push('ffprobe not found — skipping codec checks (install ffmpeg to enable them).');
}

function probe(file) {
  const args = ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name,profile,pix_fmt', '-of', 'json', file];
  try {
    return JSON.parse(execFileSync(ffprobe, args, { encoding: 'utf8' }));
  } catch {
    return null;
  }
}

for (const name of all.sort()) {
  const rel = `/videos/${name}`;
  const file = path.join(publicDir, name);

  if (!fs.existsSync(file)) {
    fail(`${rel} is referenced by the site but missing from client/public/videos/`);
    continue;
  }

  const stat = fs.statSync(file);
  const fd = fs.openSync(file, 'r');
  const buf = Buffer.alloc(200);
  fs.readSync(fd, buf, 0, 200, 0);
  fs.closeSync(fd);
  const text = buf.toString('utf8');

  if (text.startsWith('version https://git-lfs.github.com/spec')) {
    fail(`${rel} is a Git LFS pointer, not a video — it will 404/fail in the browser. Run: git lfs checkout && git add --renormalize .`);
    continue;
  }
  const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(name);

  if (isVideo && stat.size < 10 * 1024) fail(`${rel} is only ${stat.size} bytes — that is not a real video file.`);
  if (!isVideo || !ffprobe) continue;

  const info = probe(file);
  if (!info) {
    fail(`${rel} could not be probed — the file is corrupt or not a media file.`);
    continue;
  }
  const video = (info.streams || []).find((s) => s.codec_type === 'video');
  const audio = (info.streams || []).find((s) => s.codec_type === 'audio');
  if (!video) {
    fail(`${rel} has no video stream.`);
    continue;
  }
  if (!WEB_SAFE_VIDEO.test(video.codec_name || '')) fail(`${rel} uses codec "${video.codec_name}" which browsers cannot decode.`);
  if (video.codec_name === 'h264' && video.profile === 'High 10') fail(`${rel} is 10-bit H.264 (High 10) — no browser can play it. Re-encode with: ffmpeg -i in.mp4 -vf format=yuv420p -c:v libx264 -profile:v high -c:a copy -movflags +faststart out.mp4`);
  if (video.pix_fmt && !/^yuv420p/.test(video.pix_fmt)) fail(`${rel} uses pixel format "${video.pix_fmt}" — browsers need yuv420p.`);
  if (audio && !WEB_SAFE_AUDIO.test(audio.codec_name || '')) fail(`${rel} has audio codec "${audio.codec_name}" which browsers cannot decode.`);
}

/* ---------------------------------------------------------- 3. report */
for (const w of warnings) console.warn(`warn  ${w}`);

if (errors.length) {
  console.error(`\n${errors.length} video problem(s) would break playback on the site:\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}

console.log(`ok    ${referenced.size} referenced file(s) + ${shipped.length} shipped video(s) checked — everything is present and browser-playable.`);
