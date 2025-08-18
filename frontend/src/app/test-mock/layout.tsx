import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mock Server Test - Baby Log',
  description: 'Mock server integration testing page',
};

export default function TestMockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}