import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Dust, StudioLights } from './common.jsx';

/* ---------- geometry helpers ---------- */

function makePlateGeometry() {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1.5, 0, Math.PI * 2, false);
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    const hole = new THREE.Path();
    hole.absarc(Math.cos(a) * 0.92, Math.sin(a) * 0.92, 0.36, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  const hub = new THREE.Path();
  hub.absarc(0, 0, 0.2, 0, Math.PI * 2, true);
  shape.holes.push(hub);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 3,
    curveSegments: 56,
  });
}

function makeFilmTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#0a0a0e';
  g.fillRect(0, 0, 512, 128);
  const hues = ['#ff3d2e', '#ffb347', '#00d4c8', '#b14bff'];
  for (let i = 0; i < 4; i += 1) {
    const x = i * 128 + 14;
    const grad = g.createLinearGradient(x, 20, x + 100, 108);
    grad.addColorStop(0, hues[i]);
    grad.addColorStop(1, '#141420');
    g.fillStyle = grad;
    g.fillRect(x, 22, 100, 84);
    g.fillStyle = 'rgba(255,255,255,.08)';
    g.fillRect(x + 6, 28, 88, 3);
  }
  g.fillStyle = '#e9e9f2';
  for (let i = 0; i < 16; i += 1) {
    const x = i * 32 + 10;
    g.beginPath();
    g.roundRect ? g.roundRect(x, 6, 14, 9, 2) : g.rect(x, 6, 14, 9);
    g.fill();
    g.beginPath();
    g.roundRect ? g.roundRect(x, 113, 14, 9, 2) : g.rect(x, 113, 14, 9);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeRibbonGeometry(curve, width = 0.62, segments = 220, uvScale = 1) {
  const pos = [];
  const uv = [];
  const idx = [];
  const up = new THREE.Vector3(0, 1, 0);
  const length = curve.getLength();
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const p = curve.getPoint(t);
    const tan = curve.getTangent(t);
    const side = new THREE.Vector3().crossVectors(tan, up).normalize().multiplyScalar(width / 2);
    // slight twist for a natural look
    const twist = Math.sin(t * Math.PI * 3) * 0.55;
    const q = new THREE.Quaternion().setFromAxisAngle(tan, twist);
    side.applyQuaternion(q);
    pos.push(p.x + side.x, p.y + side.y, p.z + side.z, p.x - side.x, p.y - side.y, p.z - side.z);
    uv.push(t * length * uvScale, 1, t * length * uvScale, 0);
    if (i < segments) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/* ---------- the reel ---------- */

function FilmReel({ isWide }) {
  const root = useRef();
  const spin = useRef();
  const filmTex = useMemo(() => makeFilmTexture(), []);
  const plate = useMemo(() => makePlateGeometry(), []);
  const ribbon = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(1.15, -0.35, 0),
        new THREE.Vector3(1.9, -1.35, 0.35),
        new THREE.Vector3(3.0, -0.6, 1.0),
        new THREE.Vector3(4.0, -1.6, 0.1),
        new THREE.Vector3(5.2, -0.7, -0.9),
        new THREE.Vector3(6.4, -1.5, -1.6),
      ],
      false,
      'catmullrom',
      0.5
    );
    return makeRibbonGeometry(curve, 0.62, 240, 0.42);
  }, []);

  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!root.current) return;
    const { pointer } = state;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const fade = Math.min(scrollY / (window.innerHeight || 800), 1.2);

    const baseX = isWide ? viewport.width * 0.245 : 0;
    const baseY = isWide ? 0.1 : viewport.height * 0.3;

    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, baseX - pointer.x * 0.25, 4, delta);
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, baseY + fade * 2.2 + pointer.y * 0.15, 4, delta);
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -0.55 + pointer.x * 0.45, 3, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, 0.25 - pointer.y * 0.3, 3, delta);
    spin.current.rotation.z -= delta * 0.45;
    filmTex.offset.x -= delta * 0.22;
    const s = (isWide ? 0.92 : 0.5) * (1 - fade * 0.25);
    root.current.scale.setScalar(s);
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        {[-0.3, 0.3].map((z) => (
          <mesh key={z} geometry={plate} position={[0, 0, z - 0.04]} castShadow>
            <meshStandardMaterial color="#3a3a4a" metalness={0.8} roughness={0.32} envMapIntensity={1.8} />
          </mesh>
        ))}
        {/* film roll */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.18, 1.18, 0.52, 64]} />
          <meshStandardMaterial color="#111116" metalness={0.5} roughness={0.55} envMapIntensity={1.2} />
        </mesh>
        {/* hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.9, 32]} />
          <meshStandardMaterial color="#ff3d2e" metalness={0.8} roughness={0.25} emissive="#ff3d2e" emissiveIntensity={0.35} />
        </mesh>
        {/* glowing rim rings */}
        {[-0.34, 0.34].map((z) => (
          <mesh key={z} position={[0, 0, z]}>
            <torusGeometry args={[1.5, 0.014, 12, 128]} />
            <meshBasicMaterial color="#ff3d2e" toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* the film strip flowing out of the reel */}
      <mesh geometry={ribbon}>
        <meshStandardMaterial
          map={filmTex}
          emissiveMap={filmTex}
          emissive="#ffffff"
          emissiveIntensity={0.55}
          side={THREE.DoubleSide}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

function Rig({ children }) {
  const g = useRef();
  useFrame((state, delta) => {
    if (!g.current) return;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, state.pointer.x * 0.08, 2, delta);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -state.pointer.y * 0.05, 2, delta);
  });
  return <group ref={g}>{children}</group>;
}

function Scene({ isWide, lite }) {
  return (
    <>
      <StudioLights />
      <Rig>
        <Dust count={lite ? 220 : 520} />
      </Rig>
      <FilmReel isWide={isWide} />
    </>
  );
}

export default function HeroScene({ active = true, isWide = true, lite = false, eventSource }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      eventSource={eventSource}
      eventPrefix="client"
      dpr={[1, lite ? 1.25 : 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene isWide={isWide} lite={lite} />
    </Canvas>
  );
}
