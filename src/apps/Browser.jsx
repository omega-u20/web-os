import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Shield, ExternalLink, Globe } from 'lucide-react';

export default function Browser() {
  const [url, setUrl] = useState('https://www.google.com/search?igu=1');
  const [inputUrl, setInputUrl] = useState('https://google.com');
  const [isProxy, setIsProxy] = useState(localStorage.getItem('s-tunnel-active') === 'true');
  const [engine, setEngine] = useState('stealth');
  const [history, setHistory] = useState(['https://google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef(null);

  const engines = {
    standard: 'https://shuttle.rip/main/',
    stealth: 'https://nebula.rip/main/',
    ultra: 'https://interstellar.rip/main/',
  };

  const navigateTo = (target, pushToHistory = true) => {
    if (!target) return;
    let finalTarget = target;
    if (!finalTarget.startsWith('http')) finalTarget = 'https://' + finalTarget;
    
    const tunnelActive = localStorage.getItem('s-tunnel-active') === 'true';
    const proxyBase = localStorage.getItem('s-tunnel-proxy-url');
    
    let proxyUrl;
    if (tunnelActive || isProxy) {
      const base = proxyBase || engines[engine] || engines.stealth;
      proxyUrl = base.endsWith('/') ? `${base}${finalTarget}` : `${base}/${finalTarget}`;
    } else {
      proxyUrl = finalTarget;
    }

    setUrl(proxyUrl);
    setInputUrl(finalTarget);

    if (pushToHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(finalTarget);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleNavigate = (e) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      navigateTo(prev, false);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      navigateTo(next, false);
    }
  };

  const handleReload = () => {
    const currentUrl = url;
    setUrl('');
    setTimeout(() => setUrl(currentUrl), 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8f9fa', overflow: 'hidden' }}>
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
            <Shield size={14} color={(isProxy || localStorage.getItem('s-tunnel-active') === 'true') ? '#10b981' : '#64748b'} />
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
              if (isProxy || localStorage.getItem('s-tunnel-active') === 'true') {
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
              color: '#475569',
              fontWeight: 500
            }}
          >
            <option value="standard">Standard Engine</option>
            <option value="stealth">Stealth Node</option>
            <option value="ultra">Ultra Unblocker</option>
          </select>

          <button 
            onClick={() => {
              const newState = !isProxy;
              setIsProxy(newState);
              setTimeout(() => navigateTo(inputUrl, false), 0);
            }}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              background: (isProxy || localStorage.getItem('s-tunnel-active') === 'true') ? '#10b981' : '#e2e8f0',
              color: (isProxy || localStorage.getItem('s-tunnel-active') === 'true') ? 'white' : '#475569',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {(isProxy || localStorage.getItem('s-tunnel-active') === 'true') ? <Shield size={12} /> : <Globe size={12} />}
            {(isProxy || localStorage.getItem('s-tunnel-active') === 'true') ? 'TUNNEL ON' : 'DIRECT'}
          </button>
          
          <a 
            href={url} 
            target="_blank" 
            rel="noreferrer" 
            style={{ 
              color: '#64748b', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '4px' 
            }}
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
      
      <div style={{ flex: 1, position: 'relative', background: '#fff' }}>
        {url ? (
          <iframe 
            ref={iframeRef}
            src={url} 
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              background: '#fff'
            }}
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
      `}</style>
    </div>
  );
}
