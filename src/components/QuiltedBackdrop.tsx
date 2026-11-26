import React from 'react';

export const QuiltedBackdrop: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#081226]"
    >
      {/* Subtle deep royal radial depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 65% at 50% 35%, rgba(25, 52, 102, 0.72) 0%, rgba(12, 26, 54, 0.85) 55%, rgba(6, 14, 30, 1) 100%)',
        }}
      />

      {/* Crisp geometric quilted diamond pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="royal-diamond-grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M32 0 L64 32 L32 64 L0 32 Z"
              fill="none"
              stroke="#9BB5E3"
              strokeWidth="0.7"
            />
            <circle cx="32" cy="0" r="1.4" fill="#E5B96B" opacity="0.75" />
            <circle cx="64" cy="32" r="1.4" fill="#E5B96B" opacity="0.75" />
            <circle cx="32" cy="64" r="1.4" fill="#E5B96B" opacity="0.75" />
            <circle cx="0" cy="32" r="1.4" fill="#E5B96B" opacity="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#royal-diamond-grid)" />
      </svg>

      {/* Top-left ornament: Sculpted warm gold & terracotta Heart */}
      <svg
        className="absolute left-3 top-3 h-28 w-28 opacity-80 sm:left-6 sm:top-6 sm:h-40 sm:w-40 md:h-44 md:w-44"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heart-fill" x1="28" y1="26" x2="148" y2="152" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F39A68" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#DC6F42" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#E5B96B" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="heart-stroke" x1="20" y1="20" x2="155" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE1A3" />
            <stop offset="55%" stopColor="#E59262" />
            <stop offset="100%" stopColor="#E5B96B" />
          </linearGradient>
        </defs>

        {/* Soft ambient halo behind heart */}
        <circle cx="88" cy="86" r="54" fill="#DC7446" fillOpacity="0.09" />

        {/* Subtle golden corner filigree arcs */}
        <path
          d="M18 118 C 14 70, 32 30, 74 16"
          stroke="#E5B96B"
          strokeWidth="0.9"
          strokeDasharray="3 5"
          opacity="0.45"
        />

        {/* Main sculpted heart */}
        <path
          d="M88 140 C 85 137, 34 103, 34 66 C 34 45, 50 32, 68 32 C 79 32, 85 38, 88 45 C 91 38, 97 32, 108 32 C 126 32, 142 45, 142 66 C 142 103, 91 137, 88 140 Z"
          fill="url(#heart-fill)"
          stroke="url(#heart-stroke)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Delicate inner calligraphic heart outline */}
        <path
          d="M88 128 C 85 125, 45 97, 45 68 C 45 53, 56 43, 69 43 C 78 43, 84 48, 88 55 C 92 48, 98 43, 107 43 C 120 43, 131 53, 131 68 C 131 97, 91 125, 88 128 Z"
          stroke="#F8DFA6"
          strokeWidth="1"
          strokeOpacity="0.55"
        />

        {/* Small accent sparks around heart */}
        <circle cx="148" cy="40" r="2.2" fill="#F5D692" opacity="0.8" />
        <circle cx="30" cy="116" r="1.8" fill="#E5885B" opacity="0.75" />
        <path
          d="M148 92 L150 97 L155 99 L150 101 L148 106 L146 101 L141 99 L146 97 Z"
          fill="#F5D692"
          opacity="0.7"
        />
      </svg>

      {/* Bottom-right ornament: Clasped Hands symbolizing family solidarity */}
      <svg
        className="absolute bottom-3 right-3 h-32 w-32 opacity-80 sm:bottom-6 sm:right-6 sm:h-44 sm:w-44 md:h-48 md:w-48"
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hands-stroke" x1="24" y1="60" x2="196" y2="165" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE1A3" />
            <stop offset="50%" stopColor="#E5B96B" />
            <stop offset="100%" stopColor="#E58C5E" />
          </linearGradient>
          <linearGradient id="hands-glow" x1="50" y1="50" x2="170" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E5B96B" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#DC7446" stopOpacity="0.14" />
          </linearGradient>
        </defs>

        {/* Warm solidarity halo */}
        <circle cx="112" cy="114" r="64" fill="url(#hands-glow)" />

        {/* Radiant solidarity rays above the clasped hands */}
        <g stroke="#F5D692" strokeWidth="1.2" strokeLinecap="round" opacity="0.55">
          <line x1="110" y1="42" x2="110" y2="54" />
          <line x1="84" y1="49" x2="90" y2="59" />
          <line x1="136" y1="49" x2="130" y2="59" />
          <line x1="65" y1="65" x2="74" y2="72" />
          <line x1="155" y1="65" x2="146" y2="72" />
        </g>

        {/* Fine-line editorial clasped hands / handshake */}
        <g
          stroke="url(#hands-stroke)"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left sleeve & forearm entering */}
          <path d="M18 110 L54 88 L76 102" />
          <path d="M24 146 L58 134" />

          {/* Right sleeve & forearm entering */}
          <path d="M202 108 L166 88 L142 100" />
          <path d="M196 146 L160 136" />

          {/* Upper thumb & clasped palm bridge */}
          <path
            d="M76 102 C 88 92, 102 88, 115 92 L 138 102 C 147 106, 152 114, 148 122 C 145 128, 138 130, 131 128"
            fill="#E5B96B"
            fillOpacity="0.14"
          />

          {/* Interlocking right thumb wrapping over left hand */}
          <path d="M142 100 C 128 94, 114 96, 102 104 C 95 109, 96 117, 104 119 C 111 120, 118 115, 124 111" />

          {/* Interlocked fingers underneath (symbol of firm mutual support) */}
          <path d="M58 134 L 94 156 C 100 160, 108 158, 112 152" />
          <path d="M104 146 L 122 156 C 128 159, 136 157, 139 151 C 142 146, 140 140, 135 137 L 118 128" />
          <path d="M114 139 L 133 149 C 139 152, 146 149, 148 143 C 150 138, 148 132, 142 129 L 127 121" />
          <path d="M126 130 L 144 139 C 150 142, 156 139, 158 134 C 160 129, 157 123, 152 120 L 138 113" />

          {/* Left hand bottom knuckles curving into grip */}
          <path d="M68 140 C 64 145, 67 152, 73 153 C 78 154, 83 150, 86 146" />
          <path d="M78 147 C 75 153, 78 159, 84 160 C 90 161, 95 157, 98 152" />
          <path d="M90 153 C 88 159, 92 165, 98 165 C 104 165, 109 161, 112 155" />
        </g>

        {/* Subtle circular solidarity arc framing the corner */}
        <path
          d="M196 168 C 180 194, 144 206, 102 204"
          stroke="#E5B96B"
          strokeWidth="0.9"
          strokeDasharray="3 5"
          opacity="0.45"
        />
      </svg>

      {/* Subtle festive golden starlight motes */}
      <div className="absolute inset-0">
        {[
          { left: '12%', top: '22%', size: 3, dur: '6.2s', delay: '0.2s' },
          { left: '24%', top: '76%', size: 2.5, dur: '7.4s', delay: '1.1s' },
          { left: '38%', top: '14%', size: 2, dur: '5.8s', delay: '2.4s' },
          { left: '54%', top: '84%', size: 3, dur: '6.8s', delay: '0.8s' },
          { left: '68%', top: '19%', size: 2.5, dur: '7.1s', delay: '1.9s' },
          { left: '82%', top: '36%', size: 3.5, dur: '6.4s', delay: '0.5s' },
          { left: '88%', top: '68%', size: 2, dur: '5.5s', delay: '2.8s' },
          { left: '16%', top: '52%', size: 2, dur: '7.6s', delay: '1.5s' },
          { left: '74%', top: '82%', size: 2.5, dur: '6.9s', delay: '2.1s' },
          { left: '46%', top: '30%', size: 2, dur: '8.2s', delay: '0.4s' },
        ].map((mote, index) => (
          <span
            key={index}
            className="starlight-mote absolute rounded-full bg-[#F5D692]"
            style={
              {
                left: mote.left,
                top: mote.top,
                width: `${mote.size}px`,
                height: `${mote.size}px`,
                boxShadow: '0 0 8px rgba(245, 214, 146, 0.75)',
                '--twinkle-duration': mote.dur,
                '--twinkle-delay': mote.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
};
