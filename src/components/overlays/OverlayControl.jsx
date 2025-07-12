import './OverlayControl.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../fragment/Button';

export default function OverlayControl() {
  const navigate = useNavigate();
   const goToPath = (path) => {
    navigate(path);
  }

  return (
    <div className="dashboard-container">
      <h1>🎛️ Overlay Control Panel</h1>
      <div className="control-actions">
        <Button onClick={() => goToPath('/playerView')}>Player View</Button>
        <Button onClick={() => goToPath('/twoPlayerView')}>Two Player View</Button>
        <Button onClick={() => goToPath('/fourPlayerView')}>Four Player View</Button>
        <Button onClick={() => goToPath('/songView')}>Song View</Button>
        <Button onClick={() => goToPath('/totalScore')}>Total Score View</Button>
        <Button onClick={() => goToPath('/random')}>Randomizer View</Button>
      </div>
    </div>
  );
}
