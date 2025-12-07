import React from 'react';
import { TreeState } from '../types';
import { Image as ImageIcon, Video, Maximize, Edit3, Camera } from 'lucide-react';

interface UIOverlayProps {
  treeState: TreeState;
  setTreeState: (state: TreeState) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ treeState, setTreeState }) => {
  
  const toggleState = () => {
    setTreeState(treeState === TreeState.TREE_SHAPE ? TreeState.SCATTERED : TreeState.TREE_SHAPE);
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Top Center Title */}
      <div className="absolute top-8 left-0 right-0 text-center animate-fade-in-down z-20">
        <h1 className="font-script text-6xl md:text-8xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-glow">
          Merry Christmas
        </h1>
      </div>

      {/* Right Side Control Bar */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-auto">
        <button className="p-3 bg-black/30 backdrop-blur-md rounded-full text-white/80 hover:bg-white/20 hover:text-white hover:scale-110 transition-all border border-white/10 group relative">
           <Video size={24} strokeWidth={1.5} />
           <span className="absolute right-full mr-4 bg-black/50 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Record</span>
        </button>
        <button className="p-3 bg-black/30 backdrop-blur-md rounded-full text-white/80 hover:bg-white/20 hover:text-white hover:scale-110 transition-all border border-white/10 group relative">
           <ImageIcon size={24} strokeWidth={1.5} />
           <span className="absolute right-full mr-4 bg-black/50 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Snapshot</span>
        </button>
        {/* Toggle Button acting as 'Edit' or 'Interact' */}
        <button 
            onClick={toggleState}
            className={`p-3 backdrop-blur-md rounded-full transition-all border group relative
                ${treeState === TreeState.SCATTERED 
                    ? 'bg-arix-gold text-black border-arix-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]' 
                    : 'bg-black/30 text-white/80 border-white/10 hover:bg-white/20'}`}
        >
           <Edit3 size={24} strokeWidth={1.5} />
           <span className="absolute right-full mr-4 bg-black/50 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
             {treeState === TreeState.SCATTERED ? 'Assemble' : 'Scatter'}
           </span>
        </button>
        <button className="p-3 bg-black/30 backdrop-blur-md rounded-full text-white/80 hover:bg-white/20 hover:text-white hover:scale-110 transition-all border border-white/10">
           <Maximize size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Footer Left Credit */}
      <div className="absolute bottom-6 left-8 text-white/40 font-sans text-[10px] tracking-[0.2em] pointer-events-auto">
        <p>A BEAUTIFUL CHRISTMAS TREE</p>
        <p className="mt-1 font-bold">MADE BY SOUTHPL</p>
      </div>

      {/* Bottom Right Preview (Mockup) */}
      <div className="absolute bottom-6 right-6 w-32 h-24 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden flex flex-col items-center justify-center text-white/30 pointer-events-auto hover:border-white/30 transition-colors">
         <div className="flex-1 w-full bg-gradient-to-b from-transparent to-black/50 flex items-center justify-center">
             <Camera size={20} />
         </div>
         <div className="w-full h-4 bg-white/5 flex items-center justify-between px-2 text-[8px]">
             <span>SENSORS</span>
             <span className="text-red-400">CLOSED</span>
         </div>
      </div>

    </div>
  );
};
