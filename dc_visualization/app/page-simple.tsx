"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('加载中...');

  useEffect(() => {
    setMessage('台风杜苏芮可视化平台 - 简化测试版本');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {message}
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2rem' }}>
          正在测试静态导出部署...
        </p>
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}>
          <p style={{ margin: 0, color: '#cbd5e1' }}>
            如果你能看到这个页面，说明静态导出模式工作正常！
          </p>
        </div>
      </div>
    </div>
  );
}