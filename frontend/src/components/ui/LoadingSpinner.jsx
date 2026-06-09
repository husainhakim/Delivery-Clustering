import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = { sm: 16, md: 32, lg: 48 };
  const s = sizeMap[size] || 32;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        width={s}
        height={s}
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <defs>
          <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="spinner-grad">
            <stop stopColor="#6366f1" stopOpacity="0" offset="0%" />
            <stop stopColor="#6366f1" stopOpacity=".631" offset="63.146%" />
            <stop stopColor="#6366f1" offset="100%" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)">
            <path
              d="M36 18c0-9.94-8.06-18-18-18"
              stroke="url(#spinner-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="36" cy="18" r="1.5" fill="#6366f1" />
          </g>
        </g>
      </svg>
      {text && <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
