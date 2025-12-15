import { Marp } from "@marp-team/marp-core";
import { useEffect, useRef, useState } from "react";

interface PresentationPreviewProps {
  markdown: string;
  theme?: string;
  currentSlide?: number;
}

export default function PresentationPreview({
  markdown,
  theme = "default",
  currentSlide = 0,
}: PresentationPreviewProps) {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (currentSlide > 0 && containerRef.current && html) {
      // HTML 렌더링 후 DOM이 업데이트될 때까지 대기
      setTimeout(() => {
        if (containerRef.current) {
          const svgs = containerRef.current.querySelectorAll("svg[data-marpit-svg]");
          const targetSvg = svgs[currentSlide - 1] as HTMLElement;

          if (targetSvg) {
            // 컨테이너의 padding(32px)을 고려하여 스크롤
            const targetTop = targetSvg.offsetTop - 32; // padding-top 제외

            containerRef.current.scrollTo({
              top: targetTop,
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  }, [currentSlide, html]);

  return (
    <div ref={containerRef} className="h-full bg-gray-50 overflow-auto p-8">
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
