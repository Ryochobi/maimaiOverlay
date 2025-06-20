import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateData, hide } from '../../store/store.js';
import './Overlay.scss';
import OverlayField from '../fragment/OverlayField.jsx';

export default function Overlay() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.overlay);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/overlay');
    ws.onmessage = async (event) => {
      try {
        if (event.data) {
          console.log(event.data)
          const json = JSON.parse(event.data);
          dispatch(updateData(json));
          setTimeout(() => dispatch(hide()), 3000);
        }
      } catch (err) {
        console.error('Invalid message received:', err);
      }
    };
    return () => ws.close();
  }, [dispatch]);

  return (
    <div className="overlay-container">
      <div className="overlay-box">
        {Object.entries(data).map(([key, value]) => (
          <OverlayField key={key} label={key} value={value} fade={true} />
          ))}
      </div>
    </div>
  );

}
