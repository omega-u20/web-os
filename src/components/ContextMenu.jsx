import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';

export default function ContextMenu({ x, y, visible, onClose, onMinimize, onMaximize, onCloseApp, appName }) {
  if (!visible) return null;

  return (
    <>
      <div 
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10000 }} 
        onClick={onClose}
        onContextMenu={(e) => { e.preventDefault(); onClose(); }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          position: 'fixed',
          top: y,
          left: x,
          zIndex: 10001,
          minWidth: '160px',
          padding: '4px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(30, 30, 30, 0.9)',
          backdropFilter: 'blur(10px)',
          color: 'white',
        }}
      >
        <div style={{ padding: '8px 12px', fontSize: '11px', opacity: 0.5, textTransform: 'uppercase' }}>{appName}</div>
        <MenuItem icon={Minus} label="Minimize" onClick={() => { onMinimize(); onClose(); }} />
        <MenuItem icon={Square} label="Maximize" onClick={() => { onMaximize(); onClose(); }} />
        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />
        <MenuItem icon={X} label="Close" onClick={() => { onCloseApp(); onClose(); }} color="#ef4444" />
      </motion.div>
    </>
  );
}

function MenuItem({ icon: Icon, label, onClick, color = 'inherit' }) {
  return (
    <div 
      className="context-menu-item"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        fontSize: '13px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background 0.2s',
        color
      }}
      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
}
