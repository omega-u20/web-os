import { useState, useCallback } from 'react';

export function useWindowManager(initialApps = []) {
  const [apps, setApps] = useState(initialApps);
  const [activeAppId, setActiveAppId] = useState(null);

  const openApp = useCallback((appConfig) => {
    setApps((prev) => {
      const existing = prev.find(a => a.id === appConfig.id);
      if (existing) {
        setActiveAppId(appConfig.id);
        return prev.map(a => a.id === appConfig.id ? { ...a, minimized: false } : a);
      }
      setActiveAppId(appConfig.id);
      return [...prev, { ...appConfig, minimized: false, maximized: false }];
    });
  }, []);

  const closeApp = useCallback((id) => {
    setApps((prev) => prev.filter(a => a.id !== id));
    if (activeAppId === id) setActiveAppId(null);
  }, [activeAppId]);

  const minimizeApp = useCallback((id) => {
    setApps((prev) => prev.map(a => a.id === id ? { ...a, minimized: true } : a));
    setActiveAppId(null);
  }, []);

  const toggleMaximize = useCallback((id) => {
    setApps((prev) => prev.map(a => a.id === id ? { ...a, maximized: !a.maximized } : a));
  }, []);

  const focusApp = useCallback((id) => {
    setActiveAppId(id);
    setApps((prev) => {
       const app = prev.find(a => a.id === id);
       if (app && app.minimized) {
         return prev.map(a => a.id === id ? { ...a, minimized: false } : a);
       }
       return prev;
    });
  }, []);

  return {
    apps,
    activeAppId,
    openApp,
    closeApp,
    minimizeApp,
    toggleMaximize,
    focusApp
  };
}
