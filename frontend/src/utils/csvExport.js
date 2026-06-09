/**
 * CSV Export Utility
 * Converts an array of objects to a downloadable CSV file
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h] ?? '';
        const str = String(val).replace(/"/g, '""');
        return str.includes(',') || str.includes('\n') ? `"${str}"` : str;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Flatten cluster data for CSV export
 */
export const flattenClustersForCSV = (clusters) => {
  const rows = [];
  clusters.forEach((cluster) => {
    cluster.zones.forEach((zone) => {
      rows.push({
        ClusterID: cluster.clusterId,
        ClusterSize: cluster.size,
        IsIsolated: cluster.isIsolated ? 'Yes' : 'No',
        ZoneName: zone.name,
        ZoneCode: zone.zoneCode,
        City: zone.city,
      });
    });
  });
  return rows;
};
