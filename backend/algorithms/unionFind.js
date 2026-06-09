/**
 * ============================================================
 * UNION-FIND (DISJOINT SET UNION) DATA STRUCTURE
 * ============================================================
 *
 * Academic Project: Smart Delivery Zone Clustering
 * Course: DSA-3 | Semester VI | B.Tech CSE 2023-27
 * Institution: ITM Skills University
 *
 * Overview:
 * ---------
 * Union-Find (also called Disjoint Set Union / DSU) is a data structure
 * that keeps track of elements partitioned into disjoint (non-overlapping)
 * subsets. It supports two primary operations efficiently:
 *
 *   1. find(x)   - Determine which subset element x belongs to
 *   2. union(x,y) - Merge the subsets containing x and y
 *
 * Application in this project:
 * ----------------------------
 * Each delivery zone is a node. Each route between two zones is an edge.
 * We use Union-Find to detect connected components (clusters).
 * Zones reachable from each other (directly or transitively) belong
 * to the same delivery cluster.
 *
 * Optimizations Used:
 * -------------------
 * 1. PATH COMPRESSION  (in find)
 *    - Flattens the tree so future find() calls are O(1) amortized
 *    - Every node on the path to root is directly linked to root
 *
 * 2. UNION BY RANK  (in union)
 *    - Always attach the smaller tree under the root of the larger tree
 *    - Prevents degenerate tree (linked list) formation
 *    - Keeps tree height logarithmically bounded
 *
 * Time Complexity:
 * ----------------
 *   find()  : O(α(n))  — Inverse Ackermann function, effectively O(1)
 *   union() : O(α(n))  — Same as find
 *   Space   : O(n)     — Two arrays of size n (parent[], rank[])
 *
 *   α(n) grows so slowly that for all practical values of n
 *   (up to 10^80), α(n) ≤ 5. So operations are virtually constant time.
 * ============================================================
 */

class UnionFind {
  /**
   * Constructor — Initialize the Union-Find structure
   *
   * @param {number} n - Number of elements (0-indexed: 0 to n-1)
   *
   * Initially, every element is its own parent (self-loop),
   * meaning each element is in its own set (isolated cluster).
   *
   * parent[i] = i  → element i is the root of its own set
   * rank[i]   = 0  → all trees start with height 0
   *
   * Time:  O(n)
   * Space: O(n)
   */
  constructor(n) {
    this.n = n;
    this.parent = Array.from({ length: n }, (_, i) => i); // parent[i] = i
    this.rank = new Array(n).fill(0);                      // rank[i]   = 0
    this.size = new Array(n).fill(1);                      // size of each component
    this.componentCount = n;                               // starts as n isolated nodes
  }

  /**
   * FIND with PATH COMPRESSION
   * --------------------------
   * Finds the representative (root) of the set containing element x.
   *
   * Path Compression:
   *   After finding the root, recursively set the parent of every
   *   node on the path directly to the root. This "flattens" the tree,
   *   making future find() calls on those nodes O(1).
   *
   * @param {number} x - Element to find root of
   * @returns {number} - Root (representative) of x's set
   *
   * Time: O(α(n)) amortized with compression
   */
  find(x) {
    if (this.parent[x] !== x) {
      // PATH COMPRESSION: make parent[x] point directly to root
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  /**
   * UNION BY RANK
   * -------------
   * Merges the sets containing elements x and y.
   *
   * @param {number} x - First element
   * @param {number} y - Second element
   * @returns {boolean} - true if a merge happened, false if already in same set
   *
   * Time: O(α(n)) amortized
   */
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    // UNION BY RANK: attach smaller rank tree under larger rank tree
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.rank[rootX]++;
    }

    this.componentCount--;
    return true;
  }

  /**
   * CONNECTED CHECK
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  connected(x, y) {
    return this.find(x) === this.find(y);
  }

  /**
   * GET CLUSTERS
   * Returns all disjoint sets as an array of cluster objects.
   * Time: O(n · α(n))
   */
  getClusters() {
    const clusterMap = new Map();

    for (let i = 0; i < this.n; i++) {
      const root = this.find(i);
      if (!clusterMap.has(root)) {
        clusterMap.set(root, []);
      }
      clusterMap.get(root).push(i);
    }

    const clusters = [];
    let clusterId = 1;

    for (const [root, members] of clusterMap) {
      clusters.push({
        clusterId,
        root,
        members,
        size: members.length,
        isIsolated: members.length === 1,
      });
      clusterId++;
    }

    clusters.sort((a, b) => b.size - a.size);
    return clusters;
  }

  getComponentCount() {
    return this.componentCount;
  }

  getComponentSize(x) {
    return this.size[this.find(x)];
  }
}

export default UnionFind;
