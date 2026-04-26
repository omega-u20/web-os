import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Globe, Shield, ExternalLink } from 'lucide-react';

export default function Browser() {
  const [url, setUrl] = useState('https://www.google.com/search?igu=1');
  const [inputUrl, setInputUrl] = useState('https://google.com');
  const [isProxy, setIsProxy] = useState(localStorage.getItem('s-tunnel-active') === 'true');

  const handleNavigate = (e) => {
    e.preventDefault();
    let target = inputUrl;
    if (!target.startsWith('http')) target = 'https://' + target;
    
    const tunnelActive = localStorage.getItem('s-tunnel-active') === 'true';
    
    if (tunnelActive || isProxy) {
      // Using a more robust proxy method for the "Tunnel" feel
      // Google Translate acts as a great free web proxy
      const proxyUrl = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(target)}`;
      setUrl(proxyUrl);
    } else {
      setUrl(target);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8f9fa' }}>
      <div style={{ 
        padding: '8px 12px', 
        background: '#fff', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px', color: '#666' }}>
          <ChevronLeft size={18} cursor="pointer" />
          <ChevronRight size={18} cursor="pointer" />
          <RotateCw size={18} cursor="pointer" onClick={() => { const old = url; setUrl(''); setTimeout(() => setUrl(old), 10) }} />
        </div>
        
        <form onSubmit={handleNavigate} style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: '#ebf0f5', 
            borderRadius: '20px', 
            padding: '4px 16px',
            gap: '8px'
          }}>
            <Shield size={14} color={isProxy ? '#10b981' : '#666'} />
            <input 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{ 
                border: 'none', 
                background: 'transparent', 
                flex: 1, 
                outline: 'none', 
                fontSize: '13px',
                color: '#333'
              }} 
            />
          </div>
        </form>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setIsProxy(!isProxy)}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: 'none',
              background: (isProxy || localStorage.getItem('s-tunnel-active') === 'true') ? '#10b981' : '#e2e8f0',
              color: (isProxy || localStorage.getItem('s-tunnel-active') === 'true') ? 'white' : '#475569',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: '0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {(isProxy || localStorage.getItem('s-tunnel-active') === 'true') ? <Shield size={12} /> : null}
            {(isProxy || localStorage.getItem('s-tunnel-active') === 'true') ? 'TUNNEL ON' : 'DIRECT'}
          </button>
          <a href={url} target="_blank" rel="noreferrer" style={{ color: '#666' }}>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
      
      <div style={{ flex: 1, position: 'relative', background: '#fff' }}>
        {url ? (
          <iframe 
            src={url} 
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Browser Content"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
