import './OverlayControl.scss';
import Button from '../fragment/Button';

export default function Randomizer() {
  return (
    <div className="dashboard-container">
      <h1>🎛️ Overlay Control Panel</h1>
      <div className="control-actions">
        <Button >Player View</Button>
        <Button >Game View</Button>
        <Button >Song View</Button>
        <Button >Total Score View</Button>
        <Button >Randomizer View</Button>
      </div>
    </div>
  );
}
