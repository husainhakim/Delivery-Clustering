import './env.js';
import jwt from 'jsonwebtoken';

async function run() {
  const token = jwt.sign(
    { email: 'test@gmail.com', name: 'Test', avatar: '', role: 'admin', provider: 'google' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  try {
    const res = await fetch('http://localhost:4000/api/clusters', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Clusters status:", res.status);
    const data = await res.json();
    console.log("Clusters count:", data.clusters?.length);
  } catch(e) {
    console.error("API error:", e.message);
  }
}
run();
