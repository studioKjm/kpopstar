# NewsFlow AI Console

> AI 기반 뉴스 기사 관리 콘솔 - kpopstar.ai.kr 내부 CMS

K-POP 및 연예 뉴스 전문 언론사를 위한 AI 기반 기사 관리 시스템입니다.
기자 → 편집자 → 데스크의 제작·검수·발행 과정을 하나의 콘솔에서 처리할 수 있습니다.

## 🚀 주요 기능

### 기사 관리
- **기사 작성**: WYSIWYG 에디터, 카테고리/태그 설정, 노출 옵션
- **기사 목록**: 필터링, 검색, 정렬, 그리드/리스트 뷰
- **발행 워크플로우**: 초안 → 검토 → 발행/예약 발행

### AI 기능 (Beta)
- **🏷️ 자동 태그 생성**: 본문 기반 관련 태그 추출
- **✅ 팩트체크**: 사실 관계, 날짜, 인물 정보 검증
- **✍️ 문체 통일**: 연예 뉴스 보도체 스타일로 통일
- **📋 중복 검사**: 기사 내 중복 정보 탐지
- **🛡️ 민감도 검사**: 부적절한 표현, 금칙어 감지
- **📝 요약**: 다양한 형식의 기사 요약 생성
- **📂 카테고리 추천**: 자동 카테고리 분류
- **✏️ 오탈자 체크**: 맞춤법, 띄어쓰기, 문법 검사

## 🛠️ 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **AI**: Google Gemini Pro
- **배포**: Vercel

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── articles/          # 기사 관련 페이지
│   │   ├── new/           # 새 기사 작성
│   │   └── page.tsx       # 기사 목록
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈 (리다이렉트)
├── components/
│   ├── article/           # 기사 관련 컴포넌트
│   │   ├── AIToolbar.tsx  # AI 도구 모음
│   │   ├── ArticleEditor.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleList.tsx
│   │   └── ArticleStats.tsx
│   ├── layout/            # 레이아웃 컴포넌트
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MainLayout.tsx
│   └── ui/                # 재사용 UI 컴포넌트
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Tag.tsx
│       ├── Panel.tsx
│       └── ...
├── lib/
│   └── ai/                # AI 모듈
│       ├── providers/     # AI 프로바이더 (Base44, Gemini)
│       ├── features/      # AI 기능 함수
│       ├── prompts.ts     # 프롬프트 템플릿
│       └── types.ts       # AI 타입 정의
├── store/                 # Zustand 상태 관리
│   └── articleStore.ts
├── types/                 # TypeScript 타입 정의
│   └── index.ts
└── utils/                 # 유틸리티 함수
    ├── cn.ts              # 클래스 병합
    ├── format.ts          # 포맷팅 함수
    └── validation.ts      # 유효성 검사
```

## 🏃‍♂️ 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 API 키를 설정하세요:

```env
# AI 프로바이더
NEXT_PUBLIC_AI_PROVIDER=gemini

# Gemini API 키 (Google AI Studio에서 발급)
GEMINI_API_KEY=your_gemini_api_key_here
```

**Gemini API 키 발급 방법:**
1. [Google AI Studio](https://aistudio.google.com/) 접속
2. "Get API Key" 클릭
3. 새 API 키 생성 및 복사

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🚀 배포하기

### Vercel 배포 (권장)

자세한 배포 가이드는 [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)를 참고하세요.

**빠른 배포:**

```bash
# 1. 로그인 (npx 사용 - 설치 불필요)
npx vercel login

# 2. 배포
npx vercel --prod
```

**환경 변수 설정:**
- Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
- `NEXT_PUBLIC_AI_PROVIDER=gemini`
- `GEMINI_API_KEY=your_key`

## 📖 사용 가이드

### 기사 작성

1. 사이드바에서 "기사 작성" 클릭
2. 제목, 부제목, 본문 입력
3. 카테고리 및 태그 설정
4. AI 도구를 활용하여 검수
5. "임시 저장" 또는 "기사 발행" 클릭

### AI 기능 사용

1. 본문 작성 후 우측 "AI 도구" 패널 확인
2. 원하는 AI 기능 버튼 클릭
3. 결과 확인 및 적용

## 🎯 대상 사용자

- **기자**: 기사 작성 및 AI 기능 활용
- **편집자**: 문체·사실·민감도 검수
- **데스크**: 최종 발행 승인 및 편성 담당

## 📋 향후 계획

- [ ] 다국어 번역 + 글로벌 기사 관리
- [ ] AI 썸네일 이미지 생성
- [ ] 원문 대비 변경된 문장 diff 표시
- [ ] 기자별 성과 분석
- [ ] 자동 기사 생성 (end-to-end pipeline)

## 📄 라이선스

Private - kpopstar.ai.kr 내부 사용

---

**NewsFlow AI Console** - K-POP 뉴스의 미래를 만듭니다 ✨
