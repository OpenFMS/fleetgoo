import React from 'react';
import BlockRenderer from './blocks/BlockRenderer';

const About = ({ data }) => {
  if (!data || !data.blocks) return null;

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      {data.blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </div>
  );
};

export default About;
