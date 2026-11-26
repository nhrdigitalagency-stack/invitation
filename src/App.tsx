import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { QuiltedBackdrop } from './components/QuiltedBackdrop';
import { Envelope3D } from './components/Envelope3D';
import { InvitationForm } from './components/InvitationForm';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#081226] text-[#F7F3EA]">
      <QuiltedBackdrop />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <Envelope3D key="envelope-stage" onOpenComplete={() => setIsOpened(true)} />
        ) : (
          <InvitationForm key="invitation-stage" onCloseEnvelope={() => setIsOpened(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
