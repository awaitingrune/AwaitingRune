export const RESOLUTIONS = [
  { key: '1080', label: '1080p' },
  { key: '1440', label: '1440p' },
  { key: '2160', label: '4K' },
]

export const GENRES = [
  { key: 'competitive', label: 'Competitive & esports' },
  { key: 'aaa', label: 'Big single-player games' },
]

// Per-game baselines, measured on a reference RTX 4070 paired with a
// Ryzen 7 7800X3D at the listed settings (no ray tracing, no upscaling or
// frame generation, native resolution).
//   gpuFps  - average FPS on the reference GPU at each resolution
//   cpuFps  - FPS ceiling on the reference CPU (CPU-bound limit)
//   cap     - hard engine frame cap, if any
//   vramGB  - VRAM needed at each resolution before textures spill over
//   target  - the frame rate we call "great" for this kind of game
// These are estimates compiled from published benchmark averages and vary
// with patches, drivers and the scene benchmarked.
export const GAMES = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    genre: 'competitive',
    settings: 'High',
    target: 144,
    gpuFps: { 1080: 400, 1440: 320, 2160: 190 },
    cpuFps: 460,
    vramGB: { 2160: 8 },
  },
  {
    id: 'valorant',
    name: 'Valorant',
    genre: 'competitive',
    settings: 'Max',
    target: 144,
    gpuFps: { 1080: 800, 1440: 640, 2160: 380 },
    cpuFps: 700,
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    genre: 'competitive',
    settings: 'Epic',
    target: 144,
    gpuFps: { 1080: 215, 1440: 160, 2160: 85 },
    cpuFps: 320,
    vramGB: { 1440: 8, 2160: 10 },
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    genre: 'competitive',
    settings: 'Max',
    target: 144,
    gpuFps: { 1080: 250, 1440: 190, 2160: 105 },
    cpuFps: 300,
    cap: 300,
    vramGB: { 2160: 10 },
  },
  {
    id: 'warzone',
    name: 'Call of Duty: Warzone',
    genre: 'competitive',
    settings: 'High',
    target: 144,
    gpuFps: { 1080: 170, 1440: 130, 2160: 75 },
    cpuFps: 250,
    vramGB: { 1440: 8, 2160: 12 },
  },
  {
    id: 'overwatch',
    name: 'Overwatch 2',
    genre: 'competitive',
    settings: 'Epic',
    target: 144,
    gpuFps: { 1080: 330, 1440: 250, 2160: 140 },
    cpuFps: 500,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    genre: 'aaa',
    settings: 'Ultra, RT off',
    target: 60,
    gpuFps: { 1080: 112, 1440: 78, 2160: 40 },
    cpuFps: 190,
    vramGB: { 1080: 6, 1440: 8, 2160: 10 },
  },
  {
    id: 'rdr2',
    name: 'Red Dead Redemption 2',
    genre: 'aaa',
    settings: 'High/Ultra mix',
    target: 60,
    gpuFps: { 1080: 130, 1440: 100, 2160: 56 },
    cpuFps: 220,
    vramGB: { 2160: 8 },
  },
  {
    id: 'bg3',
    name: "Baldur's Gate 3",
    genre: 'aaa',
    settings: 'Ultra',
    target: 60,
    gpuFps: { 1080: 120, 1440: 92, 2160: 50 },
    cpuFps: 130,
    vramGB: { 1440: 8, 2160: 10 },
  },
  {
    id: 'eldenring',
    name: 'Elden Ring',
    genre: 'aaa',
    settings: 'Maximum',
    target: 60,
    gpuFps: { 1080: 100, 1440: 78, 2160: 52 },
    cpuFps: 100,
    cap: 60,
    vramGB: { 2160: 10 },
  },
  {
    id: 'starfield',
    name: 'Starfield',
    genre: 'aaa',
    settings: 'Ultra',
    target: 60,
    gpuFps: { 1080: 85, 1440: 62, 2160: 35 },
    cpuFps: 130,
    vramGB: { 1080: 8, 1440: 10, 2160: 12 },
  },
  {
    id: 'blackmyth',
    name: 'Black Myth: Wukong',
    genre: 'aaa',
    settings: 'Very High, RT off',
    target: 60,
    gpuFps: { 1080: 62, 1440: 44, 2160: 24 },
    cpuFps: 130,
    vramGB: { 1080: 8, 1440: 10, 2160: 12 },
  },
]

export function findGame(id) {
  return GAMES.find((g) => g.id === id) ?? null
}
