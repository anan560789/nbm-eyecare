import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // 設定網站的基礎網址，確保相對路徑的圖片能正確載入
  metadataBase: new URL("https://nbm-eyecare.pages.dev"),
  
  title: "彥臣專屬眼科衛教保健網站 | NBM",
  description: "全方位 3D 醫學級眼部解析與精準營養對策，守護您的靈魂之窗。",
  
  // Open Graph 是給 LINE、FB 等社群軟體抓取預覽卡片用的設定
  openGraph: {
    title: "彥臣專屬眼科衛教保健網站",
    description: "全方位 3D 醫學級眼部解析與精準營養對策，守護您的靈魂之窗。",
    url: "https://nbm-eyecare.pages.dev",
    siteName: "彥臣生技 NBM",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        // 這裡已經更新為您剛剛合成下載的完美預覽大圖
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "彥臣生技 NBM 專屬衛教網站",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
