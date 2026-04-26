import React, { useState } from 'react';
import { LayoutGrid, Clock } from 'lucide-react';
import ContextMenu from './ContextMenu';
import { useLongPress } from '../hooks/useLongPress';

function TaskbarItem({ app, activeAppId, onAppClick, onContextMenu }) {
  const longPressProps = useLongPress((e) => {
    // If it's a touch event, we need to manually pass the coordinates
    const event = e.touches ? e.touches[0] : e;
    onContextMenu(event, app);
  });

  return (
    <div 
      className={`taskbar-item ${activeAppId === app.id ? 'active' : ''}`}
      onClick={() => onAppClick(app.id)}
      onContextMenu={(e) => onContextMenu(e, app)}
      {...longPressProps}
      title={app.name}
    >
      <app.icon size={20} style={{ color: app.color }} />
    </div>
  );
}

export default function Taskbar({ apps, activeAppId, onAppClick, templates, onStartClick, onMinimize, onMaximize, onCloseApp, onContextMenu }) {
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="taskbar glass">
      <div className="taskbar-items">
        <div className="taskbar-item" onClick={onStartClick} title="Start">
          <LayoutGrid size={20} className="text-white" />
        </div>
        
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
        
        {apps.map((app) => (
          <TaskbarItem 
            key={app.id}
            app={app}
            activeAppId={activeAppId}
            onAppClick={onAppClick}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>

      <div className="taskbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '12px' }}>
        <div className="taskbar-status" style={{ display: 'flex', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
          <span>ENG</span>
          <span>WiFi</span>
        </div>
        <div className="taskbar-clock" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '11px' }}>
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span style={{ opacity: 0.6 }}>{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
