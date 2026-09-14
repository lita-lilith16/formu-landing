# Formu — 전체 시각 리뉴얼 v4 인수인계

작성일: 2026-09-14. 최신 요청: 2027년을 고려한 개성·신뢰, Apple Liquid Glass와 Microsoft Fluent의 심미성, 로고·파비콘 재설계.
상태: 로컬 소스 반영 및 Chrome 검증 완료. Render 배포·Git push는 하지 않았다. 로컬 미리보기 http://127.0.0.1:4184 (미리보기 서버 실행 중에만 사용 가능). 공개 URL이 아니다.

## 1. 최신 구현 위치

- public/index.html: 전체 8개 영역과 푸터 재구성. 종전의 500줄 이상 인라인 스타일 제거.
- public/assets/atelier-v4/site.css: 전체 색·타입·구성·glass 소재·반응형·접근성 보조 설정.
- public/assets/atelier-v4/experience.js: 기존 v3 단계별 비교 컨트롤러를 v4 경로로 가져옴. 실제 계산 함수는 index.html에 유지.
- public/assets/atelier-v4/site.js: 히어로 CTA에서 샘플 편집으로 이동, 실제 패널 전환에만 짧은 움직임 적용.
- public/pitch_deck.html + public/assets/atelier-v4/deck.css: 동일한 소재·색·타이포그래피와 새 심볼 적용. 10장 구성, 도표, 사업 수치의 가설 표기 유지.
- public/assets/atelier-v4/symbol.svg: 주 심볼 원본.
- public/favicon.svg, favicon.png, favicon.ico, apple-touch-icon.png: 실제 서비스 아이콘 교체.
- public/assets/atelier-v4/brand/: 단색·반전 SVG, 투명 PNG, 각 크기 파비콘.
- .21st/design.json 및 DESIGN.md: 최신 방향 기록.

의존성: site.css는 기존 ux-v3/experience.css를 기본 컴포넌트 스타일로 import한다. 해당 파일을 제거하지 말 것. deck.css는 renewal-v2/deck.css 이후 로드한다. v1/v2 이미지 중 랜딩은 새 사진 1종으로 교체했으며 피치덱 커버의 기존 유리 라벨 이미지는 새 소재 방향과 맞아 유지했다.

## 2. 디자인 원칙과 출처

2027년의 확정 트렌드라고 주장하지 않는다. 현재 확인 가능한 2026년 전망과 공식 디자인 시스템에서 지속 가능성이 있는 원칙을 골라 2027년을 향한 디자인 가설로 적용했다.

- [Webflow, 8 web design trends to watch in 2026](https://webflow.com/blog/web-design-trends-2026): 브랜드 고유 효과, 제작 완성도, 미술적 표현과 UI의 결합, 간결한 문구. 이 문서는 방향의 근거이며 전환율 증거가 아니다.
- [Adobe 2026 Creative Trends](https://business.adobe.com/uk/resources/creative-trends-report.html): 촉감·감각·연결·문화적 맥락. 포뮤는 종이, 유리, 향 제품 작업의 맥락을 선택했다. 페이지 수치나 소비자 비율을 제품 성과로 옮기지 않았다.
- [Apple, Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/): 콘텐츠 위에 떠 있는 내비게이션 층에 유리 소재를 절제해 사용하는 원칙. web CSS로 빛의 경계와 배경 확산을 구현했으며 Apple의 네이티브 렌더러를 사용하거나 복제한 것은 아니다.
- [Microsoft Fluent 2, Material](https://fluent2.microsoft.design/material): Solid, Acrylic, Mica의 역할 구분. Acrylic은 반투명 소재, Mica는 불투명한 기반 재질이다. 이 사이트는 불투명한 읽기 면과 반투명 컨트롤의 역할을 나눴다.
- [Microsoft Fluent 2, Motion](https://fluent2.microsoft.design/motion): 자연스럽고 일관된 움직임. 변화를 설명하는 짧은 전환에 적용했다.
- 21st 검색: liquid glass navigation / editorial typography / interactive comparison. Liquid Morph Floating Menu, Glassmorphism Navigation, Apple Tahoe Liquid Glass Button 등의 검색 결과를 확인했다. 앞선 Outline/Kinto 미리보기 검토와 연결했으며 컴포넌트 코드를 설치·복사하지 않았다. React 종속성을 추가하지 않고 기존 HTML/CSS/JS를 유지했다.

## 3. 사고 프레임 — PR + IS

PR(문제 재정의): ‘트렌드 효과를 추가’하는 과제에서 ‘향 브랜드가 자신의 정밀한 자료 작업을 맡길 수 있다고 느끼는 고유한 경험’으로 바꿨다. 사람의 제작 감각은 무작위 낙서·기울임의 양보다 이미지 선택, 문구 편집, 크기 대비, 자료와 조작의 관계에 있다고 판단했다.

IS(해결안 조합): 강한 편집 타이포그래피 + 실제 작업 맥락의 사진 + 유리 조작층 + 불투명한 데이터 면을 조합했다. 감각적 첫인상과 읽기 편한 작업 화면이 서로 다른 역할을 하도록 설계했다. 아래 대안은 디자인 판단이며 실험 성과 점수가 아니다.

|대안|결정|이유|
|---|---|---|
|전 화면 유리 카드|제외|데이터와 조작의 구분이 약해짐|
|유리 내비게이션·비교 컨트롤|반영|떠 있는 조작층이라는 역할이 명확함|
|종이와 유리의 실물 작업 맥락|반영|향 제품 자료 비교라는 포뮤의 맥락|
|큰 한글 제목과 절제된 세리프 영문|반영|편집적 인상과 브랜드 기억점|
|동일한 카드 그리드 반복|제외|섹션별 목적이 구분되지 않음|
|데이터 수정 시에만 짧은 움직임|반영|행동과 결과의 연결을 설명|
|커서 추종·무한 부유·자동 재생|제외|정확한 읽기와 모바일 조작을 방해|
|평면 벡터 심볼|반영|16px에서도 내부 여백과 형태 유지|
|로고에 광택·광원 효과 삽입|제외|아이콘 자체가 흐려지는 원인 재발|
|익명 고객 후기·성과 배지|제외|확인되지 않은 사회적 증거 없음|

확인 사실: 기존 favicon.svg에는 PNG 데이터가 포함되어 있었다. 새 SVG는 path와 rect만 사용한다. 현재 비교는 브라우저 내부 텍스트 비교이며 파일 업로드는 예정이다.
추론: 물성의 대비와 섹션별 편집 구성이 기존 카드 반복보다 개성과 정보 계층을 분명하게 한다.
미확인: 실제 사용자의 선호도·전환율, 2027년 시장 전체의 시각 트렌드. 인간 디자이너가 수작업으로 제작한 사이트라고 주장하지 않는다. 생성 이미지와 코드 기반 디자인을 사용했다.

## 4. 섹션별 변화

- Hero: 비대칭 제목·설명 구성. 코발트 세리프 Formu, 넓은 작업대 콘셉트 사진, 실제 샘플로 연결되는 유리 비교 버튼. 두 CTA는 모두 편집 가능한 샘플로 연결.
- 01: 이미지와 3개 카드 반복을 없애고 편집형 설명 + 번호가 있는 수평 구분선으로 정리.
- 02: 세이지 기반 작업면, 반투명 도구 바, 불투명 라벨 두 장. 샘플은 라벨 자체의 용량 칸을 편집하며 모바일 첫 단계의 장식용 종이는 숨긴다. 비교→수정→일치 확인과 직접 입력 우회 경로를 유지.
- 03: 유리 탭 선택기, 실물처럼 기울어진 라벨, 기준 정보를 보여주는 반투명 쪽지. 누락·자료 부족·해석 불가의 표시가 실제 예시에 맞춰 바뀐다.
- 04: 짙은 청록색 영역과 단계별 구분선. 현재/예정을 색·텍스트로 모두 구분.
- 05: 큰 금액과 구성 펼치기 방식. 현재 결제 불가와 검증 예정 가격을 표시.
- 06: 질문 중심 아코디언. 보조 장식보다 읽는 순서를 우선.
- 07: 투명도가 낮은 신청 면, 실제 벡터 심볼, 개인정보 안내 유지.
- Footer: 큰 워드마크, 연락처, 피치덱 링크, 서비스 범위.
- Pitch deck: 콘텐츠와 수치·목표 표기는 유지. 색·타입·컨트롤·코너를 맞추고 마지막 장은 짙은 바탕으로 마무리. 기존 서로 다른 도표 유형 유지.

## 5. 심볼·파비콘

심볼은 F를 한 경로로 연결하고 두 가로획의 끝을 같은 각도로 잘랐다. 내부 굴곡과 사선 끝의 대비를 사용한다. 특정 외부 로고를 복사하지 않았다. 상표 등록이나 독점적 사용 가능성 검토를 수행했다는 뜻은 아니다.

- 원본 viewBox: 64 × 64. 기본 색 #3158e8, 단색 #192d31, 반전 #f7f9ef.
- 마스터: public/assets/atelier-v4/symbol.svg (투명 배경).
- favicon.svg: 어두운 바탕 + 밝은 심볼, 광택/그림자 없음.
- PNG: 16, 32, 48, 64, 180, 192, 512px. favicon.png는 32px, apple-touch-icon은 180px.
- ICO: 16/32/48/64px 포함. PNG를 SVG에 다시 넣지 말 것.
- favicon 링크에 ?v=4를 넣어 이전 캐시와 구분.
- brand-preview.html/png: 심볼 조합, 작은 아이콘, 단색과 반전 확인용.
- 재출력: export-brand.cjs → Pillow로 ICO 저장. Sharp는 번들 런타임 사용. 새로운 라이브러리 설치 없음.

## 6. 동작·접근성·검증

verification.json 및 extra-verification.json: Chrome 검증 PASS.
샘플 시작/변경/비교/교정, 직접 입력, 200mL↔0.2L, 빈 기준, g↔mL 임의환산 방지, 선택 버전 제외, 초안 보존, HTML 삽입 방어, 다섯 결과 예시, 방향키/Home/End, FAQ, 실제 ID 앵커, 이미지 로드, 320/390/768px 가로 넘침, JavaScript 오류를 확인했다. 신청은 성공·실패를 모의 응답으로 테스트했고 실제 고객 데이터는 제출하지 않았다.

피치덱은 10장, 이전/다음/선택 이동, 모바일 넘침, 인쇄 시 내부 콘텐츠 잘림을 확인했다. 데스크톱/모바일 화면과 로고 크기를 직접 확인했다. 21st review는 정보성 색상 하드코딩 알림을 반환했으며 구조/동작 오류를 제시하지 않았다. 색상 토큰은 .21st에 기록했다. 별도의 완전한 WCAG 적합성 심사는 아니다.

prefers-reduced-motion, prefers-reduced-transparency, backdrop-filter 미지원, forced-colors 대응 CSS를 포함했다. 줄어든 모션 설정에서 스크롤/전환을 끈다. 비교에는 인위적인 ‘AI 분석 중’ 로딩을 넣지 않았다.

로컬 미리보기 서버는 /api/signup을 503과 명확한 안내문으로 응답해 실수로 신청이 접수되지 않게 한다. 이 처리는 preview-server.cjs에만 있고 실제 server.js는 수정하지 않았다.

## 7. 재현 및 전달

검증:
`NODE_PATH=/Users/matilda.c/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node docs/atelier-v4-2026-09-14/verify.cjs`

미리보기:
`node docs/atelier-v4-2026-09-14/preview-server.cjs`

확인 주소: http://127.0.0.1:4184 / http://127.0.0.1:4184/pitch_deck.html

백업: index.before.html, pitch_deck.before.html, brand-before/. 기존 v1/v2/v3 폴더는 유지했다. 이전 docs의 결과를 최신 캡처로 오인하지 말 것. 최신은 atelier-v4 폴더다.

실제 배포, 실제 기기 Safari 확인, 사용성 조사, 서버의 기존 접수/관리자 API 보완은 이번 완료 범위에 포함하지 않는다. 공개 사이트에 반영되었다고 보고하지 말 것.
