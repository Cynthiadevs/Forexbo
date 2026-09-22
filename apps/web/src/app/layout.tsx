import './globals.css';
import React from 'react';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Alpha Quant FX | AI Forex Intelligence & Telegram Automation Platform',
  description: 'Institutional-grade real-time Forex market intelligence, quantitative multi-timeframe signal generation, OpenAI market reasoning, and Telegram automation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased selection:bg-primary/30 selection:text-primary">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          
          {/* Global Footer */}
          <footer className="border-t border-border/60 bg-background/90 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-text-muted">
            <div className="max-w-7xl mx-auto space-y-3">
              <p className="font-semibold text-text-secondary">
                Alpha Quant FX • Institutional AI Signal Generation & Multi-Channel Telegram Platform
              </p>
              <p className="max-w-3xl mx-auto text-[11px] leading-relaxed">
                ⚠️ <span className="font-semibold text-amber-400">Risk Disclaimer:</span> Financial market trading, Forex, and Metals carry substantial risk of loss and are not suitable for every investor. The platform provides automated quantitative technical analysis and educational content. Past performance is not indicative of future results.
              </p>
              <p className="text-[10px]">
                © {new Date().getFullYear()} Alpha Quant FX Inc. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
