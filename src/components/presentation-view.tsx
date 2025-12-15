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
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marp = new Marp({
      html: true,
    });

    try {
      const { html, css } = marp.render(markdown);
      console.log('MARP rendered HTML:', html);
      console.log('MARP CSS:', css);

      // HTML에서 각 슬라이드를 분리
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const svgs = Array.from(doc.querySelectorAll("svg[data-marpit-svg]"));
      console.log('Found SVGs:', svgs.length);

      const slideHtmls = svgs.map((svg, idx) => {
        const slideHtml = `<style>${css}</style>${svg.outerHTML}`;
        console.log(`Slide ${idx}:`, slideHtml.substring(0, 200));
        return slideHtml;
      });
      setSlides(slideHtmls);
      console.log('Total slides set:', slideHtmls.length);
    } catch (error) {
      console.error("MARP rendering error:", error);
    }
  }, [markdown, theme]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentSlideIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentSlideIndex(slides.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* 슬라이드 컨테이너 */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center p-8"
      >
        <style>{`
          .presentation-slide svg[data-marpit-svg] {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
          }
        `}</style>
        <div
          className="presentation-slide w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: slides[currentSlideIndex] || "" }}
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
          {currentSlideIndex + 1} / {slides.length}
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
          disabled={currentSlideIndex === slides.length - 1}
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
