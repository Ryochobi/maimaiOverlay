import { useSelector } from 'react-redux';
import './TwoPlayerView.scss';
import { useEffect } from 'react';

export default function TwoPlayerView() {
    const fields = useSelector((state) => state.fields.fields);
    console.log("asd")
    useEffect(() => {

    },[fields])
  return (
    <div className="twoPlayer-container">
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
