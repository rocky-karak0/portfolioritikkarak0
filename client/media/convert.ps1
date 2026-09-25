$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
$inDir = Join-Path $PSScriptRoot 'originals'
$outDir = Join-Path $root 'public\videos'
$map = @{
  '0727.mp4'                          = '0727'
  '0814 (2).mp4'                      = '0814'
  'Alins local SEO.mp4'               = 'alins-local-seo'
  'alins new 3 D modern .mp4'         = 'alins-new-3d-modern'
  'alins reel laptop.mp4'             = 'alins-reel-laptop'
  'car editing .mp4'                  = 'car-editing'
  'cloothmoon.mp4'                    = 'cloothmoon'
  'Dr path lab .mp4'                  = 'dr-path-lab'
  'Face value 1.mp4'                  = 'face-value-1'
  'facehifu for vama.mp4'             = 'facehifu-for-vama'
  'facereel2 new.mp4'                 = 'facereel2-new'
  'GFC step.mp4'                      = 'gfc-step'
  'Insta pots vama hair transplant.mp4' = 'insta-posts-vama-hair-transplant'
  'new hydra facial edted .mp4'       = 'new-hydra-facial-edited'
  'pehnawa reel edit.mp4'             = 'pehnawa-reel-edit'
  'pehnawa-2_Vi2oIRxU.mp4'           = 'pehnawa-2'
  'ravi trader reel 3.mp4'            = 'ravi-trader-reel-3'
  'Reel1.mp4'                         = 'reel-1'
  'reel2.mp4'                         = 'reel-2'
  'sana khan new video.mp4'           = 'sana-khan'
  'VAMA FACE .mp4'                    = 'vama-face'
  'vama face new .mp4'                = 'vama-face-new'
  'vama new 23.mp4'                   = 'vama-new-23'
  'vama reel 1.mp4'                   = 'vama-reel-1'
  'Webiste kritika.mp4'               = 'website-kritika'
}
$log = Join-Path $PSScriptRoot 'convert.log'
Set-Content -Path $log -Value "Convert start $(Get-Date -Format o)"
$n = 0
$total = $map.Count
foreach ($src in $map.Keys) {
  $n++
  $slug = $map[$src]
  $input = Join-Path $inDir $src
  if (-not (Test-Path -LiteralPath $input)) {
    Add-Content $log "MISSING $src"
    continue
  }
  $mp4 = Join-Path $outDir "$slug.mp4"
  $jpg = Join-Path $outDir "$slug-poster.jpg"
  $prev = Join-Path $outDir "$slug-preview.mp4"
  Add-Content $log "[$n/$total] $src -> $slug"
  if (-not (Test-Path -LiteralPath $mp4)) {
    & ffmpeg -y -hide_banner -loglevel error -i $input -c:v libx264 -preset medium -crf 23 -vf "scale=-2:'min(1080,ih)'" -c:a aac -b:a 128k -movflags +faststart $mp4
    Add-Content $log "  mp4 exit=$LASTEXITCODE"
  } else { Add-Content $log "  mp4 exists, skip" }
  if (-not (Test-Path -LiteralPath $jpg)) {
    & ffmpeg -y -hide_banner -loglevel error -ss 1 -i $input -frames:v 1 -q:v 3 $jpg
    if ($LASTEXITCODE -ne 0) {
      & ffmpeg -y -hide_banner -loglevel error -i $input -frames:v 1 -q:v 3 $jpg
    }
    Add-Content $log "  poster exit=$LASTEXITCODE"
  } else { Add-Content $log "  poster exists, skip" }
  if (-not (Test-Path -LiteralPath $prev)) {
    & ffmpeg -y -hide_banner -loglevel error -ss 0 -t 5 -i $input -c:v libx264 -preset medium -crf 23 -vf "scale=-2:'min(480,ih)'" -an -movflags +faststart $prev
    Add-Content $log "  preview exit=$LASTEXITCODE"
  } else { Add-Content $log "  preview exists, skip" }
}
Add-Content $log "Convert done $(Get-Date -Format o)"
Write-Output "DONE"
Get-Content $log -Tail 20
