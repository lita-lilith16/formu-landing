/* Formu: explicit steps, local comparison, no storage or network requests. */
(() => {
  const $ = id => document.getElementById(id);
  const fields = ['Product', 'Volume', 'Notice', 'Revision'];
  let mode = 'guided', draft = null, guide = 'mismatch';
  const read = () => Object.fromEntries(['ref','label'].map(side => [side, Object.fromEntries(fields.map(f => [f.toLowerCase(), $(side+f).value]))]));
  const fill = data => { for (const side of ['ref','label']) for (const f of fields) $(side+f).value = data[side][f.toLowerCase()] || ''; $('refNoticeNoData').checked = !!data.ref.noticeNoData; };
  const saveDraft = () => { if (mode === 'custom') { draft = read(); draft.ref.noticeNoData = $('refNoticeNoData').checked; } };
  function panel(step) {
    $('uxApp').dataset.step = step;
    ['welcomePanel','editorPanel','reportPanel'].forEach((id,i) => $(id).hidden = i+1 !== step);
    document.querySelectorAll('.ux-stepper li').forEach((li,i) => { li.toggleAttribute('data-done', i+1 < step); if (i+1 === step) li.setAttribute('aria-current','step'); else li.removeAttribute('aria-current'); });
  }
  function editor() {
    $('uxApp').dataset.mode = mode;
    const guided = mode === 'guided';
    for (const side of ['ref','label']) for (const f of fields) $(side+f).readOnly = guided && !(side === 'label' && f === 'Volume');
    $('try150').hidden = !guided;
    $('returnWelcome').hidden = !guided;
    $('editorEyebrow').textContent = guided ? 'STEP 02 / CHANGE ONE THING' : mode === 'example' ? 'SAMPLE / TRY THIS CASE' : 'YOUR PRODUCT / TEXT COMPARISON';
    $('editorTitle').textContent = guided ? '라벨의 용량을 바꿔보세요.' : '기준과 라벨 내용을 입력하세요.';
    $('editorDescription').textContent = guided ? '기준은 200mL입니다. 라벨을 150mL로 바꾸면 어떤 차이가 생길까요?' : '제품 정보표의 내용을 왼쪽에, 인쇄할 라벨의 내용을 오른쪽에 입력하세요. 파일 업로드는 아직 지원하지 않습니다.';
    $('btnRunCompare').textContent = guided ? '차이 확인하기 →' : '입력한 정보 비교하기 →';
    panel(2); changed();
    $(guided ? 'labelVolume' : 'refProduct').focus({preventScroll:true});
  }
  function changed() {
    $('btnRunCompare').disabled = mode === 'guided' && $('labelVolume').value === '200mL';
    $('editHint').textContent = mode === 'guided' ? ($('btnRunCompare').disabled ? '라벨 용량을 입력하거나 ‘150mL로 바꿔보기’를 눌러보세요.' : '준비됐어요. ‘차이 확인하기’를 눌러보세요.') : '빈 기준 정보는 ‘자료 부족’으로 표시합니다. 문서 버전은 선택 사항입니다.';
    $('refNotice').disabled = $('refNoticeNoData').checked;
    saveDraft();
  }
  const actions = {'일치':'다른 항목도 확인하세요. 일치는 입력값의 비교 결과입니다.', '불일치':'실제 제품 정보를 확인하고 기준 자료 또는 라벨을 수정하세요.', '누락':'빠진 라벨 내용을 원본 자료에서 확인해 입력하세요.', '자료 부족':'기준 자료를 먼저 확보한 뒤 다시 비교하세요.', '입력 해석 불가':'숫자와 단위를 확인해 다시 입력하세요. 예: 200mL'};
  function compare() {
    saveDraft();
    const data = read();
    const rows = fields.filter(f => !(f === 'Revision' && !data.ref.revision.trim() && !data.label.revision.trim())).map(f => {
      const names = {Product:'제품명',Volume:'용량',Notice:'주의 문구',Revision:'문서 버전'};
      const a = data.ref[f.toLowerCase()], b = data.label[f.toLowerCase()];
      const noData = f === 'Notice' && $('refNoticeNoData').checked;
      return {name:names[f], a:noData ? '' : a,b, ...(f === 'Volume' ? compareVolumeField(a,b,false) : compareTextField(a,b,names[f],noData))};
    });
    const issues = rows.filter(r => r.status !== '일치'), matches = rows.filter(r => r.status === '일치');
    const card = r => `<article class="comparison-note"><div class="comparison-note-head"><strong>${r.name}</strong><span>${r.status === '입력 해석 불가' ? '해석 불가' : r.status}</span></div><div class="value-pair"><div><small>기준 제품 정보</small><p>${escapeHtml(r.a) || '<em>자료 없음</em>'}</p></div><span aria-hidden="true">→</span><div><small>비교할 라벨</small><p>${escapeHtml(r.b) || '<em>입력 없음</em>'}</p></div></div><p class="comparison-reason">${r.reason}</p><p class="comparison-action"><span>다음에 할 일</span>${actions[r.status]}</p></article>`;
    $('reportTitle').textContent = issues.length ? `${issues.length}개 항목을 다시 확인하세요.` : '입력한 정보가 모두 일치해요.';
    $('reportDescription').textContent = mode === 'guided' ? '합성 샘플의 제품명·용량·주의 문구·문서 버전 4개 항목을 비교했습니다.' : `${rows.length}개 항목을 비교했습니다. 아래에서 이유와 다음 행동을 확인하세요.`;
    $('reportCount').textContent = `${issues.length} / ${rows.length} 확인 필요`;
    $('resultCards').innerHTML = issues.map(card).join('');
    $('matchedDetails').hidden = !matches.length;
    $('matchedDetails').open = !issues.length;
    $('matchedSummary').textContent = `일치한 ${matches.length}개 항목 보기`;
    $('matchedCards').innerHTML = matches.map(card).join('');
    $('fixSample').hidden = mode !== 'guided' || !issues.length;
    $('useMine').hidden = mode === 'custom';
    $('sampleFeedback').textContent = mode === 'guided' && !issues.length ? '이제 순서를 익혔어요. 내 정보도 같은 방식으로 비교할 수 있습니다.' : '';
    panel(3); $('reportTitle').focus({preventScroll:true});
  }
  function custom() {
    saveDraft(); mode = 'custom';
    fill(draft || {ref:{},label:{}}); editor();
  }
  $('startGuided').onclick = () => { saveDraft(); mode='guided'; fill(SCENARIOS.S01); editor(); };
  $('directEntry').onclick = custom;
  $('useMine').onclick = custom;
  $('try150').onclick = () => { $('labelVolume').value='150mL'; changed(); $('btnRunCompare').focus({preventScroll:true}); };
  $('btnRunCompare').onclick = compare;
  $('fixSample').onclick = () => { $('labelVolume').value='200mL'; compare(); };
  $('editAgain').onclick = editor;
  $('returnWelcome').onclick = () => { panel(1); $('startGuided').focus({preventScroll:true}); };
  document.querySelectorAll('.editor-panel input,.editor-panel textarea').forEach(el => el.addEventListener('input', changed));
  const examples = {
    match:['01','일치','200mL','0.2L','단위가 달라도 같은 양이에요.','200mL와 0.2L는 단위를 환산하면 같은 용량입니다.','나머지 항목도 확인하세요. 텍스트 일치는 법적 적합성 판단이 아닙니다.'],
    mismatch:['02','불일치','200mL','150mL','용량이 서로 달라요.','기준 제품 정보는 200mL인데 라벨에는 150mL로 적혀 있습니다.','실제 제품 용량을 확인하고, 기준 자료 또는 라벨을 수정하세요.'],
    missing:['03','누락','200mL','','라벨에 용량이 빠졌어요.','기준 정보에는 용량이 있지만 라벨의 용량 칸은 비어 있습니다.','원본 자료에서 용량을 확인해 라벨에 입력하세요.'],
    insufficient:['04','자료 부족','','200mL','비교할 기준이 없어요.','라벨에 200mL가 적혀 있어도 기준 자료가 없으면 같은지 판단할 수 없습니다.','기준 제품 정보를 확보한 뒤 다시 비교하세요.'],
    invalid:['05','해석 불가','200mL','-5mL','용량 표기를 확인해 주세요.','음수로 적힌 용량은 유효한 제품 용량으로 비교할 수 없습니다.','숫자와 단위를 원본에서 확인해 다시 입력하세요. 예: 200mL']
  };
  const tabs = [...document.querySelectorAll('[data-guide]')];
  function select(key) {
    guide=key; const e=examples[key];
    tabs.forEach(t => { const selected=t.dataset.guide===key; t.setAttribute('aria-selected',selected); t.tabIndex=selected?0:-1; });
    $('guide-panel').setAttribute('aria-labelledby','guide-tab-'+key);
    $('guide-panel').dataset.state=key;
    ['proofCode','guideStatusName','proofBaseline','proofValue','guideExampleTitle','guideExampleReason','guideExampleAction'].forEach((id,i)=>$(id).textContent=e[i] || (id==='proofBaseline'?'자료 없음':'—'));
  }
  tabs.forEach((t,i)=>{t.onclick=()=>select(t.dataset.guide);t.onkeydown=e=>{let n=i; if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%tabs.length;else if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();select(tabs[n].dataset.guide);tabs[n].focus();};});
  $('tryGuideExample').onclick=()=>{saveDraft();mode='example'; const data=JSON.parse(JSON.stringify(SCENARIOS.S01));data.ref.volume=examples[guide][2];data.label.volume=examples[guide][3];fill(data);$('uxApp').dataset.mode=mode;compare();$('compare-demo').scrollIntoView({behavior:'instant',block:'start'});};
  select(guide);
})();
