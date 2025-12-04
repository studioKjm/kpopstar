#!/bin/bash

# Base44 연동을 위한 프로젝트 준비 스크립트

echo "🚀 Base44 연동 준비 중..."

# 1. 필수 파일 목록 생성
echo "📋 필수 파일 목록 생성 중..."
cat > base44-files-list.txt << EOF
# Base44에 복사할 필수 파일/폴더

## 소스 코드
src/

## 설정 파일
package.json
package-lock.json
next.config.js
tailwind.config.ts
tsconfig.json
postcss.config.js

## 정적 파일 (있는 경우)
public/

## 환경 변수 예시 (실제 값은 Base44 Settings에서 설정)
.env.example
EOF

echo "✅ base44-files-list.txt 생성 완료"

# 2. 프로젝트 구조 출력
echo ""
echo "📁 프로젝트 구조:"
tree -L 2 -I 'node_modules|.next|.git|*.md' 2>/dev/null || find . -maxdepth 2 -not -path '*/node_modules/*' -not -path '*/.next/*' -not -path '*/.git/*' | head -20

# 3. Base44에 필요한 정보 출력
echo ""
echo "📝 Base44 Settings에 설정할 환경 변수:"
echo ""
echo "NEXT_PUBLIC_AI_PROVIDER=gemini"
echo "GEMINI_API_KEY=your_gemini_api_key_here"
echo ""

echo "✅ 준비 완료!"
echo ""
echo "다음 단계:"
echo "1. Base44 앱 코드 에디터 접속"
echo "2. 위 파일들을 Base44 앱에 복사"
echo "3. Base44 Settings에서 환경 변수 설정"
echo "4. npm install 실행"
echo "5. Publish 버튼 클릭"

