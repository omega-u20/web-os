import React from 'react';
import { Folder, FileText, ImageIcon, Music, Video, ChevronRight, Search } from 'lucide-react';

export default function Files() {
  const folders = [
    { name: 'Documents', icon: Folder, color: '#3b82f6' },
    { name: 'Downloads', icon: Folder, color: '#10b981' },
    { name: 'Pictures', icon: ImageIcon, color: '#ec4899' },
    { name: 'Music', icon: Music, color: '#f59e0b' },
    { name: 'Videos', icon: Video, color: '#ef4444' },
  ];

  const files = [
    { name: 'resume.pdf', icon: FileText, size: '1.2 MB' },
    { name: 'project_plan.txt', icon: FileText, size: '45 KB' },
    { name: 'vacation.jpg', icon: ImageIcon, size: '4.5 MB' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', color: 'white' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '16px' }}>
        <h4 style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Favorites</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {folders.map((f, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              fontSize: '13px', 
              padding: '6px 10px', 
              borderRadius: '6px',
              cursor: 'pointer',
              background: i === 0 ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}>
              <f.icon size={16} color={f.color} />
              {f.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ccc' }}>
            <span>Root</span>
            <ChevronRight size={14} />
            <span style={{ color: 'white' }}>Documents</span>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input 
              placeholder="Search..." 
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: 'none', 
                borderRadius: '15px', 
                padding: '4px 12px 4px 32px', 
                fontSize: '12px', 
                color: 'white',
                outline: 'none'
              }} 
            />
          </div>
        </div>

        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '20px' }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <f.icon size={40} style={{ opacity: 0.8 }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px' }}>{f.name}</div>
                <div style={{ fontSize: '10px', opacity: 0.4 }}>{f.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
