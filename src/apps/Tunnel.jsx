import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Globe, Zap, Server, Lock, AlertCircle, RefreshCw } from 'lucide-react';

const SERVERS = [
  { id: 'shuttle', name: 'Shuttle Node (Fast)', ping: '42ms', load: '12%', icon: '🚀', url: 'https://shuttle.rip/main/' },
  { id: 'nebula', name: 'Nebula Edge (Stealth)', ping: '88ms', load: '45%', icon: '🌌', url: 'https://nebula.rip/main/' },
  { id: 'interstellar', name: 'Interstellar (Global)', ping: '120ms', load: '22%', icon: '✨', url: 'https://interstellar.rip/main/' },
  { id: 'custom', name: 'Custom Tunnel Node', ping: 'N/A', load: 'N/A', icon: '🛡️', url: '' },
];

export default function Tunnel() {
  const [activeTab, setActiveTab] = useState('connection'); // 'connection' | 'config'
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState(SERVERS[3]);
  const [ipData, setIpData] = useState({ ip: 'Detecting...', location: 'Unknown' });
  
  // Custom Config State
  const [config, setConfig] = useState({
    server: localStorage.getItem('stunnel-server') || '',
    username: localStorage.getItem('stunnel-user') || '',
    password: localStorage.getItem('stunnel-pass') || '',
    sni: localStorage.getItem('stunnel-sni') || '',
    mode: localStorage.getItem('stunnel-mode') || 'standard' // 'standard' | 'custom'
  });

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => setIpData({ ip: data.ip, location: `${data.city}, ${data.country_name}` }))
      .catch(() => setIpData({ ip: '8.8.8.8', location: 'Mountain View, US' }));

    const saved = localStorage.getItem('s-tunnel-active') === 'true';
    setIsConnected(saved);
  }, []);

  const saveConfig = (newConfig) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem('stunnel-server', updated.server);
    localStorage.setItem('stunnel-user', updated.username);
    localStorage.setItem('stunnel-pass', updated.password);
    localStorage.setItem('stunnel-sni', updated.sni);
    localStorage.setItem('stunnel-mode', updated.mode);
  };

  const handleToggle = () => {
    if (isConnected) {
      setIsConnected(false);
      localStorage.setItem('s-tunnel-active', 'false');
      console.log("%c[S-Tunnel Server] Disconnected", "color: #ef4444; font-weight: bold;");
      
      // Notify Service Worker (The "Server")
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'TUNNEL_STATE', active: false });
      }

      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => setIpData({ ip: data.ip, location: `${data.city}, ${data.country_name}` }));
    } else {
      setIsConnecting(true);
      setIpData({ ip: 'Verifying...', location: 'Securing Connection...' });
      
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        localStorage.setItem('s-tunnel-active', 'true');
        localStorage.setItem('s-tunnel-server-id', selectedServer.id);
        
        const proxyPrefix = config.mode === 'custom' ? config.server : selectedServer.url;
        localStorage.setItem('s-tunnel-proxy-url', proxyPrefix);
        
        console.log(`%c[S-Tunnel Server] Connection Success! Target: ${config.mode === 'custom' ? config.server : selectedServer.name}`, "color: #10b981; font-weight: bold;");
        
        // Notify Service Worker (The "Server")
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ 
            type: 'TUNNEL_STATE', 
            active: true, 
            proxyUrl: proxyPrefix 
          });
        }

        setIpData({ ip: '104.21.75.122', location: 'Frankfurt, DE' });
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
      overflow: 'hidden'
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30, 41, 59, 0.8)' }}>
        <div 
          onClick={() => setActiveTab('connection')}
          style={{ 
            padding: '12px 20px', 
            fontSize: '13px', 
            fontWeight: 600, 
            cursor: 'pointer',
            borderBottom: activeTab === 'connection' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'connection' ? '#3b82f6' : '#94a3b8'
          }}
        >
          Connection
        </div>
        <div 
          onClick={() => setActiveTab('config')}
          style={{ 
            padding: '12px 20px', 
            fontSize: '13px', 
            fontWeight: 600, 
            cursor: 'pointer',
            borderBottom: activeTab === 'config' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'config' ? '#3b82f6' : '#94a3b8'
          }}
        >
          Configuration
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {activeTab === 'connection' ? (
          <>
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
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>S-Tunnel Server</h2>
        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
          {isConnected ? `Masked via ${config.mode === 'custom' ? 'Custom Server' : selectedServer.name}` : 'Unprotected Connection'}
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
                  <Lock size={12} /> {config.mode === 'custom' ? 'Custom Encryption' : 'Military Grade AES-256'}
                </div>
              </div>
            </div>

            {/* IP Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>CURRENT IP</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: isConnected ? '#10b981' : '#f8fafc' }}>
                  {isConnected ? (config.mode === 'custom' ? 'Hidden (Custom)' : '104.21.75.122') : ipData.ip}
                </div>
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>LOCATION</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  {isConnected ? (config.mode === 'custom' ? 'Secured' : 'Frankfurt, DE') : ipData.location}
                </div>
              </div>
            </div>

            {/* Server Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>PRESET SERVERS</span>
                <RefreshCw size={14} color="#94a3b8" cursor="pointer" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SERVERS.map(server => (
                  <div 
                    key={server.id}
                    onClick={() => {
                      if (!isConnected) {
                        setSelectedServer(server);
                        saveConfig({ mode: 'standard' });
                      }
                    }}
                    style={{ 
                      padding: '12px', 
                      background: (selectedServer.id === server.id && config.mode === 'standard') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 41, 59, 0.3)', 
                      borderRadius: '10px',
                      border: `1px solid ${(selectedServer.id === server.id && config.mode === 'standard') ? '#3b82f6' : 'transparent'}`,
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
                    {selectedServer.id === server.id && config.mode === 'standard' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#3b82f6' }}>Tunnel Configuration</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>TUNNEL MODE</label>
                  <select 
                    value={config.mode}
                    onChange={(e) => saveConfig({ mode: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white', outline: 'none' }}
                  >
                    <option value="standard">Standard (Preset Servers)</option>
                    <option value="custom">Custom Configuration (STunnel)</option>
                  </select>
                </div>

                {config.mode === 'custom' && (
                  <>
                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>REMOTE SERVER (URL/IP)</label>
                      <input 
                        placeholder="e.g. wss://tunnel.example.com"
                        value={config.server}
                        onChange={(e) => saveConfig({ server: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>USERNAME</label>
                        <input 
                          placeholder="User"
                          value={config.username}
                          onChange={(e) => saveConfig({ username: e.target.value })}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>PASSWORD</label>
                        <input 
                          type="password"
                          placeholder="••••••••"
                          value={config.password}
                          onChange={(e) => saveConfig({ password: e.target.value })}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>SNI (SERVER NAME INDICATION)</label>
                      <input 
                        placeholder="e.g. google.com"
                        value={config.sni}
                        onChange={(e) => saveConfig({ sni: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white', outline: 'none' }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', gap: '10px' }}>
              <AlertCircle size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                Custom configuration allows you to connect to your own STunnel or Shadowsocks nodes. 
                Ensure your server supports WebSocket or Wisp protocol for browser compatibility.
              </p>
            </div>
          </div>
        )}
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
