import { useEffect, useState, useRef } from "react";
import { Marp } from "@marp-team/marp-core";

interface PresentationViewProps {
  markdown: string;
  theme?: string;
  onClose: () => void;
}

export default function PresentationView({
  markdown,
  theme = "default",
  onClose,
}: PresentationViewProps) {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marp = new Marp({
      html: true,
    });

    try {
      const { html: renderedHtml, css: renderedCss } = marp.render(markdown);
      setHtml(renderedHtml);
      setCss(renderedCss);

      // 슬라이드 개수 계산
      const parser = new DOMParser();
      const doc = parser.parseFromString(renderedHtml, "text/html");
      const svgs = doc.querySelectorAll("svg[data-marpit-svg]");
      setTotalSlides(svgs.length);
    } catch (error) {
      console.error("MARP rendering error:", error);
    }
  }, [markdown, theme]);

  // 브라우저 전체화면 모드 활성화
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        console.error("Fullscreen error:", error);
      }
    };

    enterFullscreen();

    // 컴포넌트 언마운트 시 전체화면 해제
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // ESC는 브라우저 전체화면도 종료하므로 onClose만 호출
        onClose();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentSlideIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentSlideIndex(totalSlides - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides, onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* 슬라이드 컨테이너 */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center p-8 overflow-hidden"
      >
        <style>{css}</style>
        <style>{`
          .presentation-container {
            width: 100dvw;
            height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .presentation-container svg[data-marpit-svg] {
            display: none;
          }
          .presentation-container svg[data-marpit-svg]:nth-child(${currentSlideIndex + 1}) {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100dvw;
            height: 100dvh;
            max-width: 100%;
            max-height: 100%;
          }
        `}</style>
        <div
          className="presentation-container"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* 컨트롤 오버레이 */}
      <div className="fixed bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-50">
        {/* 이전 버튼 */}
        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentSlideIndex === 0}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full backdrop-blur-sm transition-colors"
          title="이전 슬라이드 (←)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 슬라이드 카운터 */}
        <div className="px-4 py-2 bg-white/10 text-white rounded-full backdrop-blur-sm text-sm font-medium">
          {currentSlideIndex + 1} / {totalSlides}
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1))}
          disabled={currentSlideIndex === totalSlides - 1}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full backdrop-blur-sm transition-colors"
          title="다음 슬라이드 (→)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors z-50"
        title="종료 (ESC)"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
