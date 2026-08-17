import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// 定義預覽圖的標籤與尺寸
export const alt = '彥臣專屬眼科衛教保健網站';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          backgroundColor: '#f8fafc',
          // 加入符合 NBM 品牌的漸層背景 (淺翠綠至淺天藍)
          backgroundImage: 'linear-gradient(to bottom right, #d1fae5, #e0f2fe)',
        }}
      >
        {/* Logo 區塊：加上白色圓角背景與陰影增加質感 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: '40px', borderRadius: '40px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://nbm-eyecare.pages.dev/logo.jpg"
            alt="NBM Logo"
            height={220}
          />
        </div>
        
        {/* 網站主標題 */}
        <h1 style={{ fontSize: '64px', fontWeight: '900', color: '#0f172a', marginTop: '60px', textShadow: '0 4px 6px rgba(0,0,0,0.1)', letterSpacing: '2px' }}>
          彥臣專屬眼科衛教保健網站
        </h1>
        
        {/* 副標題 */}
        <p style={{ fontSize: '32px', fontWeight: '600', color: '#475569', marginTop: '20px', letterSpacing: '1px' }}>
          全方位 3D 醫學級眼部解析與精準營養對策
        </p>
      </div>
    )
  );
}