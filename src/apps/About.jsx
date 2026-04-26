import React from 'react';
import { Code, Share2, Globe, Heart } from 'lucide-react';

export default function About() {
  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center',
      color: 'white',
      gap: '20px'
    }}>
      <div style={{ 
        width: '100px', 
        height: '100px', 
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
      }}>
        <Globe size={48} color="white" />
      </div>
      
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Antigravity OS</h1>
        <p style={{ opacity: 0.6, fontSize: '14px' }}>The next generation of web-based desktop experiences.</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        <button style={{ 
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: 'none', 
          background: 'white', 
          color: 'black',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Code size={18} /> Source Code
        </button>
        <button style={{ 
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '1px solid rgba(255,255,255,0.2)', 
          background: 'transparent', 
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Learn More
        </button>
      </div>

      <div style={{ marginTop: 'auto', fontSize: '12px', opacity: 0.4, display: 'flex', alignItems: 'center', gap: '4px' }}>
        Crafted with <Heart size={12} fill="#ef4444" color="#ef4444" /> by Antigravity
      </div>
    </div>
  );
}
