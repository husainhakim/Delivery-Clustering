import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { History, CloudLightning, Activity, AlertTriangle } from 'lucide-react';

export default function OperationsPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get(`/zones/operations`);
      setLogs(res.data.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Poll every 10 seconds for new operations
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && logs.length === 0) return <div className="text-gray-400 p-4">Loading operations...</div>;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="text-blue-400 w-5 h-5" />
          Cluster Operations Log
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[400px]">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">No recent operations</div>
        ) : (
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log._id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {log.operationType === 'SPLIT' && <CloudLightning className="text-red-400 w-4 h-4" />}
                    {log.operationType !== 'SPLIT' && <Activity className="text-blue-400 w-4 h-4" />}
                    <span className="font-semibold text-sm">{log.operationType}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-xs text-gray-400">{log.reason || 'System operation'}</p>
                
                {log.affectedZones && log.affectedZones.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {log.affectedZones.map(z => (
                      <Badge key={z} variant={log.operationType === 'SPLIT' ? 'danger' : 'default'}>{z}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
