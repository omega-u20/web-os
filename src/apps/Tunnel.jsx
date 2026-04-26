import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Globe, Zap, Server, Lock, AlertCircle, RefreshCw } from 'lucide-react';

const SERVERS = [
  { id: 'us-west', name: 'US West (California)', ping: '45ms', load: '32%', icon: '🇺🇸' },
  { id: 'eu-central', name: 'Europe Central (Frankfurt)', ping: '120ms', load: '12%', icon: '🇩🇪' },
  { id: 'asia-east', name: 'Asia East (Tokyo)', ping: '210ms', load: '88%', icon: '🇯🇵' },
  { id: 'free-proxy', name: 'S-Tunnel Public Node', ping: '85ms', load: '45%', icon: '🛡️' },
];

export default function Tunnel() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState(SERVERS[3]);
  const [ipData, setIpData] = useState({ ip: 'Detecting...', location: 'Unknown' });
  const [stats, setStats] = useState({ up: '0 KB/s', down: '0 KB/s' });

  useEffect(() => {
    // Initial IP check
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => setIpData({ ip: data.ip, location: `${data.city}, ${data.country_name}` }))
      .catch(() => setIpData({ ip: '8.8.8.8', location: 'Mountain View, US' }));

    // Persist tunnel state to localStorage for Browser app to pick up
    const saved = localStorage.getItem('s-tunnel-active') === 'true';
    setIsConnected(saved);
  }, []);

  const handleToggle = () => {
    if (isConnected) {
      setIsConnected(false);
      localStorage.setItem('s-tunnel-active', 'false');
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        localStorage.setItem('s-tunnel-active', 'true');
        localStorage.setItem('s-tunnel-server', selectedServer.id);
      }, 1500);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: '#0f172a', 
      color: '#f8fafc',
      padding: '20px',
      gap: '20px',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          padding: '10px', 
          background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
          borderRadius: '12px',
          border: `1px solid ${isConnected ? '#10b981' : '#3b82f6'}`
        }}>
          {isConnected ? <ShieldCheck color="#10b981" /> : <Shield color="#3b82f6" />}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>S-Tunnel Client</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
            {isConnected ? 'Connection Masked' : 'Unprotected Connection'}
          </p>
        </div>
      </div>

      {/* Main Connection Card */}
      <div style={{ 
        background: 'rgba(30, 41, 59, 0.5)', 
        borderRadius: '16px', 
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div 
          onClick={handleToggle}
          style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: isConnected ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #1e293b, #334155)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isConnected ? '0 0 30px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease',
            border: isConnecting ? '4px solid #3b82f6' : '4px solid transparent',
            animation: isConnecting ? 'pulse 1s infinite' : 'none'
          }}
        >
          <Zap size={48} color="white" />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleToggle}
            style={{
              padding: '8px 24px',
              borderRadius: '20px',
              border: 'none',
              background: isConnected ? '#ef4444' : '#3b82f6',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            {isConnecting ? 'CONNECTING...' : isConnected ? 'DISCONNECT' : 'CONNECT'}
          </button>
          <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
            <Lock size={12} /> Military Grade Encryption (AES-256)
          </div>
        </div>
      </div>

      {/* IP Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>CURRENT IP</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: isConnected ? '#10b981' : '#f8fafc' }}>
            {isConnected ? '104.21.75.122' : ipData.ip}
          </div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>LOCATION</div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>
            {isConnected ? 'Frankfurt, DE' : ipData.location}
          </div>
        </div>
      </div>

      {/* Server Selection */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>SELECT SERVER</span>
          <RefreshCw size={14} color="#94a3b8" cursor="pointer" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SERVERS.map(server => (
            <div 
              key={server.id}
              onClick={() => !isConnected && setSelectedServer(server)}
              style={{ 
                padding: '12px', 
                background: selectedServer.id === server.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 41, 59, 0.3)', 
                borderRadius: '10px',
                border: `1px solid ${selectedServer.id === server.id ? '#3b82f6' : 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: isConnected ? 'not-allowed' : 'pointer',
                opacity: isConnected && selectedServer.id !== server.id ? 0.5 : 1
              }}
            >
              <span style={{ fontSize: '18px' }}>{server.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{server.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Load: {server.load} • {server.ping}</div>
              </div>
              {selectedServer.id === server.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
    </div>
  );
}
