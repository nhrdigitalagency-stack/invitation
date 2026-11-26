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

      {/* Crisp geometric quilted diamond pattern echoing the reference */}
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

      {/* Top-left delicate botanical corner flourish */}
      <svg
        className="absolute -left-6 -top-6 h-52 w-52 opacity-60 sm:h-64 sm:w-64"
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M14 14 C 42 56, 82 78, 138 92"
            stroke="#8FB2CE"
            strokeWidth="1.2"
            opacity="0.65"
          />
          <path
            d="M28 10 C 48 64, 58 110, 56 160"
            stroke="#8FB2CE"
            strokeWidth="1.2"
            opacity="0.55"
          />
          {/* Leaves */}
          <path
            d="M72 62 C 92 48, 114 48, 126 60 C 108 72, 88 74, 72 62 Z"
            fill="#8DB3CC"
            fillOpacity="0.45"
          />
          <path
            d="M96 76 C 118 72, 138 78, 148 92 C 128 98, 108 92, 96 76 Z"
            fill="#8DB3CC"
            fillOpacity="0.38"
          />
          <path
            d="M46 92 C 30 108, 28 128, 38 144 C 54 132, 58 112, 46 92 Z"
            fill="#8DB3CC"
            fillOpacity="0.4"
          />
          {/* Warm terracotta & champagne blossom */}
          <g transform="translate(50 48)">
            <ellipse cx="0" cy="-16" rx="9" ry="15" fill="#DC7446" fillOpacity="0.72" />
            <ellipse
              cx="15"
              cy="-5"
              rx="9"
              ry="15"
              transform="rotate(72 15 -5)"
              fill="#E5885B"
              fillOpacity="0.75"
            />
            <ellipse
              cx="9"
              cy="13"
              rx="9"
              ry="15"
              transform="rotate(144 9 13)"
              fill="#CC6136"
              fillOpacity="0.7"
            />
            <ellipse
              cx="-9"
              cy="13"
              rx="9"
              ry="15"
              transform="rotate(-144 -9 13)"
              fill="#E5885B"
              fillOpacity="0.75"
            />
            <ellipse
              cx="-15"
              cy="-5"
              rx="9"
              ry="15"
              transform="rotate(-72 -15 -5)"
              fill="#DC7446"
              fillOpacity="0.72"
            />
            <circle cx="0" cy="0" r="6" fill="#F2CC86" />
          </g>
          {/* Accent berries */}
          <circle cx="88" cy="112" r="2.6" fill="#E5B96B" opacity="0.8" />
          <circle cx="96" cy="126" r="2.2" fill="#DC7446" opacity="0.8" />
          <circle cx="105" cy="138" r="2.6" fill="#E5B96B" opacity="0.75" />
        </g>
      </svg>

      {/* Bottom-right mirrored botanical flourish */}
      <svg
        className="absolute -bottom-6 -right-6 h-52 w-52 rotate-180 opacity-60 sm:h-64 sm:w-64"
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M14 14 C 42 56, 82 78, 138 92"
            stroke="#8FB2CE"
            strokeWidth="1.2"
            opacity="0.65"
          />
          <path
            d="M28 10 C 48 64, 58 110, 56 160"
            stroke="#8FB2CE"
            strokeWidth="1.2"
            opacity="0.55"
          />
          <path
            d="M72 62 C 92 48, 114 48, 126 60 C 108 72, 88 74, 72 62 Z"
            fill="#8DB3CC"
            fillOpacity="0.45"
          />
          <path
            d="M96 76 C 118 72, 138 78, 148 92 C 128 98, 108 92, 96 76 Z"
            fill="#8DB3CC"
            fillOpacity="0.38"
          />
          <path
            d="M46 92 C 30 108, 28 128, 38 144 C 54 132, 58 112, 46 92 Z"
            fill="#8DB3CC"
            fillOpacity="0.4"
          />
          <g transform="translate(50 48)">
            <ellipse cx="0" cy="-16" rx="9" ry="15" fill="#DC7446" fillOpacity="0.72" />
            <ellipse
              cx="15"
              cy="-5"
              rx="9"
              ry="15"
              transform="rotate(72 15 -5)"
              fill="#E5885B"
              fillOpacity="0.75"
            />
            <ellipse
              cx="9"
              cy="13"
              rx="9"
              ry="15"
              transform="rotate(144 9 13)"
              fill="#CC6136"
              fillOpacity="0.7"
            />
            <ellipse
              cx="-9"
              cy="13"
              rx="9"
              ry="15"
              transform="rotate(-144 -9 13)"
              fill="#E5885B"
              fillOpacity="0.75"
            />
            <ellipse
              cx="-15"
              cy="-5"
              rx="9"
              ry="15"
              transform="rotate(-72 -15 -5)"
              fill="#DC7446"
              fillOpacity="0.72"
            />
            <circle cx="0" cy="0" r="6" fill="#F2CC86" />
          </g>
          <circle cx="88" cy="112" r="2.6" fill="#E5B96B" opacity="0.8" />
          <circle cx="96" cy="126" r="2.2" fill="#DC7446" opacity="0.8" />
          <circle cx="105" cy="138" r="2.6" fill="#E5B96B" opacity="0.75" />
        </g>
      </svg>
    </div>
  );
};
