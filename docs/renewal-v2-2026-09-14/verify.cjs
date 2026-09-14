const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
(async()=>{
const http=require('http'); const pub=path.resolve(__dirname,'../../public');
const server=http.createServer((req,res)=>{const file=path.join(pub,req.url==='/'?'index.html':decodeURIComponent(req.url));if(!file.startsWith(pub+path.sep)){res.writeHead(403);return res.end();} fs.readFile(file,(e,b)=>{if(e){res.writeHead(404);return res.end();}const types={'.html':'text/html','.css':'text/css','.webp':'image/webp','.png':'image/png'};res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(b);});});
await new Promise(r=>server.listen(4180,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});
await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';}await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
const out=__dirname;
await page.screenshot({style:'.navbar,.deck-nav{visibility:hidden!important}',path:path.join(out,'desktop-full.png'),fullPage:true});
await page.screenshot({style:'.navbar,.deck-nav{visibility:hidden!important}',path:path.join(out,'desktop-hero.png')});
const initial=await page.locator('#summaryChips').innerText();
const checks=await page.evaluate(()=>({sections:document.querySelectorAll('main section').length,faq:document.querySelectorAll('details').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),blankVolume:compareVolumeField('','',false).status,blankText:compareTextField('','','제품명',false).status,unit:compareVolumeField('200mL','0.2L',false).status,mass:compareVolumeField('200mL','200g',false).status,negative:compareVolumeField('200mL','-5mL',false).status,anchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)}));
await page.locator('#labelVolume').fill('150mL');
await page.getByRole('button',{name:/비교 실행/}).click();
checks.changed=await page.locator('#summaryChips').innerText();
await page.locator('summary').first().click();checks.faqOpen=await page.locator('details').first().evaluate(e=>e.open);
const scenarios=await page.evaluate(()=>Object.entries(SCENARIOS).map(([id,s])=>({id,results:[compareTextField(s.ref.product,s.label.product,'제품명',false).status,compareVolumeField(s.ref.volume,s.label.volume,false).status,compareTextField(s.ref.notice,s.label.notice,'주의 문구',s.ref.noticeNoData).status,compareTextField(s.ref.revision,s.label.revision,'버전',false).status]})));
for(const [width,height] of [[390,844],[320,760],[768,1024]]){
 await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({style:'.navbar,.deck-nav{visibility:hidden!important}',path:path.join(out,`width-${width}-full.png`),fullPage:true});
 checks['buttonHeight'+width]=await page.locator('#btnRunCompare').evaluate(e=>e.getBoundingClientRect().height);
 checks['overflow'+width]=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&getComputedStyle(e).position!=='absolute'&&!e.closest('.results-table-wrap')}).slice(0,8).map(e=>e.className)}));
}
await page.setViewportSize({width:1440,height:1000});
await page.route('**/api/signup',route=>route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({success:true})}));
await page.locator('#applicantName').fill('UI test');await page.locator('#applicantEmail').fill('ui@example.invalid');await page.locator('#btnSubmitSignup').click();
await page.waitForFunction(()=>document.getElementById('signupStatusMsg').textContent.includes('정상적으로'));
checks.signupSuccessVisible=await page.locator('#signupStatusMsg').isVisible();checks.signupText=await page.locator('#signupStatusMsg').innerText();
await page.unroute('**/api/signup');await page.route('**/api/signup',route=>route.abort());
await page.locator('#applicantName').fill('UI test');await page.locator('#applicantEmail').fill('ui@example.invalid');await page.locator('#btnSubmitSignup').click();
await page.waitForFunction(()=>document.getElementById('signupStatusMsg').textContent.includes('네트워크'));
checks.signupErrorVisible=await page.locator('#signupStatusMsg').isVisible();checks.signupErrorText=await page.locator('#signupStatusMsg').innerText();
await page.emulateMedia({reducedMotion:'reduce'});checks.reducedMotion=await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior);
const result={initial,checks,scenarios,errors,signupScope:'Mocked responses only. No submission to real server or database.'};
const assert=require('node:assert/strict');
assert.equal(checks.sections,8);assert.equal(checks.faq,4);assert.ok(checks.images.every(i=>i.loaded));assert.equal(checks.blankVolume,'자료 부족');assert.equal(checks.blankText,'자료 부족');assert.equal(checks.unit,'일치');assert.equal(checks.mass,'자료 부족');assert.equal(checks.negative,'입력 해석 불가');assert.deepEqual(checks.anchors,[]);assert.ok(checks.changed.includes('불일치 1'));assert.ok(checks.faqOpen);assert.ok(checks.signupSuccessVisible);assert.ok(checks.signupErrorVisible);assert.equal(checks.reducedMotion,'auto');assert.deepEqual(errors,[]);for(const w of [320,390,768]){assert.equal(checks['overflow'+w].scroll,w);assert.ok(checks['buttonHeight'+w]<60);}
const expected=[['일치','일치','일치','일치'],['일치','불일치','일치','일치'],['불일치','일치','일치','일치'],['일치','일치','누락','일치'],['일치','일치','일치','불일치'],['일치','일치','일치','일치'],['일치','일치','일치','일치'],['불일치','불일치','일치','일치'],['일치','일치','자료 부족','일치'],['일치','입력 해석 불가','일치','일치']];scenarios.forEach((s,i)=>assert.deepEqual(s.results,expected[i]));result.assertions='PASS';
fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await page.emulateMedia({reducedMotion:'reduce'});
await page.setViewportSize({width:1440,height:1000});
for(const id of ['compare-demo','guide','stages']) await page.locator('#'+id).screenshot({style:'.navbar,.deck-nav{visibility:hidden!important}',path:path.join(out,'landing-'+id+'.png')});
await page.goto('http://127.0.0.1:4180/pitch_deck.html',{waitUntil:'networkidle'});
await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
const deckChecks={slides:await page.locator('.slide').count(),overflows:[]};assert.equal(deckChecks.slides,10);
for(let i=1;i<=10;i++){await page.locator('#slide-'+i).screenshot({style:'.navbar,.deck-nav{visibility:hidden!important}',path:path.join(out,'deck-'+String(i).padStart(2,'0')+'.png')});}
await page.locator('#slide-select').selectOption('7');await page.waitForFunction(()=>location.hash==='#slide-7');assert.equal(await page.locator('#slideIndicator').innerText(),'7 / 10');
await page.locator('#next').click();assert.equal(await page.locator('#slideIndicator').innerText(),'8 / 10');
await page.locator('#prev').click();assert.equal(await page.locator('#slideIndicator').innerText(),'7 / 10');deckChecks.navigation='PASS';
for(const width of [390,320,768]){await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo(0,0));const metrics=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));assert.equal(metrics.scroll,width);deckChecks.overflows.push(metrics);if(width===390){for(const i of [1,3,4,6,9,10])await page.locator('#slide-'+i).screenshot({style:'.navbar,.deck-nav{visibility:hidden!important}',path:path.join(out,'deck-mobile-'+i+'.png')});}}
await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({media:'print'});
deckChecks.print=await page.locator('.slide').evaluateAll(slides=>slides.map(s=>({id:s.id,height:s.clientHeight,scroll:s.scrollHeight})));
assert.ok(deckChecks.print.every(s=>s.scroll<=s.height+1));assert.deepEqual(errors,[]);deckChecks.errors=errors;deckChecks.assertions='PASS';
fs.writeFileSync(path.join(out,'deck-verification.json'),JSON.stringify(deckChecks,null,2));console.log(JSON.stringify(deckChecks,null,2));
await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
