# 프로젝트 작업 규칙

## 브랜치 전략

### 브랜치 구조
- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 통합 브랜치
- `feat/*`: 기능 개발 브랜치

### 브랜치 규칙
1. **기능 개발 시 필수 사항**
   - 항상 `develop` 브랜치에서 `feat/` 브랜치를 생성
   - 브랜치명은 `feat/기능명` 형식 사용 (예: `feat/monaco-editor`, `feat/pdf-export`)
   - 절대로 `main` 브랜치에 직접 커밋하지 않음

2. **브랜치 생성 및 작업 흐름**
   ```bash
   # develop 브랜치 최신화
   git checkout develop
   git pull origin develop

   # 기능 브랜치 생성
   git checkout -b feat/기능명

   # 작업 후 커밋
   git add .
   git commit -m "커밋 메시지"

   # 브랜치 푸시
   git push origin feat/기능명
   ```

3. **Pull Request 규칙**
   - 모든 기능 브랜치는 반드시 PR을 통해 `develop`으로 병합
   - `gh` CLI를 사용하여 PR 생성
   ```bash
   gh pr create --base develop --head feat/기능명 --title "기능 설명" --body "변경 사항 설명"
   ```
   - PR 제목은 명확하고 간결하게 작성
   - PR 본문에는 변경 사항, 테스트 방법 등을 포함

## 커밋 규칙

### 커밋 메시지 형식
```
타입: 간단한 설명

상세 설명 (선택사항)
```

### 커밋 타입
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `docs`: 문서 수정
- `chore`: 빌드 업무 수정, 패키지 매니저 설정 등
- `test`: 테스트 코드 추가/수정

### 커밋 작성 규칙
1. **기능별 분할 커밋**
   - 하나의 커밋에는 하나의 기능만 포함
   - 큰 기능은 여러 개의 작은 커밋으로 분할
   - 예시:
     - `feat: 프로젝트 초기 설정`
     - `feat: Monaco Editor 통합`
     - `feat: MARP 렌더링 기능 추가`
     - `feat: PDF 내보내기 기능 추가`

2. **의미 있는 커밋 메시지**
   - 무엇을 했는지 명확하게 작성
   - 왜 했는지 필요시 상세 설명에 포함

3. **커밋 예시**
   ```bash
   git commit -m "feat: Monaco Editor 통합

   - @monaco-editor/react 패키지 설치
   - 마크다운 편집기 컴포넌트 구현
   - 에디터 테마 및 언어 설정"
   ```

## 배포 규칙

### GitHub Actions
- `main` 브랜치에 푸시 시 자동으로 GitHub Pages에 배포
- 배포 전 자동으로 빌드 및 테스트 실행
- 배포 실패 시 슬랙 알림 (설정된 경우)

### 배포 프로세스
1. `develop` 브랜치에서 기능 개발 및 테스트 완료
2. `develop` → `main` 병합 시 자동 배포
3. 배포 확인 후 이슈 종료

## 코드 작성 규칙

### TypeScript
- 모든 컴포넌트는 TypeScript로 작성
- `any` 타입 사용 지양
- 인터페이스 및 타입 정의 명확히 작성

### React 컴포넌트
- 함수형 컴포넌트 사용
- 커스텀 훅을 활용한 로직 분리
- 컴포넌트는 `src/components` 디렉토리에 위치

### 스타일링
- TailwindCSS 유틸리티 클래스 사용
- 커스텀 CSS는 최소화
- 반응형 디자인 고려

### 파일 구조
```
src/
├── components/     # React 컴포넌트
├── hooks/          # 커스텀 훅
├── utils/          # 유틸리티 함수
├── types/          # TypeScript 타입 정의
└── App.tsx         # 메인 애플리케이션
```

## PR 리뷰 규칙

1. **리뷰 체크리스트**
   - 코드가 프로젝트 규칙을 따르는가?
   - 타입 정의가 명확한가?
   - 테스트가 통과하는가?
   - 빌드가 성공하는가?

2. **병합 조건**
   - 모든 체크가 통과해야 함
   - 코드 리뷰 승인 필요 (팀 프로젝트인 경우)
   - 충돌 해결 완료

## 주의사항

- `main` 브랜치는 항상 배포 가능한 상태 유지
- `develop` 브랜치에서 충분한 테스트 후 `main`으로 병합
- 기능 브랜치는 작업 완료 및 병합 후 삭제
- 커밋 메시지에 이슈 번호 포함 권장 (예: `feat: 기능 추가 (#123)`)
