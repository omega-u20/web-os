import React, { useState, useRef, useEffect } from 'react';

export default function Terminal() {
  const [history, setHistory] = useState([
    'Antigravity OS [Version 1.0.42]',
    '(c) 2026 Antigravity Corp. All rights reserved.',
    '',
    'Type "help" to see available commands.',
    ''
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newHistory = [...history, `user@antigravity:~$ ${input}`];
      
      switch (cmd) {
        case 'help':
          newHistory.push('Available commands: help, ls, clear, neofetch, whoami, date');
          break;
        case 'ls':
          newHistory.push('Documents  Downloads  Pictures  Music  Videos  System');
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case 'whoami':
          newHistory.push('guest_user');
          break;
        case 'date':
          newHistory.push(new Date().toString());
          break;
        case 'neofetch':
          newHistory.push(
            '   .---.     OS: Antigravity Web OS',
            '  /     \\    Kernel: v1.0.42-web',
            '  | (O) |    Uptime: 2 minutes',
            '  \\     /    Shell: reactshell 18.2.0',
            '   \'---\'     Resolution: ' + window.innerWidth + 'x' + window.innerHeight
          );
          break;
        case '':
          break;
        default:
          newHistory.push(`Command not found: ${cmd}`);
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div 
      style={{ 
        height: '100%', 
        background: '#0c0c0c', 
        color: '#00ff00', 
        fontFamily: 'var(--font-mono)', 
        padding: '16px',
        overflowY: 'auto',
        fontSize: '14px',
        lineHeight: '1.5'
      }}
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>
      ))}
      <div style={{ display: 'flex', gap: '8px' }}>
        <span style={{ color: '#3b82f6' }}>user@antigravity:~$</span>
        <input
          id="term-input"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            outline: 'none',
            flex: 1
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
