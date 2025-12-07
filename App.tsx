import React, { useState } from 'react';
import { ExperienceScene } from './components/ExperienceScene';
import { UIOverlay } from './components/UIOverlay';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  return (
    <div className="relative w-full h-screen bg-arix-dark overflow-hidden">
      <ExperienceScene treeState={treeState} />
      <UIOverlay treeState={treeState} setTreeState={setTreeState} />
    </div>
  );
};

export default App;
