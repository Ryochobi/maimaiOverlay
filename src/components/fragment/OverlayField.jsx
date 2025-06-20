import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function OverlayField({ label, value, fade = false }){
  const [displayedValue, setDisplayedValue] = useState(value);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (value !== displayedValue) {
      setDisplayedValue(value);
      if (fade) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
      }
    }
  }, [value, fade]);

  const fieldContent = (
    <div className="overlay-field">
      <strong>{label}:</strong> {displayedValue}
    </div>
  );

  return fade && animate ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {fieldContent}
    </motion.div>
  ) : (
    fieldContent
  );
}
