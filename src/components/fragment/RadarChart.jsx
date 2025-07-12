import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const GrooveRadar = ({ noteCounts }) => {
  if (!noteCounts) return null;

 const {
    tap = 0,
    hold = 0,
    slide = 0,
    touch = 0,
    break: breaks = 0,
    total
  } = noteCounts;

  // Category weights (manually adjusted)
  const weights = {
    tap: 1.8,
    hold: 8,
    slide: 9,
    touch: 7,
    break: 10
  };

  // Prevent division by 0
  const getScore = (count, weight) =>
    Math.min((count / total) * weight, 1);

  const radarData = [
    { attribute: 'Tap ', value: getScore(tap, weights.tap) },
    { attribute: 'Hold', value: getScore(hold, weights.hold) },
    { attribute: 'Slide', value: getScore(slide, weights.slide) },
    { attribute: 'Touch', value: getScore(touch, weights.touch) },
    { attribute: 'Break', value: getScore(breaks, weights.break) }
  ];


  return (
    <div style={{ width: 600, height: 300 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="attribute" />
          <PolarRadiusAxis angle={30} domain={[0, 1]} tickCount={5} />
          <Radar
            dataKey="value"
            stroke="#00ccff"
            fill="#00ccff"
            fillOpacity={0.6}
            dot={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrooveRadar;
