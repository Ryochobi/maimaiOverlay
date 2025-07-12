import { useSelector } from 'react-redux';
import './FourPlayerView.scss';
import { useEffect } from 'react';

export default function FourPlayerView() {
    const fields = useSelector((state) => state.fields.fields);
    console.log("asd")
    useEffect(() => {

    },[fields])
  return (
    <div className="fourplayer-container">
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
