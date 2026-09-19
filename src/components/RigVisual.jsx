import PCTower from './PCTower.jsx'
import { RIG_IMAGES } from '../data/rigImages.js'
import './RigVisual.css'

// Shows the real photo for a rig when one exists (see src/data/rigImages.js),
// otherwise the illustration built from the rig's parts.
export default function RigVisual({ id, build, alt }) {
  const photo = RIG_IMAGES[id]

  if (photo) {
    return (
      <div className="rig-visual rig-visual--photo">
        <img src={photo} alt={alt} loading="lazy" decoding="async" />
      </div>
    )
  }

  return (
    <div className="rig-visual">
      <PCTower build={build} />
    </div>
  )
}
