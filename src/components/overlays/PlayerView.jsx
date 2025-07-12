import { useSelector } from 'react-redux';
import './PlayerView.scss';

export default function PlayerView() {
    const fields = useSelector((state) => state.fields.fields);
    console.log("test", fields)
  return (
    <div className="playerView-container">
      {
        fields.round && (
        <div className="round-container">
            <div className='round-text'>
                {fields.round}
             </div>   
        </div>
        )
      }
    </div>
  );
}
