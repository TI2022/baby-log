import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/Providers";
import {
  StyledBody,
  AppContainer,
  Header,
  HeaderContainer,
  HeaderContent,
  Title,
  Nav,
  Main
} from "@/components/layout/LayoutComponents";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baby Log - 育児記録アプリ",
  description: "赤ちゃんの成長を記録・管理するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <StyledBody className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <AppContainer>
            <Header>
              <HeaderContainer>
                <HeaderContent>
                  <Title>
                    Baby Log 👶
                  </Title>
                  <Nav />
                </HeaderContent>
              </HeaderContainer>
            </Header>
            <Main>
              {children}
            </Main>
          </AppContainer>
        </Providers>
      </StyledBody>
    </html>
  );
}