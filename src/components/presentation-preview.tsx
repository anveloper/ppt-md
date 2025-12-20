import { Marp } from "@marp-team/marp-core";
import { useEffect, useState, forwardRef } from "react";

interface PresentationPreviewProps {
  markdown: string;
  theme?: string;
  currentSlide?: number;
}

export default forwardRef<HTMLDivElement, PresentationPreviewProps>(
  function PresentationPreview({ markdown, theme = "default", currentSlide = 0 }, ref) {
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");

    useEffect(() => {
    const marp = new Marp({
      html: true,
    });

    try {
      const { html: renderedHtml, css: renderedCss } = marp.render(markdown);
      setHtml(renderedHtml);
      setCss(renderedCss);
    } catch (error) {
      console.error("MARP rendering error:", error);
    }
  }, [markdown, theme]);

  // 슬라이드 자동 스크롤
  useEffect(() => {
    const container = ref && typeof ref !== 'function' ? ref.current : null;

    if (currentSlide > 0 && container && html) {
      // HTML 렌더링 후 DOM이 업데이트될 때까지 대기
      setTimeout(() => {
        if (container) {
          const svgs = container.querySelectorAll("svg[data-marpit-svg]");
          const targetSvg = svgs[currentSlide - 1] as HTMLElement;

          if (targetSvg) {
            // getBoundingClientRect를 사용하여 정확한 위치 계산
            const containerRect = container.getBoundingClientRect();
            const targetRect = targetSvg.getBoundingClientRect();

            // 현재 스크롤 위치 + 타겟의 상대 위치 - padding(32px)
            const targetTop = container.scrollTop + (targetRect.top - containerRect.top) - 32;

            container.scrollTo({
              top: targetTop,
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  }, [currentSlide, html, ref]);

    return (
      <div ref={ref} className="h-full bg-gray-50 overflow-auto p-8">
        <style>{css}</style>
        <style>{`
          .marp-preview svg[data-marpit-svg] {
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border-radius: 0.5rem;
            margin-bottom: 2rem;
          }

          .marp-preview svg[data-marpit-svg]:last-child {
            margin-bottom: 0;
          }
        `}</style>
        <div className="marp-preview" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }
);
