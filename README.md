# MARP 프레젠테이션 에디터

MARP(Markdown Presentation Ecosystem)를 이용하여 마크다운을 아름다운 슬라이드로 변환하는 웹 기반 프레젠테이션 에디터입니다.

## 주요 기능

- **실시간 미리보기**: 한쪽에서 마크다운을 편집하면 다른 쪽에서 실시간으로 프레젠테이션 미리보기 제공
- **Monaco Editor**: 문법 강조 및 IntelliSense를 지원하는 강력한 코드 에디터
- **PDF 내보내기**: 프레젠테이션을 PDF 파일로 다운로드
- **MARP 지원**: MARP 문법 및 테마 완벽 지원
- **단일 페이지 애플리케이션**: 빠르고 반응성 높은 사용자 경험

## 기술 스택

- **Vite**: 빠른 빌드 도구 및 개발 서버
- **React**: UI 라이브러리
- **TypeScript**: 타입 안전 개발
- **TailwindCSS**: 유틸리티 우선 CSS 프레임워크
- **MARP**: 마크다운 프레젠테이션 생성 라이브러리
- **Monaco Editor**: 마크다운 편집을 위한 코드 에디터

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

### 프로덕션 빌드 미리보기

```bash
npm run preview
```

## Git 워크플로우

이 프로젝트는 구조화된 브랜치 전략을 따릅니다:

- `main`: 프로덕션 브랜치 (자동 배포)
- `develop`: 개발 브랜치
- `feat/*`: 기능 브랜치 (`develop`에서 분기, PR을 통해 `develop`으로 병합)

### 기능 브랜치 생성

```bash
git checkout develop
git pull origin develop
git checkout -b feat/기능명
```

### Pull Request 생성

```bash
git push origin feat/기능명
gh pr create --base develop --head feat/기능명
```

## 배포

`main` 브랜치에 변경사항이 푸시되면 자동으로 GitHub Pages에 배포됩니다.

## 라이선스

MIT
