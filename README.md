# 한글코 (Hangul-Co)

중학생을 위한 한글 기반 웹 코딩 체험 사이트

## 프로젝트 개요

한글코는 중학생들이 영어와 복잡한 프로그래밍 언어 문법 없이도 웹 개발의 기본 개념을 체험할 수 있도록 만든 교육용 플랫폼입니다.

### 주요 기능

- **한글 명령어**: 영어 대신 한글로 코드 작성
- **실시간 미리보기**: 코드 변경사항을 즉시 확인
- **직관적인 UI**: 중앙 프리뷰 영역 + 하단 에디터 영역

## 기술 스택

- **프레임워크**: Next.js 15.5
- **UI 라이브러리**: React 19
- **스타일링**: Tailwind CSS
- **언어**: TypeScript

## 프로젝트 구조

```
hangul-co/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx             # 메인 페이지
│   └── globals.css          # 전역 스타일
├── components/
│   ├── PreviewArea.tsx      # 프리뷰 영역 컴포넌트
│   └── EditorArea.tsx       # 에디터 영역 컴포넌트
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 한글 명령어 예시 (예정)

```
부모.배경색 = 빨강
버튼.텍스트 = 안녕하세요!
제목.색 = 파랑
```

위 명령어는 다음과 같이 파싱됩니다:

```javascript
document.body.style.backgroundColor = 'red'
document.querySelector('#sample-button').textContent = '안녕하세요!'
document.querySelector('h1').style.color = 'blue'
```

## 다음 단계

- [ ] 한글 → JavaScript 파싱 로직 구현
- [ ] 다양한 명령어 지원 (색상, 텍스트, 크기, 위치 등)
- [ ] 에러 처리 및 사용자 피드백
- [ ] 튜토리얼 및 예제 추가
- [ ] 저장/불러오기 기능

## 라이선스

MIT
