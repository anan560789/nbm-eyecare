import type { Metadata } from "next";
// 確保您的全域 CSS 檔案有正確引入 (若您的檔名不同，請自行調整)
import "./globals.css"; 

export const metadata: Metadata = {
  title: "彥臣專屬眼科衛教保健網站 | NBM",
  description: "全方位 3D 醫學級眼部解析與精準營養對策，守護您的靈魂之窗。",
  openGraph: {
    title: "彥臣專屬眼科衛教保健網站",
    description: "全方位 3D 醫學級眼部解析與精準營養對策，守護您的靈魂之窗。",
    url: "https://nbm-eyecare.pages.dev",
    siteName: "彥臣生技 NBM",
    locale: "zh_TW",
    type: "website",
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
