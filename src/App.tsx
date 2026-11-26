import { useCallback, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { QuiltedBackdrop } from './components/QuiltedBackdrop';
import { Envelope3D } from './components/Envelope3D';
import { InvitationForm } from './components/InvitationForm';
import { GoldenConfetti } from './components/GoldenConfetti';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [confettiBurstKey, setConfettiBurstKey] = useState(0);

  const handleCelebrate = useCallback(() => {
    setConfettiBurstKey((prev) => prev + 1);
  }, []);

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-[#081226] text-[#F7F3EA]">
      <QuiltedBackdrop />
      <GoldenConfetti burstKey={confettiBurstKey} />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <Envelope3D key="envelope-stage" onOpenComplete={() => setIsOpened(true)} />
        ) : (
          <InvitationForm
            key="invitation-stage"
            onCloseEnvelope={() => setIsOpened(false)}
            onCelebrate={handleCelebrate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
