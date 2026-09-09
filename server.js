const express = require('express');
const path = require('path');
const fs = require('fs');
const { stringify } = require('csv-stringify');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure db.json exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ visits: [], signups: [] }, null, 2), 'utf-8');
}

function getDb() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return { visits: [], signups: [] };
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db:', err);
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 1. 방문 추적 API (/api/visit)
app.post('/api/visit', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const referrer = req.body.referrer || req.headers.referer || 'direct';
  const pathName = req.body.path || '/';

  const db = getDb();
  const newVisit = {
    id: db.visits.length + 1,
    ip: ip.replace(/^.*:/, ''), // clean ipv6 localhost
    userAgent,
    referrer,
    path: pathName,
    timestamp: new Date().toISOString()
  };

  db.visits.push(newVisit);
  saveDb(db);

  return res.status(200).json({ success: true, visitId: newVisit.id });
});

// 2. 사전신청 접수 API (/api/signup)
app.post('/api/signup', (req, res) => {
  const { email, name, brandName, productCategory, message } = req.body;

  // Basic validation
  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({
      success: false,
      error: '올바른 이메일 주소를 입력해 주세요.'
    });
  }

  const db = getDb();

  // Duplicate check
  const existing = db.signups.find((s) => s.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({
      success: false,
      error: '이미 사전신청이 완료된 이메일 계정입니다.'
    });
  }

  const newSignup = {
    id: db.signups.length + 1,
    email: email.trim().toLowerCase(),
    name: (name || '').trim(),
    brandName: (brandName || '').trim(),
    productCategory: productCategory || '기타',
    message: (message || '').trim(),
    createdAt: new Date().toISOString()
  };

  db.signups.push(newSignup);
  saveDb(db);

  return res.status(201).json({
    success: true,
    message: '사전신청이 성공적으로 접수되었습니다. 오픈 시 가장 먼저 안내해 드리겠습니다!',
    data: { id: newSignup.id, email: newSignup.email }
  });
});

// 3. 리포트 API (/api/report)
app.get('/api/report', (req, res) => {
  const db = getDb();
  const totalVisits = db.visits.length;
  const totalSignups = db.signups.length;
  const conversionRate = totalVisits > 0 ? ((totalSignups / totalVisits) * 100).toFixed(2) + '%' : '0.00%';

  // Group by category
  const categoryCount = {};
  db.signups.forEach((s) => {
    categoryCount[s.productCategory] = (categoryCount[s.productCategory] || 0) + 1;
  });

  // If CSV export requested
  if (req.query.format === 'csv') {
    const records = db.signups.map((s) => [
      s.id,
      s.email,
      s.name,
      s.brandName,
      s.productCategory,
      s.message,
      s.createdAt
    ]);

    stringify(
      records,
      {
        header: true,
        columns: ['ID', '이메일', '담당자성함', '브랜드명', '제품군', '문의사항', '신청일시']
      },
      (err, output) => {
        if (err) {
          return res.status(500).send('CSV 생성 실패');
        }
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="formu_signups.csv"');
        // Excel UTF-8 BOM
        res.send('\uFEFF' + output);
      }
    );
    return;
  }

  // Return JSON summary
  return res.status(200).json({
    success: true,
    summary: {
      totalVisits,
      totalSignups,
      conversionRate,
      categoryCount
    },
    recentSignups: db.signups.slice(-10).reverse()
  });
});

// Fallback to index.html for SPA/root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Formu Server] Running on http://localhost:${PORT}`);
});
