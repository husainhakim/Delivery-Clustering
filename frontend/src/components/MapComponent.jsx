import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon paths if default markers are used (though we use CircleMarker here)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Utility to generate a distinct color for each cluster
const getColor = (clusterId) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#14b8a6'];
  return colors[(clusterId - 1) % colors.length];
};

export default function MapComponent({ clusters }) {
  // Center roughly between Mumbai and Pune or just Mumbai
  const center = [19.0760, 72.8777];

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-700 relative z-0">
      <MapContainer center={center} zoom={10} className="h-full w-full" zoomControl={true}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {clusters && clusters.map(cluster => {
          const color = getColor(cluster.clusterId);
          return cluster.zones.map(zone => {
            if (!zone.coordinates || !zone.coordinates.lat || !zone.coordinates.lng) return null;
            return (
              <CircleMarker 
                key={zone._id}
                center={[zone.coordinates.lat, zone.coordinates.lng]}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.7 }}
                radius={10}
              >
                <Popup>
                  <div className="text-sm font-semibold">{zone.name}</div>
                  <div className="text-xs">Couriers: {zone.courierCount}</div>
                  <div className="text-xs">Orders: {zone.activeOrders}</div>
                  <div className="text-xs">Cluster ID: {cluster.clusterId}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">Zone ID: {zone.zoneId}</div>
                </Popup>
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  {zone.name} (Cluster {cluster.clusterId})
                </Tooltip>
              </CircleMarker>
            );
          });
        })}
      </MapContainer>
    </div>
  );
}
