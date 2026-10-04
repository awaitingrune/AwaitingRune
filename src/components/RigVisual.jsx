import PCTower from './PCTower.jsx'
import { REAL_PHOTO_IDS, RIG_IMAGES } from '../data/rigImages.js'
import './RigVisual.css'

// Shows the photo for a rig when one exists (see src/data/rigImages.js),
// otherwise the illustration built from the rig's parts. Photos that are not
// yet real photos of the finished PC carry an "AI concept" badge.
export default function RigVisual({ id, build, alt }) {
  const photo = RIG_IMAGES[id]

  if (photo) {
    return (
      <div className="rig-visual rig-visual--photo">
        <img src={photo} alt={alt} loading="lazy" decoding="async" />
        {!REAL_PHOTO_IDS.has(id) && <span className="rig-visual__badge">AI concept</span>}
      </div>
    )
  }

  return (
    <div className="rig-visual">
      <PCTower build={build} />
    </div>
  )
}
