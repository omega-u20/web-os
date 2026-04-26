import React from 'react';

export default function Settings() {
  const wallpapers = [
    'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop'
  ];

  return (
    <div style={{ padding: '24px', color: 'white' }}>
      <h2 style={{ marginBottom: '24px', fontWeight: 600 }}>Personalization</h2>
      
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '12px', textTransform: 'uppercase' }}>Wallpaper</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {wallpapers.map((wp, i) => (
            <div 
              key={i}
              onClick={() => {
                document.querySelector('.desktop').style.backgroundImage = `url(${wp})`;
              }}
              style={{ 
                height: '80px', 
                borderRadius: '8px', 
                backgroundImage: `url(${wp})`,
                backgroundSize: 'cover',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: '0.2s'
              }}
              onMouseOver={(e) => e.target.style.borderColor = 'var(--accent)'}
              onMouseOut={(e) => e.target.style.borderColor = 'transparent'}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '12px', textTransform: 'uppercase' }}>System Info</h3>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ opacity: 0.6 }}>OS Version</span>
            <span>1.0.42-stable</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.6 }}>Developer</span>
            <span>Antigravity</span>
          </div>
        </div>
      </section>
    </div>
  );
}
