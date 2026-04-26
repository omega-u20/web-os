import React, { useState, useEffect } from 'react';
import { useWindowManager } from './hooks/useWindowManager';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';
import { 
  Globe, 
  Terminal as TerminalIcon, 
  Settings as SettingsIcon, 
  Folder, 
  Info,
  Code,
  Monitor
} from 'lucide-react';
import { useLongPress } from './hooks/useLongPress';

function DesktopIcon({ app, onOpen, onContextMenu }) {
  const longPressProps = useLongPress((e) => {
    const event = e.touches ? e.touches[0] : e;
    onContextMenu(event);
  });

  return (
    <div 
      className="desktop-icon"
      onClick={onOpen}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e); }}
      {...longPressProps}
    >
      <div className="desktop-icon-img glass">
        <app.icon size={28} />
      </div>
      <span className="desktop-icon-label">{app.name}</span>
    </div>
  );
}

// App Manifest
const APP_TEMPLATES = {
  browser: { id: 'browser', name: 'Proxy Browser', icon: Globe, color: '#3b82f6' },
  terminal: { id: 'terminal', name: 'Terminal', icon: TerminalIcon, color: '#10b981' },
  files: { id: 'files', name: 'File Explorer', icon: Folder, color: '#f59e0b' },
  settings: { id: 'settings', name: 'Settings', icon: SettingsIcon, color: '#6366f1' },
  about: { id: 'about', name: 'About OS', icon: Info, color: '#ec4899' },
};

export default function App() {
  const { apps, activeAppId, openApp, closeApp, minimizeApp, toggleMaximize, focusApp } = useWindowManager();
  const [wallpaper, setWallpaper] = useState('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop');
  const [booting, setBooting] = useState(true);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, app: null });

  useEffect(() => {
    const handleGlobalContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleGlobalContextMenu);
    
    const timer = setTimeout(() => setBooting(false), 2000);
    
    return () => {
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
      clearTimeout(timer);
    };
  }, []);

  if (booting) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0a0a0a',
        color: 'white',
        gap: '24px'
      }}>
        <Monitor size={64} className="animate-pulse" />
        <h1 style={{ fontWeight: 300, letterSpacing: '4px' }}>ANTIGRAVITY OS</h1>
        <div style={{ width: '200px', height: '2px', background: '#333' }}>
          <div className="boot-progress" style={{ 
            height: '100%', 
            background: 'var(--accent)', 
            width: '100%',
            animation: 'boot-load 2s linear'
          }} />
        </div>
        <style>{`
          @keyframes boot-load {
            from { width: 0; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Desktop wallpaper={wallpaper}>
      {/* Desktop Icons */}
      <div className="desktop-icons">
        {Object.values(APP_TEMPLATES).map((app) => (
          <DesktopIcon 
            key={app.id} 
            app={app} 
            onOpen={() => openApp(app)} 
            onContextMenu={(e) => setContextMenu({ visible: true, x: e.clientX || e.touches?.[0]?.clientX, y: (e.clientY || e.touches?.[0]?.clientY) - 20, app })}
          />
        ))}
      </div>

      {/* Windows */}
      {apps.map((app) => (
        <Window
          key={app.id}
          app={app}
          isActive={activeAppId === app.id}
          onClose={() => closeApp(app.id)}
          onMinimize={() => minimizeApp(app.id)}
          onMaximize={() => toggleMaximize(app.id)}
          onFocus={() => focusApp(app.id)}
        />
      ))}

      {/* Taskbar */}
      <Taskbar 
        apps={apps} 
        activeAppId={activeAppId} 
        onAppClick={(id) => focusApp(id)}
        onMinimize={(id) => minimizeApp(id)}
        onMaximize={(id) => toggleMaximize(id)}
        onCloseApp={(id) => closeApp(id)}
        onContextMenu={(e, app) => setContextMenu({ visible: true, x: e.clientX, y: e.clientY - 120, app })}
        templates={APP_TEMPLATES}
        onStartClick={() => openApp(APP_TEMPLATES.about)}
      />

      <ContextMenu 
        {...contextMenu} 
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        onMinimize={() => minimizeApp(contextMenu.app?.id)}
        onMaximize={() => toggleMaximize(contextMenu.app?.id)}
        onCloseApp={() => closeApp(contextMenu.app?.id)}
        appName={contextMenu.app?.name}
      />
    </Desktop>
  );
}
