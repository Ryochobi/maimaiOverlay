import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useSelector } from "react-redux";

import "./Randomizer.scss";
import GrooveRadar from "../fragment/RadarChart";

const cardWidth = 340;
const spacing = 20;
const totalCardWidth = cardWidth + spacing;

export default function Randomizer() {
  const randomizerState = useSelector((state) => state.randomizer);
  const rawX = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 60, damping: 20 }); // adjust for feel
  const xRef = useRef(0); // manually tracked position

  const [selected, setSelected] = useState(null);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const animationRef = useRef(null);
  
  const velocity = 100;

  const songs = randomizerState.songs || [];
  const tripledSongs = [...songs, ...songs, ...songs]; // smooth loop
  const wheelWidth = totalCardWidth * tripledSongs.length;


const containerRef = useRef(null);
const [containerWidth, setContainerWidth] = useState(0);

useEffect(() => {
  if (containerRef.current) {
    setContainerWidth(containerRef.current.offsetWidth);
  }
}, []);


  useEffect(() => {
    if (randomizerState.state === "ready") {
      stopAnimation();
      setSelected(null);
      setZoomIndex(null);
      setShowModal(false);
    }

    if (randomizerState.state === "spin") {
      startSpinning();
    }

    if (randomizerState.state === "stop") {
      stopSpinning();
    }
  }, [randomizerState.state]);

  const startSpinning = () => {
    setSelected(null);
    setZoomIndex(null);
    setShowModal(false);
    cancelAnimationFrame(animationRef.current);

    const animate = () => {
  xRef.current = (xRef.current - velocity) % wheelWidth;
  rawX.set(xRef.current);
  animationRef.current = requestAnimationFrame(animate);
};

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    cancelAnimationFrame(animationRef.current);
  };




const stopSpinning = () => {
  stopAnimation(); // stop the fast loop first

  let currentVelocity = velocity;
  const minVelocity = 4;

  const slowdown = () => {
    currentVelocity *= 0.92;
    xRef.current = (xRef.current - currentVelocity) % wheelWidth;
    rawX.set(xRef.current);

    if (currentVelocity <= minVelocity) {
      finalizeStop();
    } else {
      animationRef.current = requestAnimationFrame(slowdown);
    }
  };

  animationRef.current = requestAnimationFrame(slowdown);
};

const finalizeStop = () => {
  const centerOffset = containerWidth / 2;
  const adjustedX = -xRef.current + centerOffset;
  const index = Math.round(adjustedX / totalCardWidth) % songs.length;
  const trueIndex = (index + songs.length) % songs.length; // fix negatives

  // Align precisely to center
  const finalCenterOffset = containerWidth / 2 - cardWidth / 2;
  const finalX = -(songs.length + trueIndex) * totalCardWidth + finalCenterOffset;

  rawX.stop();
  xRef.current = finalX;
  rawX.set(finalX);

  setZoomIndex(songs.length + trueIndex); // zoom into middle group
  setSelected(songs[trueIndex]);

  setTimeout(() => setShowModal(true), 2500);
};


  return (
    <div className="randomizer-wrapper">
      <div className="roulette-container" ref={containerRef}>
        <motion.div
  style={{
    x: smoothX,
    display: "flex",
    gap: `${spacing}px`,
    willChange: "transform",
  }}
>
          {tripledSongs.map((song, i) => (
            <div
              key={i}
              className={`carousel-card ${i === zoomIndex ? "zoom" : ""}`}
              style={{ flexShrink: 0, width: `${cardWidth}px` }}
            >
              <div className={song.values.difficulty === "master" ? "container master" : "container remaster"}>
                <div className="top-pane">
                  <div className="type">
                    <img
                      className="type-image"
                      src={song.values.type === "dx" ? "./type-dx.png" : "/type-std.png"}
                    />
                  </div>
                </div>
                <div className="mid-pane">
                  <img
                    className="jacket"
                    src={`https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover/${song.values.imageName}`}
                  />
                </div>
                <div className="bottom-pane">
                  <span className="title">{song.values.title}</span>
                  <span className="difficulty">
                    {song.values.difficulty.toUpperCase()} - {song.values.level || song.values.internalLevel}
                  </span>
                  <span className="version">{song.values.version}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {showModal && selected && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={`https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover/${selected.values.imageName}`}
              style={{ width: "450px", margin: "1rem 0", borderRadius: "10px" }}
            />
            <span className="text">
            <h1>{selected.values.title}</h1>
              <h1>
                {selected.values.difficulty.toUpperCase()} - {selected.values.level || selected.values.internalLevel} - {selected.values.type.toUpperCase()}
                </h1>
            <h1>{selected.values.version}</h1>
            </span>
            <GrooveRadar noteCounts={selected.values.noteCounts} />

          </motion.div>
        </div>
      )}
    </div>
  );
}
