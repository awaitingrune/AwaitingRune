// Real PCs built for real customers. This list is empty on purpose: nothing
// is shown until a genuine build exists, so the homepage section displays a
// "coming soon" message instead of made-up customers.
//
// To add one, put its photo in src/assets/builds/ and add an entry like:
//
//   import photo from '../assets/builds/jamie-rune-of-power.webp'
//   {
//     id: 'jamie-rune-of-power',
//     name: 'Rune of Power',
//     owner: 'Jamie, Leeds',            // only with their permission
//     image: photo,
//     specs: ['Ryzen 7 9700X', 'RTX 5070 Ti', '32GB DDR5', '2TB NVMe'],
//     quote: 'Booted first time and runs silent.', // optional, a real quote only
//   },
export const CUSTOMER_BUILDS = []
