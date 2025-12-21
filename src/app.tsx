import { useState, useRef } from "react";
import MarkdownEditor from "./components/markdown-editor";
import PresentationPreview from "./components/presentation-preview";
import ThemeSelector from "./components/theme-selector";
import FullscreenButton from "./components/fullscreen-button";
import PresentationView from "./components/presentation-view";
import jsPDF from "jspdf";

const defaultMarkdown = `---
marp: true
theme: default
---

# MARP Presentation Editor

Welcome to the MARP Presentation Editor!

---

## Features

- **Live Preview**: See your slides in real-time
- **Monaco Editor**: Powerful code editor
- **MARP Support**: Full MARP syntax support

---

## Getting Started

1. Edit markdown on the left
2. See live preview on the right
3. Export to PDF when ready

---

# Thank You!

Start creating your presentation now.
`;

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [theme, setTheme] = useState("default");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // 마크다운의 theme 속성도 업데이트
    const updatedMarkdown = markdown.replace(/theme:\s*\w+/, `theme: ${newTheme}`);
    setMarkdown(updatedMarkdown);
  };

  // 프레젠테이션 모드 토글
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // MD 파일 업로드
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdown(content);

        // theme 추출
        const themeMatch = content.match(/theme:\s*(\w+)/);
        if (themeMatch) {
          setTheme(themeMatch[1]);
        }
      };
      reader.readAsText(file);
    }
    // input 값 초기화 (같은 파일 재업로드 가능하도록)
    event.target.value = "";
  };

  // MD 파일 다운로드
  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "presentation.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF 다운로드
  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    try {
      const svgs = previewRef.current.querySelectorAll("svg[data-marpit-svg]");
      if (svgs.length === 0) {
        alert("슬라이드가 없습니다.");
        return;
      }

      // CSS 스타일 가져오기
      const styleSheets = Array.from(document.styleSheets);
      const cssText = styleSheets
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch {
            return "";
          }
        })
        .join("\n");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1280, 720],
      });

      for (let i = 0; i < svgs.length; i++) {
        const svgElement = svgs[i] as SVGElement;
        const svgClone = svgElement.cloneNode(true) as SVGElement;

        // SVG 크기 설정
        const viewBox = svgClone.getAttribute("viewBox");
        if (viewBox) {
          const [, , width, height] = viewBox.split(" ").map(Number);
          svgClone.setAttribute("width", String(width));
          svgClone.setAttribute("height", String(height));
        }

        // 스타일을 SVG 내부에 삽입
        const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
        styleElement.textContent = cssText;
        svgClone.insertBefore(styleElement, svgClone.firstChild);

        // SVG를 문자열로 변환
        const svgData = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        // 이미지로 변환
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = (e) => {
            console.error("Image load error:", e);
            reject(e);
          };
          img.src = url;
        });

        // Canvas에 그리기
        const canvas = document.createElement("canvas");
        canvas.width = 1280 * 2;
        canvas.height = 720 * 2;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        const imgData = canvas.toDataURL("image/png");
        URL.revokeObjectURL(url);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "PNG", 0, 0, 1280, 720);
      }

      pdf.save("presentation.pdf");
    } catch (error) {
      console.error("PDF export error:", error);
      alert("PDF 다운로드 중 오류가 발생했습니다: " + String(error));
    }
  };

  // 커서 위치로부터 슬라이드 번호 계산
  const handleCursorChange = (lineNumber: number) => {
    const lines = markdown.split("\n");
    let slideNumber = 1;
    let inFrontmatter = false;
    let frontmatterEnded = false;

    console.log('=== Cursor Change Debug ===');
    console.log('lineNumber:', lineNumber);

    for (let i = 0; i < lineNumber && i < lines.length; i++) {
      const trimmedLine = lines[i].trim();

      // frontmatter 처리
      if (trimmedLine === "---") {
        if (!inFrontmatter && !frontmatterEnded && i === 0) {
          // frontmatter 시작
          inFrontmatter = true;
          console.log(`Line ${i+1}: frontmatter START`);
        } else if (inFrontmatter && !frontmatterEnded) {
          // frontmatter 끝
          inFrontmatter = false;
          frontmatterEnded = true;
          console.log(`Line ${i+1}: frontmatter END`);
        } else if (frontmatterEnded) {
          // 실제 슬라이드 구분자
          slideNumber++;
          console.log(`Line ${i+1}: slide separator -> slideNumber = ${slideNumber}`);
        }
      }
    }

    console.log('Final slideNumber:', slideNumber);
    setCurrentSlide(slideNumber);
  };

  return (
    <>
      {/* 프레젠테이션 모드 */}
      {isFullscreen ? (
        <PresentationView
          markdown={markdown}
          theme={theme}
          onClose={() => setIsFullscreen(false)}
        />
      ) : (
        /* 편집 모드 */
        <div className="flex flex-col h-screen bg-white">
          {/* Header */}
          <header className="bg-slate-800 text-white py-2 px-4 shadow-sm border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">MARP Presentation Editor</h1>
              <div className="flex items-center gap-2">
                {/* 파일 업로드 (숨김) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.markdown"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* MD 업로드 버튼 */}
                <button
                  onClick={handleUploadClick}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors flex items-center gap-1.5"
                  title="MD 파일 업로드"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  업로드
                </button>

                {/* MD 다운로드 버튼 */}
                <button
                  onClick={handleDownloadMarkdown}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors flex items-center gap-1.5"
                  title="MD 파일 다운로드"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  MD
                </button>

                {/* PDF 다운로드 버튼 */}
                <button
                  onClick={handleDownloadPDF}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors flex items-center gap-1.5"
                  title="PDF 다운로드"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF
                </button>

                {/* 구분선 */}
                <div className="w-px h-4 bg-white/20"></div>

                <ThemeSelector value={theme} onChange={handleThemeChange} />
                <FullscreenButton isFullscreen={isFullscreen} onClick={toggleFullscreen} />
              </div>
            </div>
          </header>

          {/* Editor and Preview */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Editor */}
            <div className="w-1/2 border-r border-gray-200">
              <MarkdownEditor value={markdown} onChange={setMarkdown} onCursorChange={handleCursorChange} />
            </div>

            {/* Right: Preview */}
            <div className="w-1/2 bg-gray-50">
              <PresentationPreview ref={previewRef} markdown={markdown} theme={theme} currentSlide={currentSlide} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
