import React, { useEffect, useState } from 'react';
import { getZoneManagementReport } from '../services/clusterService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Users, Package, AlertCircle, MapPin } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const ReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getZoneManagementReport();
        setReport(data.data);
      } catch {
        toast.error('Failed to load zone management report');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <LoadingSpinner size="lg" text="Generating report..." />
      </div>
    );
  }

  const {
    totalActiveZones,
    totalCouriers,
    averageLoadImbalancePercentage,
    zoneMetrics,
    clusterTrends,
    equitableAllocation
  } = report || {};

  return (
    <div className="page-enter pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Zone Management Report</h2>
        <p className="text-gray-400 text-sm">Workforce allocation and balance analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-indigo-500/20 border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400"><MapPin size={24}/></div>
            <div>
              <p className="text-gray-400 text-sm">Total Active Zones</p>
              <p className="text-2xl font-bold text-white">{totalActiveZones}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500/20 border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><Users size={24}/></div>
            <div>
              <p className="text-gray-400 text-sm">Total Couriers</p>
              <p className="text-2xl font-bold text-white">{totalCouriers}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-amber-500/20 border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400"><AlertCircle size={24}/></div>
            <div>
              <p className="text-gray-400 text-sm">Avg Load Imbalance</p>
              <p className="text-2xl font-bold text-white">{averageLoadImbalancePercentage}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar chart: courier count per zone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[1rem] text-gray-200">Couriers per Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zoneMetrics} margin={{ top: 20, right: 30, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} angle={-45} textAnchor="end" />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="couriers" name="Couriers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line chart: order volume trends per cluster */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[1rem] text-gray-200">Order Volume per Cluster</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clusterTrends} margin={{ top: 20, right: 30, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="volume" name="Orders" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Table: equitable allocation metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[1rem] text-gray-200">Equitable Allocation Metrics</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-gray-400 text-sm">
                <th className="py-4 px-6 font-semibold">Cluster</th>
                <th className="py-4 px-6 font-semibold">Avg Couriers / Zone</th>
                <th className="py-4 px-6 font-semibold">Avg Orders / Zone</th>
                <th className="py-4 px-6 font-semibold">Variance / Health</th>
              </tr>
            </thead>
            <tbody>
              {equitableAllocation?.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-medium text-gray-200">Cluster {row.clusterId}</td>
                  <td className="py-4 px-6 text-gray-300">{row.couriersPerZone}</td>
                  <td className="py-4 px-6 text-gray-300">{row.avgOrderLoad}</td>
                  <td className="py-4 px-6">
                    <Badge variant={row.varianceIndicator === 'high' ? 'danger' : 'success'}>
                      {row.varianceIndicator === 'high' ? 'High Imbalance' : 'Healthy'}
                    </Badge>
                  </td>
                </tr>
              ))}
              {(!equitableAllocation || equitableAllocation.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No clusters found</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
