// Relative performance tables used by the FPS estimator (src/utils/fps.js).
//
// GPU_PERF: rasterization performance relative to the RTX 4070 (= 1.00) at
// each resolution. Anchored to published review averages: RTX 4070 Super
// ~17% over the 4070 and RX 7800 XT roughly level with the 4070 Super
// (GamersNexus), RTX 4080 Super ~36% over the 4070 Super and RTX 4090
// ~28% over the 4080 Super (multi-game averages). The 4090 gains more at
// 4K because it is CPU-limited at 1080p; 8GB cards lose ground at 4K.
// RTX 5060 is roughly 20% over the 4060 (about RTX 4060 Ti level) and the
// RTX 5070 a few percent over the 4070 Super; the 5060 Ti ~13-20% over the
// 4060 Ti, 5070 Ti ~9-13% over the 4070 Ti Super, 5080 ~14-16% over the 4080
// Super and 5090 ~20% over the 4090 at 1440p and ~26-35% at 4K (less at
// 1080p where the CPU limits it). Reviews of the 50 series vary by game, so
// treat all of these as approximate.
export const GPU_PERF = {
  'gpu-5060': { 1080: 0.76, 1440: 0.73, 2160: 0.63 },
  'gpu-5060ti': { 1080: 0.9, 1440: 0.88, 2160: 0.84 },
  'gpu-5070': { 1080: 1.18, 1440: 1.22, 2160: 1.26 },
  'gpu-5070ti': { 1080: 1.35, 1440: 1.46, 2160: 1.54 },
  'gpu-5080': { 1080: 1.56, 1440: 1.77, 2160: 1.88 },
  'gpu-5090': { 1080: 1.8, 1440: 2.38, 2160: 2.9 },
}

// CPU_PERF: gaming performance relative to the Ryzen 7 7800X3D (= 1.00),
// used to cap frame rates in CPU-bound games. Approximate averages from
// 1080p CPU reviews (X3D ahead of the 7700X by roughly 15-20%; the 14700K
// ~19% over the 13400F).
// The Ryzen 9000 chips are newer: the 9800X3D averages ~8-13% over the 7800X3D
// at 1080p, the 9950X3D is within a couple of percent of it in games, and the
// non-X3D 9000 parts are a few percent over their 7000 equivalents.
// CPU_MT: multi-core production performance (rendering, encoding, compiling)
// relative to the Ryzen 9 9950X (= 1.00). Rough Cinebench-style multi-core
// ratios; only used to match creators with the right rig in the quiz.
export const CPU_MT = {
  'cpu-9950x': 1,
  'cpu-9950x3d': 0.97,
  'cpu-iron10': 0.8,
  'cpu-9900x': 0.72,
  'cpu-rune12': 0.7,
  'cpu-9800x3d': 0.5,
  'cpu-9700x': 0.48,
  'cpu-neb8': 0.5,
  'cpu-x3d8': 0.46,
  'cpu-9600x': 0.36,
  'cpu-neb6': 0.35,
  'cpu-iron6': 0.3,
}

export const CPU_PERF = {
  'cpu-9800x3d': 1.1,
  'cpu-9950x3d': 1.07,
  'cpu-9950x': 0.9,
  'cpu-9700x': 0.89,
  'cpu-9900x': 0.88,
  'cpu-9600x': 0.86,
  'cpu-x3d8': 1,
  'cpu-iron10': 0.92,
  'cpu-rune12': 0.85,
  'cpu-neb8': 0.85,
  'cpu-neb6': 0.8,
  'cpu-iron6': 0.77,
}
