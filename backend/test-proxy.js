import './env.js';
import jwt from 'jsonwebtoken';

async function run() {
  const token = jwt.sign(
    { email: 'test@gmail.com', name: 'Test', avatar: '', role: 'admin', provider: 'google' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  try {
    const res = await fetch('http://localhost:5173/api/zones', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Proxy Zones status:", res.status);
    const data = await res.json();
    console.log("Proxy Zones count:", data.count);
  } catch(e) {
    console.error("Proxy API error:", e.message);
  }
}
run();
