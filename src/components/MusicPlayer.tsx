import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Pause, Play, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { MELODY_TRACKS, MelodyId } from '../utils/christmasAudio';

interface MusicPlayerProps {
  isPlaying: boolean;
  trackId: MelodyId;
  volume: number;
  onTogglePlay: () => void;
  onSwitchTrack: () => void;
  onVolumeChange: (volume: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isPlaying,
  trackId,
  volume,
  onTogglePlay,
  onSwitchTrack,
  onVolumeChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const currentTrack =
    MELODY_TRACKS.find((item) => item.id === trackId) ?? MELODY_TRACKS[0];

  const isMuted = volume <= 0.01;

  return (
    <aside
      aria-label="Lecteur audio de Noël"
      className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 rounded-2xl border border-[#E5B96B]/30 bg-[#0B1933]/92 px-2.5 py-2 shadow-[0_14px_36px_-10px_rgba(3,8,20,0.82)] backdrop-blur-md"
      >
        {/* Play / Pause primary control */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={
            isPlaying
              ? `Mettre en pause la mélodie ${currentTrack.title}`
              : `Jouer la mélodie ${currentTrack.title}`
          }
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#E5B96B] text-[#081226] transition-transform duration-150 hover:bg-[#F2CB82] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D391]"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 translate-x-[1px] fill-current" aria-hidden="true" />
          )}
        </button>

        {/* Track info + subtle equalizer trigger */}
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label="Afficher ou masquer les réglages audio"
          className="flex min-w-0 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B]"
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#F8F4EC] whitespace-nowrap">
              {currentTrack.title}
            </p>
            <p className="truncate text-[11px] text-[#9BB0D1] whitespace-nowrap">
              {isPlaying ? 'Mélodie de Noël' : 'Ambiance musicale'}
            </p>
          </div>

          {/* Subtle gold audio level bars */}
          <span
            aria-hidden="true"
            className="flex h-4 items-end gap-[2.5px] pl-1"
          >
            {isPlaying ? (
              <>
                <span className="music-bar music-bar-1 w-[2.5px] rounded-full bg-[#E5B96B]" />
                <span className="music-bar music-bar-2 w-[2.5px] rounded-full bg-[#F5D391]" />
                <span className="music-bar music-bar-3 w-[2.5px] rounded-full bg-[#E5B96B]" />
              </>
            ) : (
              <Music className="h-3.5 w-3.5 text-[#8EA4C8]" />
            )}
          </span>
        </button>

        {/* Expandable discreet track switcher & volume slider */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="audio-controls"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 overflow-hidden border-l border-white/10 pl-2"
            >
              <button
                type="button"
                onClick={onSwitchTrack}
                title="Changer de mélodie"
                aria-label="Passer à l'autre mélodie de Noël"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#C6D4EC] transition-colors hover:bg-white/10 hover:text-[#F5D391] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B]"
              >
                <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onVolumeChange(isMuted ? 0.42 : 0)}
                aria-label={isMuted ? 'Réactiver le son' : 'Couper le son'}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#C6D4EC] transition-colors hover:bg-white/10 hover:text-[#F5D391] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B]"
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                aria-label="Volume de la musique"
                className="h-1.5 w-16 cursor-pointer accent-[#E5B96B] sm:w-20"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
};
