# Formu 생성 이미지 기록

2026-09-14 · Codex 내장 `image_gen.imagegen` 사용. 모델 선택 옵션과 모델 식별 응답이 없으므로 GPT2.5 사용 여부는 확인 불가. 모든 이미지가 새로 생성된 콘셉트이며 고객 제품·실험·서류를 촬영한 증거가 아닙니다. 웹의 한국어 문구는 HTML입니다.

## 1. Hero

- 원본: `image-originals/hero.png`, 1536×1024
- 웹: `public/assets/renewal-v1/hero-768.webp`, `hero-1536.webp`
- 생성 파일 식별: `exec-7e930a08-4311-4796-9c49-60deedc6daf1.png`
- 용도: 첫 화면 이미지, PC 약 1:1.07 / 모바일 1.15:1로 object-fit crop

```text
Use case: product-mockup. Create a premium editorial photograph for Formu, a Korean diffuser brand's product-information and label comparison software landing page. Wide landscape 3:2 image. A sculptural clear glass reed diffuser bottle with a few slender black reeds, one warm amber fragrance sample bottle, matte ivory packaging box with a blank unprinted label, and two precisely aligned ivory paper sheets on a pale ice blue studio tabletop. Subjects composed in the center right with abundant airy negative space and delicate realistic shadows. Tactile paper, translucent glass, precise restrained art direction, contemporary Korean premium SaaS visual language. Palette warm ivory, translucent cobalt blue accents, dark navy reeds. Soft daylight from upper left, high-end still life photography. No text, no letters, no logo, no watermark, no people, no fake software UI. This is a conceptual still life, not a real client or regulatory certificate. Save generated image and return its local path.
```

## 2. Workflow

- 원본: `image-originals/workflow.png`, 1536×1024
- 웹: `public/assets/renewal-v1/workflow-768.webp`, `workflow-1536.webp`
- 생성 파일 식별: `exec-2634dc05-4a91-43ad-9995-dd3d9d4efda3.png`
- 용도: 자료 입력·비교 흐름 옆 정물 사진

```text
Use case: product-mockup. Formu website section image, premium editorial studio still life about organizing fragrance product information. Landscape 3:2. Top-down composition of two ivory paper specification sheets with subtle abstract ruled lines but absolutely no legible writing, a small transparent blue acrylic rectangle aligning the sheets, one clear cylindrical fragrance sample bottle with black cap, a warm ivory blank label roll with one short unfurled label. Objects arranged with deliberate generous spacing on a soft warm off-white tabletop. Tangible paper fiber, translucent glass and restrained cobalt accent, subtle daylight shadows from upper left. Quiet precise Korean design magazine photography. No text, logos, watermarks, certificates, people or software screenshots. Return local saved file path.
```

## 3. Collection

- 원본: `image-originals/collection.png`, 1536×1024
- 웹: `public/assets/renewal-v1/collection-768.webp`, `collection-1536.webp`
- 생성 파일 식별: `exec-fb3b93ba-ff60-4c2c-8090-06fab8fbfeb0.png`
- 용도: 출시 알림 신청 영역

```text
Use case: product-mockup. Premium landscape 3:2 still-life photography for Formu fragrance software final call-to-action. Close carefully balanced composition of three clear cylindrical fragrance bottles in graduated sizes, one slim cobalt blue translucent glass panel and one upright ivory blank carton, standing on a single pale blue rectangular low plinth. Small amber liquid amounts in two bottles, brushed black caps. Light blue seamless studio background, soft clear daylight, realistic refractions and contact shadows, plenty of breathing space. Consistent quiet Korean editorial aesthetic, tactile glass and paper. No letters, no text, no logos, no watermark, no people, no plants, no charts, no certificates. Return local saved path.
```

## 가공 및 재생성

원본 PNG를 보존한 뒤 Pillow로 Lanczos 리사이즈 및 quality=84 WebP 인코딩만 수행했습니다. 사진 내용·색상 편집은 하지 않았습니다. 1536px 이미지 3장의 합계는 205,910 bytes, 768px 이미지 3장의 합계는 63,446 bytes입니다. 이는 이미지 파일 합계이며 전체 페이지 전송량이나 성능 점수는 아닙니다.

재생성 시 푸른 배경·아이보리 종이·맑은 유리의 일관성을 유지하고 글자·실제 규제 인증처럼 보이는 요소를 넣지 마세요. 생성 결과의 실제 모습과 모바일 crop을 다시 확인하세요. 기존 브랜드 로고를 교체하지 마세요.
