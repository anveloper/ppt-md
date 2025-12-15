import { useState, useEffect } from "react";
import MarkdownEditor from "./components/markdown-editor";
import PresentationPreview from "./components/presentation-preview";
import ThemeSelector from "./components/theme-selector";
import FullscreenButton from "./components/fullscreen-button";

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

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // 마크다운의 theme 속성도 업데이트
    const updatedMarkdown = markdown.replace(/theme:\s*\w+/, `theme: ${newTheme}`);
    setMarkdown(updatedMarkdown);
  };

  // 전체화면 토글
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // ESC 키로 전체화면 종료
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

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
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      {!isFullscreen && (
        <header className="bg-linear-to-r from-blue-500 to-purple-600 text-white py-4 px-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">MARP Presentation Editor</h1>
            <div className="flex items-center gap-4">
              <ThemeSelector value={theme} onChange={handleThemeChange} />
              <FullscreenButton isFullscreen={isFullscreen} onClick={toggleFullscreen} />
            </div>
          </div>
        </header>
      )}

      {/* Editor and Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        {!isFullscreen && (
          <div className="w-1/2 border-r border-gray-200">
            <MarkdownEditor value={markdown} onChange={setMarkdown} onCursorChange={handleCursorChange} />
          </div>
        )}

        {/* Right: Preview */}
        <div className={isFullscreen ? "w-full bg-gray-50" : "w-1/2 bg-gray-50"}>
          <PresentationPreview markdown={markdown} theme={theme} currentSlide={currentSlide} />
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="fixed top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors z-50"
              title="전체화면 종료 (ESC)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
