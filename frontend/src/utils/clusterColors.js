/**
 * Cluster color palette — 12 distinct HSL colors for cluster nodes
 * Each index maps to a CSS color used in both the visualization and cluster cards
 */
export const CLUSTER_COLORS = [
  { bg: '#6366f1', light: 'rgba(99,102,241,0.2)',  text: '#a5b4fc', border: 'rgba(99,102,241,0.4)'  }, // Indigo
  { bg: '#10b981', light: 'rgba(16,185,129,0.2)',  text: '#6ee7b7', border: 'rgba(16,185,129,0.4)'  }, // Emerald
  { bg: '#f59e0b', light: 'rgba(245,158,11,0.2)',  text: '#fcd34d', border: 'rgba(245,158,11,0.4)'  }, // Amber
  { bg: '#ec4899', light: 'rgba(236,72,153,0.2)',  text: '#f9a8d4', border: 'rgba(236,72,153,0.4)'  }, // Pink
  { bg: '#14b8a6', light: 'rgba(20,184,166,0.2)',  text: '#5eead4', border: 'rgba(20,184,166,0.4)'  }, // Teal
  { bg: '#a855f7', light: 'rgba(168,85,247,0.2)',  text: '#d8b4fe', border: 'rgba(168,85,247,0.4)'  }, // Purple
  { bg: '#f97316', light: 'rgba(249,115,22,0.2)',  text: '#fdba74', border: 'rgba(249,115,22,0.4)'  }, // Orange
  { bg: '#06b6d4', light: 'rgba(6,182,212,0.2)',   text: '#67e8f9', border: 'rgba(6,182,212,0.4)'   }, // Cyan
  { bg: '#84cc16', light: 'rgba(132,204,22,0.2)',  text: '#bef264', border: 'rgba(132,204,22,0.4)'  }, // Lime
  { bg: '#e11d48', light: 'rgba(225,29,72,0.2)',   text: '#fda4af', border: 'rgba(225,29,72,0.4)'   }, // Rose
  { bg: '#0ea5e9', light: 'rgba(14,165,233,0.2)',  text: '#7dd3fc', border: 'rgba(14,165,233,0.4)'  }, // Sky
  { bg: '#d97706', light: 'rgba(217,119,6,0.2)',   text: '#fcd34d', border: 'rgba(217,119,6,0.4)'   }, // Yellow-ish
];

export const ISOLATED_COLOR = {
  bg: '#ef4444',
  light: 'rgba(239,68,68,0.15)',
  text: '#fca5a5',
  border: 'rgba(239,68,68,0.35)',
};

/**
 * Get color for a cluster by its index
 * @param {number} index - cluster index (0-based)
 * @param {boolean} isIsolated
 */
export const getClusterColor = (index, isIsolated = false) => {
  if (isIsolated) return ISOLATED_COLOR;
  return CLUSTER_COLORS[index % CLUSTER_COLORS.length];
};
