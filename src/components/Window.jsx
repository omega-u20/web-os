import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Square, Expand } from 'lucide-react';
import Browser from '../apps/Browser';
import Terminal from '../apps/Terminal';
import Settings from '../apps/Settings';
import Files from '../apps/Files';
import About from '../apps/About';
import Tunnel from '../apps/Tunnel';

const APP_COMPONENTS = {
  browser: Browser,
  terminal: Terminal,
  settings: Settings,
  files: Files,
  about: About,
  tunnel: Tunnel
};

export default function Window({ app, isActive, onClose, onMinimize, onMaximize, onFocus }) {
  const windowRef = useRef(null);
  const Content = APP_COMPONENTS[app.id] || (() => <div>App Not Found</div>);

  const toggleDeviceFullscreen = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      windowRef.current?.requestFullscreen().catch(err => {
        alert(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (app.minimized) return null;

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        zIndex: isActive ? 100 : 10,
        width: app.maximized ? '100vw' : '800px',
        height: app.maximized ? 'calc(100vh - var(--taskbar-height))' : '600px',
        top: app.maximized ? 0 : '10%',
        left: app.maximized ? 0 : '15%',
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.5 }}
      style={{
        borderRadius: app.maximized ? '0px' : '12px',
        border: app.maximized ? 'none' : '1px solid var(--glass-border)',
      }}
      className={`window glass ${isActive ? 'active' : ''}`}
      onClick={onFocus}
      drag={!app.maximized}
      dragMomentum={false}
    >
      <div className="window-header" onDoubleClick={onMaximize}>
        <div className="window-title">
          <app.icon size={16} style={{ color: app.color }} />
          <span>{app.name}</span>
        </div>
        <div className="window-controls">
          <button 
            className="control-btn" 
            onClick={toggleDeviceFullscreen}
            style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '4px', marginRight: '8px' }}
            title="Toggle Device Fullscreen"
          >
            <Expand size={12} color="white" />
          </button>
          <button className="control-btn minimize" onClick={(e) => { e.stopPropagation(); onMinimize(); }} />
          <button className="control-btn maximize" onClick={(e) => { e.stopPropagation(); onMaximize(); }} />
          <button className="control-btn close" onClick={(e) => { e.stopPropagation(); onClose(); }} />
        </div>
      </div>
      <div className="window-content" style={{ height: 'calc(100% - 40px)' }}>
        <Content />
      </div>
    </motion.div>
  );
}
