'use client';
import { useEffect, useState } from 'react';
import { getSiteSettings, SiteSettings } from '@/lib/firestore/settings';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}