import React from 'react';
import { BookOpen, Cpu, Clock, Link2, GitMerge, Layers } from 'lucide-react';

const Section = ({ icon: Icon, title, children, delay = 0 }) => (
  <div
    className="glass-card animate-fadeInUp"
    style={{ padding: '28px 32px', marginBottom: '20px', animationDelay: `${delay}ms` }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <div style={{ background: 'rgba(99,102,241,0.15)', padding: '10px', borderRadius: '10px' }}>
        <Icon size={22} color="#6366f1" />
      </div>
      <h3 style={{ color: '#f1f5f9', fontWeight: 800, margin: 0, fontSize: '1.1rem' }}>{title}</h3>
    </div>
    {children}
  </div>
);

const P = ({ children }) => (
  <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '12px', fontSize: '0.9rem' }}>{children}</p>
);

const Code = ({ children }) => (
  <pre className="code-block" style={{ margin: '12px 0' }}>{children}</pre>
);

const ComplexityRow = ({ op, time, space, note }) => (
  <tr>
    <td style={{ color: '#f1f5f9', fontWeight: 600 }}>{op}</td>
    <td style={{ color: '#6ee7b7', fontFamily: 'monospace', fontWeight: 700 }}>{time}</td>
    <td style={{ color: '#a5b4fc', fontFamily: 'monospace' }}>{space}</td>
    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{note}</td>
  </tr>
);

const DSAExplanationPage = () => {
  return (
    <div className="page-enter">
      {/* Hero */}
      <div
        className="glass-card"
        style={{
          padding: '32px 40px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
          border: '1px solid rgba(99,102,241,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '12px', borderRadius: '14px' }}>
            <BookOpen size={28} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f1f5f9', margin: 0 }}>
              DSA Explanation: Union-Find
            </h1>
            <p style={{ color: '#6366f1', fontSize: '0.875rem', margin: '4px 0 0', fontWeight: 600 }}>
            </p>
          </div>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.7, margin: 0, maxWidth: '700px' }}>
          This project demonstrates how the <strong style={{ color: '#a5b4fc' }}>Union-Find (Disjoint Set Union)</strong> data
          structure can be applied to the logistics industry to automatically cluster delivery zones based on their
          route connectivity. Understanding this algorithm is key to solving real-world connectivity and grouping problems efficiently.
        </p>
      </div>

      {/* 1. What is Union-Find */}
      <Section icon={Cpu} title="1. What is Union-Find?" delay={0}>
        <P>
          Union-Find, also called <strong style={{ color: '#a5b4fc' }}>Disjoint Set Union (DSU)</strong>, is a data structure
          that maintains a collection of non-overlapping subsets (partitions) of a set of elements.
          It answers two fundamental questions efficiently:
        </P>
        <ul style={{ color: '#94a3b8', lineHeight: 2, paddingLeft: '20px' }}>
          <li><strong style={{ color: '#6ee7b7' }}>find(x)</strong> — Which group does element x belong to?</li>
          <li><strong style={{ color: '#6ee7b7' }}>union(x, y)</strong> — Merge the groups of x and y together.</li>
        </ul>
        <P>
          Initially, every element is in its own group (set). As <code style={{ color: '#a5b4fc' }}>union()</code> operations
          are performed, groups merge. The structure tracks which elements share the same representative root.
        </P>
        <Code>{`// Initial state: 5 elements, each in own set
parent = [0, 1, 2, 3, 4]  // parent[i] = i means i is its own root

// After union(0, 1) and union(1, 2):
parent = [0, 0, 0, 3, 4]  // 0, 1, 2 are in same set (root = 0)
                           // 3, 4 are still isolated`}</Code>
      </Section>

      {/* 2. Why Union-Find for Clustering */}
      <Section icon={Link2} title="2. Why Union-Find for Delivery Clustering?" delay={100}>
        <P>
          In logistics, delivery zones that share routes can be served by the same delivery vehicle or team.
          Finding these <strong style={{ color: '#a5b4fc' }}>connected clusters</strong> is essentially the problem of
          finding connected components in a graph — exactly what Union-Find solves.
        </P>
        <P>
          <strong style={{ color: '#a5b4fc' }}>Advantages over alternatives:</strong>
        </P>
        <ul style={{ color: '#94a3b8', lineHeight: 2, paddingLeft: '20px' }}>
          <li><strong style={{ color: '#fcd34d' }}>vs BFS/DFS:</strong> Union-Find is faster for repeated connectivity queries and dynamic graph changes.</li>
          <li><strong style={{ color: '#fcd34d' }}>vs Floyd-Warshall:</strong> O(n³) is too slow; Union-Find does it in O(n · α(n)).</li>
          <li><strong style={{ color: '#fcd34d' }}>Incremental:</strong> New routes can be added and clusters instantly updated.</li>
        </ul>
      </Section>

      {/* 3. Path Compression */}
      <Section icon={GitMerge} title="3. Optimization 1: Path Compression" delay={200}>
        <P>
          When <code style={{ color: '#a5b4fc' }}>find(x)</code> is called, it traverses up the tree to find the root.
          <strong style={{ color: '#a5b4fc' }}> Path Compression</strong> makes every node on the path point directly
          to the root, flattening the tree. Future calls on those nodes become O(1).
        </P>
        <Code>{`// find(x) with Path Compression
find(x):
  if parent[x] != x:
    parent[x] = find(parent[x])  // ← Path compression
  return parent[x]

// Before compression (find(1)):
//   1 → 2 → 3 → 4 (root)

// After compression:
//   1 → 4 (root)   ← directly linked to root
//   2 → 4 (root)   ← also compressed
//   3 → 4 (root)   ← also compressed`}</Code>
      </Section>

      {/* 4. Union by Rank */}
      <Section icon={Layers} title="4. Optimization 2: Union By Rank" delay={300}>
        <P>
          Without optimization, repeated unions can create a degenerate tree (a linked list) with O(n) find time.
          <strong style={{ color: '#a5b4fc' }}> Union by Rank</strong> ensures the shallower tree is always attached
          under the deeper tree, keeping the height logarithmically bounded.
        </P>
        <Code>{`// union(x, y) with Union by Rank
union(x, y):
  rootX = find(x)
  rootY = find(y)
  if rootX == rootY: return  // Already connected

  // Attach smaller rank tree under larger
  if rank[rootX] < rank[rootY]:
    parent[rootX] = rootY
  else if rank[rootX] > rank[rootY]:
    parent[rootY] = rootX
  else:
    parent[rootY] = rootX    // Tie: arbitrary choice
    rank[rootX]++            // Only increment on tie`}</Code>
      </Section>

      {/* 5. Time Complexity */}
      <Section icon={Clock} title="5. Time Complexity" delay={400}>
        <P>
          With both Path Compression and Union by Rank, the amortized time per operation is
          <strong style={{ color: '#6ee7b7' }}> O(α(n))</strong>, where α is the
          <strong style={{ color: '#a5b4fc' }}> Inverse Ackermann function</strong>. For all practical values of n
          (up to 10<sup>80</sup>), α(n) ≤ 5. This is effectively <strong style={{ color: '#6ee7b7' }}>O(1)</strong>.
        </P>
        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table className="table-dark" style={{ minWidth: '500px' }}>
            <thead>
              <tr>
                <th>Operation</th>
                <th>Time</th>
                <th>Space</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <ComplexityRow op="find(x)" time="O(α(n))" space="O(1)" note="With path compression" />
              <ComplexityRow op="union(x, y)" time="O(α(n))" space="O(1)" note="With union by rank" />
              <ComplexityRow op="connected(x, y)" time="O(α(n))" space="O(1)" note="Just two find() calls" />
              <ComplexityRow op="Constructor" time="O(n)" space="O(n)" note="Initialize parent[] and rank[]" />
              <ComplexityRow op="getClusters()" time="O(n·α(n))" space="O(n)" note="One find() per element" />
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '16px', padding: '14px 18px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px' }}>
          <p style={{ color: '#6ee7b7', fontWeight: 700, margin: '0 0 4px', fontSize: '0.875rem' }}>
            📊 Practical Impact
          </p>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>
            For this project with n = 15 zones and 13 routes, the algorithm completes all union operations in
            microseconds. The O(α(n)) complexity makes it scale effortlessly to millions of zones in production logistics systems.
          </p>
        </div>
      </Section>

      {/* 6. How Clustering Works Here */}
      <Section icon={Link2} title="6. How Clustering Works in This Project" delay={500}>
        <P>The complete clustering pipeline in this system:</P>
        <div style={{ counterReset: 'steps' }}>
          {[
            'Fetch all zones from MongoDB → each zone becomes a node (index 0 to n-1)',
            'Fetch all routes from MongoDB → each route is an undirected edge (u, v)',
            'Initialize UnionFind(n) — every zone starts in its own cluster',
            'For each route (u, v): call union(u, v) — merges the two sets',
            'After all unions, call getClusters() — groups nodes by shared root',
            'Return enriched cluster data with zone names and metadata to frontend',
            'Frontend animates the coloring — same cluster = same color',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.75rem', color: 'white', flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.6, paddingTop: '4px', fontSize: '0.9rem' }}>{step}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default DSAExplanationPage;
