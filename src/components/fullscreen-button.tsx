interface FullscreenButtonProps {
  isFullscreen: boolean
  onClick: () => void
}

export default function FullscreenButton({ isFullscreen, onClick }: FullscreenButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 text-xs border border-white/20 rounded hover:bg-white/10 focus:outline-none text-white transition-colors"
      title={isFullscreen ? "전체화면 종료 (ESC)" : "전체화면 모드"}
    >
      {isFullscreen ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      )}
    </button>
  )
}
