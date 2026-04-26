import React from 'react';

export default function Desktop({ children, wallpaper }) {
  return (
    <div 
      className="desktop" 
      style={{ 
        backgroundImage: `url(${wallpaper})`,
        width: '100vw',
        height: '100vh',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
}
