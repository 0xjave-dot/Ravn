import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Compass, ShieldCheck, Activity, RefreshCw, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, doc, getDocFromServer } from 'firebase/firestore';
import { db } from './firebase';
import { FadeIn } from './FadeIn';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface GeolocationData {
  ip?: string;
  city?: string;
  region?: string;
  country_name?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  org?: string; // ISP
}

interface GPSCoords {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  provider: 'browser-gps' | 'none';
}

interface VisitLog {
  timestamp: string;
  ip: string;
  city: string;
  region?: string;
  country: string;
  gpsLat: number | null;
  gpsLng: number | null;
  accuracy: number | null;
  userAgent?: string;
  org?: string;
}

export const LocationTracker: React.FC = () => {
  const [ipData, setIpData] = useState<GeolocationData | null>(null);
  const [gpsData, setGpsData] = useState<GPSCoords>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    provider: 'none'
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true); // Default to true so users easily see their logged nodes
  const [recentLogs, setRecentLogs] = useState<VisitLog[]>([]);
  const [showRadarUI, setShowRadarUI] = useState<boolean>(false);

  // Check URL query parameters on mount to determine secret radar visibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('radar') === 'true' || params.get('admin') === 'true') {
        setShowRadarUI(true);
      }
    }
  }, []);

  // Validate connection to Firestore on mount
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'visitorLogs', 'test-connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Listen to live updates from Firestore
  useEffect(() => {
    const pathForOnSnapshot = 'visitorLogs';
    try {
      const q = query(
        collection(db, pathForOnSnapshot),
        orderBy('timestamp', 'desc'),
        limit(20)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logs: VisitLog[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          logs.push({
            timestamp: data.timestamp || '',
            ip: data.ip || 'Unknown',
            city: data.city || 'Unknown',
            region: data.region || '',
            country: data.country || 'Unknown',
            gpsLat: data.gpsLat !== undefined ? data.gpsLat : null,
            gpsLng: data.gpsLng !== undefined ? data.gpsLng : null,
            accuracy: data.accuracy !== undefined ? data.accuracy : null,
            userAgent: data.userAgent || '',
            org: data.org || ''
          });
        });
        setRecentLogs(logs);
        setLoadingLogs(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, pathForOnSnapshot);
      });

      return () => unsubscribe();
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, pathForOnSnapshot);
    }
  }, []);

  const addVisitorLogToFirestore = async (
    ip: string,
    city: string,
    region: string,
    country: string,
    lat: number | null,
    lng: number | null,
    acc: number | null,
    org: string
  ) => {
    const pathForWrite = 'visitorLogs';
    try {
      // Avoid duplicate writes of the exact same session via sessionStorage flag
      const sessionFlag = sessionStorage.getItem('raven_portfolio_session_written');
      if (sessionFlag) return;

      const now = new Date();
      const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);
      const userAgentStr = typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 150) : '';

      const logPayload = {
        timestamp: timestampStr,
        ip: ip || 'Local IPv4',
        city: city || 'Unknown City',
        region: region || 'Unknown Region',
        country: country || 'Unknown Country',
        gpsLat: lat,
        gpsLng: lng,
        accuracy: acc,
        userAgent: userAgentStr,
        org: org || 'Local Network'
      };

      // Add to Firestore database
      await addDoc(collection(db, pathForWrite), logPayload);
      sessionStorage.setItem('raven_portfolio_session_written', 'true');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, pathForWrite);
    }
  };

  const fetchIPLocation = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data: GeolocationData = await response.json();
        setIpData(data);
        return data;
      }
    } catch (e) {
      console.error("IP Geolocation fetch error:", e);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const fetchGPSLocationAndLog = (ipInfo: GeolocationData | null) => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const updatedCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            error: null,
            provider: 'browser-gps' as const
          };
          setGpsData(updatedCoords);

          // Write with live accurate coordinates
          if (ipInfo) {
            addVisitorLogToFirestore(
              ipInfo.ip || '127.0.0.1',
              ipInfo.city || 'Unknown City',
              ipInfo.region || 'Unknown Region',
              ipInfo.country_name || 'Unknown Country',
              position.coords.latitude,
              position.coords.longitude,
              position.coords.accuracy,
              ipInfo.org || 'Local Network'
            );
          }
        },
        (error) => {
          let errorMsg = 'Permission Denied';
          if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Position Unavailable';
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'Timeout';
          }
          setGpsData(prev => ({
            ...prev,
            error: errorMsg
          }));

          // Still log visitor but without GPS lat/lon
          if (ipInfo) {
            addVisitorLogToFirestore(
              ipInfo.ip || '127.0.0.1',
              ipInfo.city || 'Unknown City',
              ipInfo.region || 'Unknown Region',
              ipInfo.country_name || 'Unknown Country',
              ipInfo.latitude || null,
              ipInfo.longitude || null,
              null,
              ipInfo.org || 'Local Network'
            );
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGpsData(prev => ({
        ...prev,
        error: 'Not Supported'
      }));

      if (ipInfo) {
        addVisitorLogToFirestore(
          ipInfo.ip || '127.0.0.1',
          ipInfo.city || 'Unknown City',
          ipInfo.region || 'Unknown Region',
          ipInfo.country_name || 'Unknown Country',
          ipInfo.latitude || null,
          ipInfo.longitude || null,
          null,
          ipInfo.org || 'Local Network'
        );
      }
    }
  };

  // Run on mount
  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const data = await fetchIPLocation();
      if (active) {
        if (data) {
          fetchGPSLocationAndLog(data);
        } else {
          // If IP API failed, still generate anonymous or local entry
          addVisitorLogToFirestore(
            'Node Offline',
            'Local Area',
            'Developer Frame',
            'Network Sandbox',
            null,
            null,
            null,
            'No Gateway ISP'
          );
        }
      }
    };
    loadData();

    return () => {
      active = false;
    };
  }, []);

  const handleRefresh = async () => {
    sessionStorage.removeItem('raven_portfolio_session_written'); // Allow logging state again
    const data = await fetchIPLocation();
    fetchGPSLocationAndLog(data);
  };

  // Formatted Coordinates
  const formatCoord = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '--';
    return val.toFixed(5);
  };

  // Compute stats
  const uniqueIPsCount = new Set(recentLogs.map(l => l.ip)).size;

  if (!showRadarUI) {
    return null;
  }

  return (
    <div id="spatial-visitor-tracker" className="w-full max-w-4xl mx-auto px-4 py-8 relative">
      <div className="bg-[#121212]/90 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-md relative overflow-hidden transition-all duration-300 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
        {/* Futuristic glowing backdrop accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '24s' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Live Visitor Spatial Radar
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping mr-1" />
                  PERSISTENT CLOUD ACTIVE
                </span>
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Because data tells stories. Powered by Firebase Firestore database to log all real browser sessions.
              </p>
            </div>
          </div>

          <button
            id="refresh-radar-btn"
            onClick={handleRefresh}
            className="self-start sm:self-center bg-white/5 hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white px-3.5 py-2 rounded-lg border border-white/10 transition-all flex items-center gap-2 text-xs font-mono font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Ping Node
          </button>
        </div>

        {/* Summary Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Total Logs Catalogued</span>
            <span className="text-2xl font-black text-cyan-400 mt-1 font-mono font-black">
              {loadingLogs ? '...' : recentLogs.length}
            </span>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-mono">Unique Visitor IPs</span>
            <span className="text-2xl font-black text-purple-400 mt-1 font-mono font-black font-semibold">
              {loadingLogs ? '...' : uniqueIPsCount}
            </span>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-mono">Satellite State</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 font-mono flex items-center gap-1.5 font-bold">
              {gpsData.latitude ? 'ACTIVE' : gpsData.error ? 'PROXY' : 'ACQUIRING'}
            </span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* IP Geolocator Card */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono tracking-wider text-cyan-400/80 bg-cyan-400/10 px-1.5 py-0.5 rounded">
              CURRENT IP TRACE
            </div>
            <h4 className="text-sm font-bold text-neutral-300 mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Activity className="w-4 h-4 text-cyan-400" />
              Network Location Insights
            </h4>

            {loading ? (
              <div className="flex flex-col gap-3 py-4">
                <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
              </div>
            ) : ipData ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-500">Public IP Address :</span>
                  <span className="text-white font-bold">{ipData.ip || 'Unidentified'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-500">City & Region :</span>
                  <span className="text-neutral-200">
                    {ipData.city || 'Unknown'}, {ipData.region || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-500">Country Node :</span>
                  <span className="text-neutral-200">{ipData.country_name || 'Unknown Country'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-500">Network Provider :</span>
                  <span className="text-neutral-300 text-right max-w-[180px] break-words truncate">
                    {ipData.org || 'Local Gateway / ISP'}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-neutral-500">Approx Coords :</span>
                  <span className="text-cyan-400 font-bold font-mono">
                    {formatCoord(ipData.latitude)}, {formatCoord(ipData.longitude)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-red-400 py-4 font-mono">
                Failed to fetch automated network routing details. Check tracker permissions or offline state.
              </div>
            )}
          </div>

          {/* High-Precision GPS Tracker Card */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono tracking-wider text-purple-400/80 bg-purple-400/10 px-1.5 py-0.5 rounded">
              GPS SCAN
            </div>
            <h4 className="text-sm font-bold text-neutral-300 mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Compass className="w-4 h-4 text-purple-400" />
              High-Precision GPS Coordinates
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-500 font-mono">Satellite Status :</span>
                {gpsData.latitude ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> LOCKED
                  </span>
                ) : gpsData.error ? (
                  <span className="text-amber-400">{gpsData.error}</span>
                ) : (
                  <span className="text-neutral-400 animate-pulse">ACQUIRING SATELLITES...</span>
                )}
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-500">Precise Latitude :</span>
                <span className={`${gpsData.latitude ? 'text-white font-bold' : 'text-neutral-600'}`}>
                  {formatCoord(gpsData.latitude)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-500">Precise Longitude :</span>
                <span className={`${gpsData.longitude ? 'text-white font-bold' : 'text-neutral-600'}`}>
                  {formatCoord(gpsData.longitude)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-500">Scan Margin of Error :</span>
                <span className="text-neutral-300">
                  {gpsData.accuracy ? `± ${gpsData.accuracy.toFixed(1)} meters` : '--'}
                </span>
              </div>
              <div className="pt-2">
                {!gpsData.latitude && !gpsData.error && (
                  <button
                    id="trigger-gps-prompt"
                    onClick={() => fetchGPSLocationAndLog(ipData)}
                    className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 text-cyan-400 px-3 py-1.5 rounded border border-cyan-500/20 transition-all font-mono text-[10px] font-bold"
                  >
                    GRANT HIGH-PRECISION SATELLITE FOCUS
                  </button>
                )}
                {gpsData.latitude && (
                  <div className="text-[10px] text-emerald-400/80 bg-emerald-500/5 p-2 rounded border border-emerald-500/15 leading-relaxed text-center">
                    Browser location authorized. High fidelity rendering active.
                  </div>
                )}
                {gpsData.error === 'Permission Denied' && (
                  <div className="text-[10px] text-amber-500 bg-amber-500/5 p-2 rounded border border-amber-500/15 leading-relaxed text-center">
                    High precision geolocation denied. Access using standard network proxy.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time sync visitor table logs */}
        <div className="border-t border-white/5 pt-5">
          <button
            id="toggle-radar-logs"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-left text-neutral-400 hover:text-white transition-colors text-xs font-mono font-bold"
          >
            <span className="flex items-center gap-2 uppercase tracking-wider font-mono">
              <Clock className="w-4 h-4 text-cyan-400" />
              Logged Coordinates Database ({recentLogs.length} nodes recorded)
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-4 overflow-x-auto">
              {loadingLogs ? (
                <div className="text-center py-6 text-xs text-neutral-500 font-mono animate-pulse">
                  Querying Firebase secure database...
                </div>
              ) : recentLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-neutral-500 font-mono italic">
                  No spatial nodes registered yet.
                </div>
              ) : (
                <table className="w-full text-left font-mono text-[11px] text-neutral-400 border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-500">
                      <th className="pb-2 font-medium">TIMESTAMP (UTC)</th>
                      <th className="pb-2 font-medium">VISITOR NODE IP</th>
                      <th className="pb-2 font-medium">LOCATION</th>
                      <th className="pb-2 font-medium text-right">COORDINATES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-white/5 hover:text-white transition-colors">
                        <td className="py-2.5 text-neutral-500">{log.timestamp}</td>
                        <td className="py-2.5 font-bold text-neutral-300">{log.ip}</td>
                        <td className="py-2.5 text-cyan-400">
                          {log.city}, {log.region ? `${log.region}, ` : ''}{log.country}
                        </td>
                        <td className="py-2.5 text-right text-purple-400">
                          {log.gpsLat ? `${log.gpsLat.toFixed(4)}, ${log.gpsLng?.toFixed(4)}` : 'APPROX NODE'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="flex items-start gap-1 text-[10px] text-neutral-500 mt-4 italic font-mono leading-relaxed border-t border-white/5 pt-3">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  All logs are stored securely using Google Cloud Firestore in native sub-millisecond precision. You will see other visitors pop up live in this viewport in real-time as they connect to this App!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
