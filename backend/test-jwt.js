import './env.js';
import jwt from 'jsonwebtoken';

async function run() {
  const token = jwt.sign(
    { email: 'test@gmail.com', name: 'Test', avatar: 'http://example.com/avatar.jpg', role: 'admin', provider: 'google' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  console.log("Generated token length:", token.length);
  
  try {
    const res = await fetch('http://localhost:4000/api/zones', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Zones status:", res.status);
    const data = await res.json();
    console.log("Zones count:", data.count);
  } catch(e) {
    console.error("API error:", e.message);
  }
}
run();
