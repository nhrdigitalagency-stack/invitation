import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { QuiltedBackdrop } from './components/QuiltedBackdrop';
import { Envelope3D } from './components/Envelope3D';
import { InvitationForm } from './components/InvitationForm';
import { MusicPlayer } from './components/MusicPlayer';
import { GoldenConfetti } from './components/GoldenConfetti';
import { christmasAudio, MELODY_TRACKS, MelodyId } from './utils/christmasAudio';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userMuted, setUserMuted] = useState(false);
  const [trackId, setTrackId] = useState<MelodyId>('douce-nuit');
  const [volume, setVolume] = useState(() => christmasAudio.getVolume());
  const [confettiBurstKey, setConfettiBurstKey] = useState(0);

  useEffect(() => {
    return () => {
      christmasAudio.pause();
    };
  }, []);

  const handleOpenEnvelopeStart = useCallback(() => {
    if (!userMuted && !christmasAudio.getIsPlaying()) {
      void christmasAudio.play(trackId).then((started) => {
        if (started) setIsPlaying(true);
      });
    }
  }, [trackId, userMuted]);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      christmasAudio.pause();
      setIsPlaying(false);
      setUserMuted(true);
    } else {
      setUserMuted(false);
      void christmasAudio.play(trackId).then((started) => {
        if (started) setIsPlaying(true);
      });
    }
  }, [isPlaying, trackId]);

  const handleSwitchTrack = useCallback(() => {
    const currentIndex = MELODY_TRACKS.findIndex((t) => t.id === trackId);
    const nextTrack = MELODY_TRACKS[(currentIndex + 1) % MELODY_TRACKS.length].id;
    setTrackId(nextTrack);
    setUserMuted(false);
    void christmasAudio.play(nextTrack).then((started) => {
      if (started) setIsPlaying(true);
    });
  }, [trackId]);

  const handleVolumeChange = useCallback((nextVolume: number) => {
    setVolume(nextVolume);
    christmasAudio.setVolume(nextVolume);
  }, []);

  const handleCelebrate = useCallback(() => {
    setConfettiBurstKey((prev) => prev + 1);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#081226] text-[#F7F3EA]">
      <QuiltedBackdrop />
      <GoldenConfetti burstKey={confettiBurstKey} />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <Envelope3D
            key="envelope-stage"
            onOpenStart={handleOpenEnvelopeStart}
            onOpenComplete={() => setIsOpened(true)}
          />
        ) : (
          <InvitationForm
            key="invitation-stage"
            onCloseEnvelope={() => setIsOpened(false)}
            onCelebrate={handleCelebrate}
          />
        )}
      </AnimatePresence>

      <MusicPlayer
        isPlaying={isPlaying}
        trackId={trackId}
        volume={volume}
        onTogglePlay={handleTogglePlay}
        onSwitchTrack={handleSwitchTrack}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}
