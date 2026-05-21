import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Shield, ExternalLink, Globe, Search, Plus, X } from 'lucide-react';

const SEARCH_ENGINES = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?igu=1&q=', icon: '🔍' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: '🦆' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=', icon: '🅱️' },
  { id: 'brave', name: 'Brave', url: 'https://search.brave.com/search?q=', icon: '🦁' },
];

export default function Browser() {
  const [url, setUrl] = useState('start'); // 'start' means home page
  const [inputUrl, setInputUrl] = useState('');
  const [isTunnelActive, setIsTunnelActive] = useState(localStorage.getItem('s-tunnel-active') === 'true');
  const [engine, setEngine] = useState('stealth');
  const [searchEngine, setSearchEngine] = useState(SEARCH_ENGINES[0]);
  const [history, setHistory] = useState(['start']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef(null);

  // Keep tunnel state in sync
  useEffect(() => {
    const checkTunnel = () => {
      const active = localStorage.getItem('s-tunnel-active') === 'true';
      if (active !== isTunnelActive) setIsTunnelActive(active);
    };
    const interval = setInterval(checkTunnel, 1000);
    return () => clearInterval(interval);
  }, [isTunnelActive]);

  const engines = {
    standard: '/api/proxy?url=',
    stealth: '/api/proxy?url=',
    ultra: '/api/proxy?url=',
  };

  const isUrl = (str) => {
    try {
      if (str.startsWith('http')) return true;
      if (str.includes('.') && !str.includes(' ')) return true;
      return false;
    } catch {
      return false;
    }
  };

  const navigateTo = (target, pushToHistory = true) => {
    if (!target || target === 'start') {
      setUrl('start');
      setInputUrl('');
      if (pushToHistory) updateHistory('start');
      return;
    }

    let finalTarget = target;
    if (!isUrl(finalTarget)) {
      finalTarget = searchEngine.url + encodeURIComponent(finalTarget);
    } else if (!finalTarget.startsWith('http')) {
      finalTarget = 'https://' + finalTarget;
    }
    
    const tunnelActive = localStorage.getItem('s-tunnel-active') === 'true';
    const proxyBase = localStorage.getItem('s-tunnel-proxy-url');
    
    let proxyUrl;
    // Always use proxy for DuckDuckGo/Brave if Tunnel is Active
    const needsProxy = finalTarget.includes('duckduckgo.com') || finalTarget.includes('brave.com') || finalTarget.includes('google.com');

    if (tunnelActive || needsProxy) {
      const base = proxyBase || engines[engine] || engines.stealth;
      proxyUrl = base.endsWith('/') ? `${base}${finalTarget}` : `${base}${finalTarget}`;
    } else {
      proxyUrl = finalTarget;
    }

    setUrl(proxyUrl);
    setInputUrl(finalTarget);

    if (pushToHistory) updateHistory(finalTarget);
  };

  const updateHistory = (newUrl) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleNavigate = (e) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      if (prev === 'start') {
        setUrl('start');
        setInputUrl('');
      } else {
        navigateTo(prev, false);
      }
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      if (next === 'start') {
        setUrl('start');
        setInputUrl('');
      } else {
        navigateTo(next, false);
      }
    }
  };

  const handleReload = () => {
    if (url === 'start') return;
    const currentUrl = url;
    setUrl('');
    setTimeout(() => setUrl(currentUrl), 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8f9fa', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ 
        padding: '8px 12px', 
        background: '#fff', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '12px', color: '#666', alignItems: 'center' }}>
          <ChevronLeft 
            size={18} 
            style={{ cursor: historyIndex > 0 ? "pointer" : "default", opacity: historyIndex > 0 ? 1 : 0.3 }} 
            onClick={goBack} 
          />
          <ChevronRight 
            size={18} 
            style={{ cursor: historyIndex < history.length - 1 ? "pointer" : "default", opacity: historyIndex < history.length - 1 ? 1 : 0.3 }} 
            onClick={goForward} 
          />
          <RotateCw size={17} style={{ cursor: 'pointer' }} onClick={handleReload} />
          <Plus size={18} style={{ cursor: 'pointer' }} onClick={() => navigateTo('start')} />
        </div>
        
        <form onSubmit={handleNavigate} style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: '#ebf0f5', 
            borderRadius: '20px', 
            padding: '6px 16px',
            gap: '8px',
            border: '1px solid transparent'
          }}>
            <Shield size={14} color={(isTunnelActive || localStorage.getItem('s-tunnel-active') === 'true') ? '#10b981' : '#64748b'} />
            <input 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{ 
                border: 'none', 
                background: 'transparent', 
                flex: 1, 
                outline: 'none', 
                fontSize: '13px',
                color: '#1e293b',
                width: '100%'
              }} 
              placeholder="Search or enter URL"
            />
          </div>
        </form>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select 
            value={engine}
            onChange={(e) => {
              setEngine(e.target.value);
              if (url !== 'start' && (isTunnelActive || localStorage.getItem('s-tunnel-active') === 'true')) {
                setTimeout(() => navigateTo(inputUrl, false), 0);
              }
            }}
            style={{ 
              fontSize: '11px', 
              padding: '5px 8px', 
              borderRadius: '6px', 
              border: '1px solid #e2e8f0', 
              outline: 'none',
              background: '#fff',
              color: '#475569'
            }}
          >
            <option value="standard">Standard Engine</option>
            <option value="stealth">Stealth Node</option>
            <option value="ultra">Ultra Unblocker</option>
          </select>

          <button 
            onClick={() => {
              const newState = !isTunnelActive;
              setIsTunnelActive(newState);
              localStorage.setItem('s-tunnel-active', newState ? 'true' : 'false');
              if (url !== 'start') {
                setTimeout(() => navigateTo(inputUrl, false), 0);
              }
            }}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              background: (isTunnelActive || localStorage.getItem('s-tunnel-active') === 'true') ? '#10b981' : '#e2e8f0',
              color: (isTunnelActive || localStorage.getItem('s-tunnel-active') === 'true') ? 'white' : '#475569',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {(isTunnelActive || localStorage.getItem('s-tunnel-active') === 'true') ? <Shield size={12} /> : <Globe size={12} />}
            {(isTunnelActive || localStorage.getItem('s-tunnel-active') === 'true') ? 'TUNNEL ON' : 'DIRECT'}
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div style={{ flex: 1, position: 'relative', background: url === 'start' ? '#f1f5f9' : '#fff' }}>
        {url === 'start' ? (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            padding: '20px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '40px',
              animation: 'fadeInDown 0.8s ease-out'
            }}>
              <div style={{ 
                padding: '12px', 
                background: '#3b82f6', 
                borderRadius: '16px', 
                color: 'white',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
              }}>
                <Globe size={40} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Antigravity Browser</h1>
            </div>

            <div style={{ 
              width: '100%', 
              maxWidth: '600px', 
              background: 'white', 
              padding: '8px', 
              borderRadius: '30px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '30px',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <div style={{ padding: '10px 20px', fontSize: '20px' }}>{searchEngine.icon}</div>
              <input 
                autoFocus
                placeholder={`Search with ${searchEngine.name} or enter URL`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigateTo(e.target.value);
                }}
                style={{ 
                  flex: 1, 
                  border: 'none', 
                  outline: 'none', 
                  fontSize: '18px', 
                  color: '#334155',
                  paddingRight: '20px'
                }}
              />
              <button 
                onClick={() => navigateTo(document.querySelector('input[placeholder*="Search"]').value)}
                style={{ 
                  background: '#3b82f6', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '45px', 
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                }}
              >
                <Search size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {SEARCH_ENGINES.map(se => (
                <div 
                  key={se.id}
                  onClick={() => setSearchEngine(se)}
                  style={{ 
                    padding: '12px 24px', 
                    background: searchEngine.id === se.id ? '#fff' : 'rgba(255,255,255,0.5)', 
                    borderRadius: '16px',
                    border: `2px solid ${searchEngine.id === se.id ? '#3b82f6' : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: searchEngine.id === se.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{se.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>{se.name}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '50px', color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={14} /> Global Tunnel {isTunnelActive ? 'Active' : 'Standby'}
            </div>
          </div>
        ) : url ? (
          <iframe 
            ref={iframeRef}
            src={url} 
            style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
            title="Browser Content"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: '12px' }}>
            <RotateCw size={32} className="animate-spin" />
            <span style={{ fontSize: '14px' }}>Connecting to secure node...</span>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
