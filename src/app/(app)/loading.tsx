function Loading() {
  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="#3B82F6"
          strokeWidth="4"
          strokeDasharray="31.4 31.4"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M44 24a20 20 0 1 1-20-20"
          stroke="#3B82F6"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default Loading;
