// Relative performance tables used by the FPS estimator (src/utils/fps.js).
//
// GPU_PERF: rasterization performance relative to the RTX 4070 (= 1.00) at
// each resolution. Anchored to published review averages: RTX 4070 Super
// ~17% over the 4070 and RX 7800 XT roughly level with the 4070 Super
// (GamersNexus), RTX 4080 Super ~36% over the 4070 Super and RTX 4090
// ~28% over the 4080 Super (multi-game averages). The 4090 gains more at
// 4K because it is CPU-limited at 1080p; 8GB cards lose ground at 4K.
export const GPU_PERF = {
  'gpu-4060': { 1080: 0.64, 1440: 0.6, 2160: 0.53 },
  'gpu-ember700': { 1080: 0.62, 1440: 0.57, 2160: 0.5 },
  'gpu-void90': { 1080: 1, 1440: 1, 2160: 1 },
  'gpu-ember800': { 1080: 1.1, 1440: 1.13, 2160: 1.17 },
  'gpu-4070s': { 1080: 1.14, 1440: 1.17, 2160: 1.18 },
  'gpu-void90ti': { 1080: 1.42, 1440: 1.55, 2160: 1.62 },
  'gpu-4090': { 1080: 1.65, 1440: 1.98, 2160: 2.2 },
}

// CPU_PERF: gaming performance relative to the Ryzen 7 7800X3D (= 1.00),
// used to cap frame rates in CPU-bound games. Approximate averages from
// 1080p CPU reviews (X3D ahead of the 7700X by roughly 15-20%; the 14700K
// ~19% over the 13400F).
export const CPU_PERF = {
  'cpu-x3d8': 1,
  'cpu-iron10': 0.92,
  'cpu-rune12': 0.85,
  'cpu-neb8': 0.85,
  'cpu-neb6': 0.8,
  'cpu-iron6': 0.75,
}
