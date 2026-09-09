# Formu (포뮤) — B2B 규제 자동화 & 원스톱 출시 OS

화장품·향료 배합표 업로드 1초 만에 식약처 알레르기 25종 판정 및 환경부 CHEMP 배합비율표를 자동 생성하는 B2B RegTech OS 랜딩페이지 및 사전신청 시스템.

## 주요 기능
- **클라이언트**: Toss Blue 톤 미니멀 B2B SaaS 랜딩페이지, 모바일(375px) 완벽 반응형, WCAG AA 다크모드/라이트모드 지원, 웹 접근성 준수 사전신청 폼
- **백엔드**: Express.js 기반 방문 추적 (`/api/visit`), 사전신청 접수 (`/api/signup`), 통계 및 엑셀 호환 CSV 리포트 (`/api/report`)

## 실행 방법
```bash
npm install
node server.js
```
