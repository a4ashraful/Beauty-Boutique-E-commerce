import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/constants';

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          padding: 60,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 9999,
              background: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            ✦
          </div>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#111827',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          Beauty Boutique
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#e11d48',
            letterSpacing: 6,
            marginTop: 10,
            textTransform: 'uppercase',
          }}
        >
          By Tandra
        </div>
        <div
          style={{
            fontSize: 26,
            color: '#6b7280',
            marginTop: 40,
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          Premium cosmetics & beauty products delivered across Bangladesh
        </div>
        <div
          style={{
            marginTop: 50,
            display: 'flex',
            gap: 20,
            fontSize: 20,
            color: '#9f1239',
            fontWeight: 600,
          }}
        >
          <span>✓ 100% Authentic</span>
          <span>✓ Cash on Delivery</span>
          <span>✓ Nationwide</span>
        </div>
      </div>
    ),
    size
  );
}
