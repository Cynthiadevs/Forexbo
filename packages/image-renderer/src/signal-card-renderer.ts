import fs from 'fs';
import path from 'path';
import type { StrategySignalResult, BrandingConfig } from '../../shared/src/index.ts';
import { SignalDirection } from '../../shared/src/index.ts';
import { DEFAULT_BRANDING, SUPPORTED_PAIRS } from '../../config/src/index.ts';

export interface RenderOptions {
  width?: number;
  height?: number;
  branding?: BrandingConfig;
  outputPath?: string;
}

export class SignalCardRenderer {
  public static generateSVG(signal: StrategySignalResult, options: RenderOptions = {}): string {
    const width = options.width || 1080;
    const height = options.height || 1080;
    const brand = options.branding || DEFAULT_BRANDING;

    const isBuy = signal.direction === SignalDirection.BUY;
    const isSell = signal.direction === SignalDirection.SELL;

    const accentColor = isBuy ? '#00E676' : isSell ? '#FF3D71' : '#8F9BB3';
    const glowColor = isBuy ? 'rgba(0, 230, 118, 0.25)' : isSell ? 'rgba(255, 61, 113, 0.25)' : 'rgba(143, 155, 179, 0.2)';
    const dirBadgeBg = isBuy ? '#00E676' : isSell ? '#FF3D71' : '#222B45';
    const dirTextColor = isBuy ? '#0A0F1D' : '#FFFFFF';

    const pairInfo = SUPPORTED_PAIRS.find(p => p.symbol === signal.symbol) || {
      symbol: signal.symbol,
      name: `${signal.symbol} Pair`
    };

    const dateFormatted = new Date().toUTCString();

    return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090D16" />
      <stop offset="50%" stop-color="#0E1626" />
      <stop offset="100%" stop-color="#060A12" />
    </linearGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141F36" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#0D1524" stop-opacity="0.9" />
    </linearGradient>

    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <style>
    .brand { font-family: 'Inter', system-ui, sans-serif; font-weight: 900; letter-spacing: 2px; }
    .symbol-title { font-family: 'Inter', system-ui, sans-serif; font-weight: 800; fill: #FFFFFF; font-size: 56px; }
    .symbol-sub { font-family: 'Inter', system-ui, sans-serif; font-weight: 500; fill: #8F9BB3; font-size: 22px; }
    .badge-text { font-family: 'Inter', system-ui, sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 1.5px; }
    .card-label { font-family: 'Inter', system-ui, sans-serif; font-weight: 600; fill: #8F9BB3; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
    .price-value { font-family: 'JetBrains Mono', monospace, sans-serif; font-weight: 700; fill: #FFFFFF; font-size: 38px; }
    .score-title { font-family: 'Inter', system-ui, sans-serif; font-weight: 800; font-size: 42px; }
    .meta-text { font-family: 'Inter', system-ui, sans-serif; font-weight: 500; fill: #6B7A99; font-size: 18px; }
    .disclaimer { font-family: 'Inter', system-ui, sans-serif; font-weight: 400; fill: #52617D; font-size: 15px; }
  </style>

  <!-- Background Layer -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Ambient Glow Circles -->
  <circle cx="200" cy="180" r="220" fill="${glowColor}" filter="url(#neonGlow)" />
  <circle cx="880" cy="800" r="260" fill="${glowColor}" filter="url(#neonGlow)" />

  <!-- Outer Tech Grid / Borders -->
  <rect x="40" y="40" width="1000" height="1000" rx="32" fill="none" stroke="#1F2E4D" stroke-width="1.5" />
  <rect x="44" y="44" width="992" height="992" rx="28" fill="none" stroke="${accentColor}" stroke-opacity="0.15" stroke-width="1" />

  <!-- HEADER / BRANDING -->
  <g transform="translate(80, 90)">
    <rect x="0" y="0" width="48" height="48" rx="12" fill="${accentColor}" />
    <path d="M14 34 L24 14 L34 34 Z" fill="#0A0F1D" />

    <text x="64" y="32" class="brand" fill="#FFFFFF" font-size="24">${brand.brandName}</text>
    <text x="64" y="52" class="meta-text">${brand.website} • ${brand.telegramHandle}</text>

    <rect x="740" y="2" width="180" height="44" rx="22" fill="#18233C" stroke="#2C3D63" stroke-width="1" />
    <text x="830" y="30" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" fill="#00B0FF" font-size="20">TIMEFRAME ${signal.timeframe.toUpperCase()}</text>
  </g>

  <!-- HERO SECTION: SYMBOL & DIRECTION BADGE -->
  <g transform="translate(80, 190)">
    <text x="0" y="50" class="symbol-title">${signal.symbol}</text>
    <text x="0" y="85" class="symbol-sub">${pairInfo.name.toUpperCase()}</text>

    <g transform="translate(680, 0)">
      <rect x="0" y="0" width="240" height="84" rx="24" fill="${dirBadgeBg}" filter="url(#subtleShadow)" />
      <text x="120" y="54" text-anchor="middle" class="badge-text" fill="${dirTextColor}">
        ${isBuy ? '▲ BUY' : isSell ? '▼ SELL' : '■ WAIT'}
      </text>
    </g>
  </g>

  <!-- MAIN TRADE PARAMETERS CARD -->
  <g transform="translate(80, 320)" filter="url(#subtleShadow)">
    <rect x="0" y="0" width="920" height="340" rx="24" fill="url(#cardGrad)" stroke="#223252" stroke-width="1.5" />

    <g transform="translate(40, 45)">
      <text x="0" y="0" class="card-label">📌 ENTRY PRICE</text>
      <text x="0" y="44" class="price-value">${signal.entryPrice}</text>
    </g>

    <g transform="translate(480, 45)">
      <text x="0" y="0" class="card-label" fill="#FF5252">🛑 STOP LOSS</text>
      <text x="0" y="44" class="price-value" fill="#FF5252">${signal.stopLoss}</text>
    </g>

    <line x1="40" y1="130" x2="880" y2="130" stroke="#1E2C48" stroke-width="1.5" />

    <g transform="translate(40, 180)">
      <text x="0" y="0" class="card-label" fill="${accentColor}">🎯 TAKE PROFIT 1</text>
      <text x="0" y="44" class="price-value">${signal.takeProfit1}</text>
      <text x="0" y="78" class="meta-text">1:${signal.riskRewardRatio1} R:R</text>
    </g>

    <g transform="translate(340, 180)">
      <text x="0" y="0" class="card-label" fill="${accentColor}">🎯 TAKE PROFIT 2</text>
      <text x="0" y="44" class="price-value">${signal.takeProfit2 || '-'}</text>
      <text x="0" y="78" class="meta-text">1:${signal.riskRewardRatio2 || '-'} R:R</text>
    </g>

    <g transform="translate(640, 180)">
      <text x="0" y="0" class="card-label" fill="${accentColor}">🎯 TAKE PROFIT 3</text>
      <text x="0" y="44" class="price-value">${signal.takeProfit3 || '-'}</text>
      <text x="0" y="78" class="meta-text">1:${signal.riskRewardRatio3 || '-'} R:R</text>
    </g>
  </g>

  <!-- QUANTITATIVE METRICS CARD -->
  <g transform="translate(80, 690)" filter="url(#subtleShadow)">
    <rect x="0" y="0" width="920" height="230" rx="24" fill="url(#cardGrad)" stroke="#223252" stroke-width="1.5" />

    <g transform="translate(40, 35)">
      <rect x="0" y="0" width="260" height="160" rx="18" fill="#0C1322" stroke="#1D2A45" stroke-width="1" />
      <text x="130" y="40" text-anchor="middle" class="card-label">SIGNAL STRENGTH</text>
      <text x="130" y="100" text-anchor="middle" class="score-title" fill="${accentColor}">${signal.score}<tspan font-size="24" fill="#8F9BB3">/100</tspan></text>
      <text x="130" y="135" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" fill="#FFFFFF" font-size="16">${signal.scoreCategory}</text>
    </g>

    <g transform="translate(340, 45)">
      <text x="0" y="0" class="card-label">QUANTITATIVE CONFLUENCE</text>
      <g transform="translate(0, 30)">
        <circle cx="6" cy="-5" r="5" fill="${accentColor}" />
        <text x="24" y="0" class="meta-text" fill="#FFFFFF">Trend Bias: <tspan font-weight="700" fill="${accentColor}">${signal.indicatorsSnapshot.trend}</tspan></text>
      </g>
      <g transform="translate(0, 65)">
        <circle cx="6" cy="-5" r="5" fill="${accentColor}" />
        <text x="24" y="0" class="meta-text" fill="#FFFFFF">EMA Alignment: <tspan font-weight="700" fill="${accentColor}">${signal.indicatorsSnapshot.emaAlignment}</tspan></text>
      </g>
      <g transform="translate(0, 100)">
        <circle cx="6" cy="-5" r="5" fill="${accentColor}" />
        <text x="24" y="0" class="meta-text" fill="#FFFFFF">MTF Confluence: <tspan font-weight="700" fill="${accentColor}">${signal.multiTimeframe.alignmentScore}% Agreement</tspan></text>
      </g>
    </g>

    <g transform="translate(680, 45)">
      <text x="0" y="0" class="card-label">VOLATILITY / MOMENTUM</text>
      <g transform="translate(0, 30)">
        <text x="0" y="0" class="meta-text">RSI (14): <tspan font-weight="700" fill="#FFFFFF">${signal.indicatorsSnapshot.rsi}</tspan></text>
      </g>
      <g transform="translate(0, 65)">
        <text x="0" y="0" class="meta-text">ADX (14): <tspan font-weight="700" fill="#FFFFFF">${signal.indicatorsSnapshot.adx.adx}</tspan></text>
      </g>
      <g transform="translate(0, 100)">
        <text x="0" y="0" class="meta-text">Volatility: <tspan font-weight="700" fill="#FFFFFF">${signal.indicatorsSnapshot.volatility}</tspan></text>
      </g>
    </g>
  </g>

  <!-- FOOTER & DISCLAIMER -->
  <g transform="translate(80, 960)">
    <text x="0" y="15" class="disclaimer">⚠️ ${brand.disclaimerText}</text>
    <text x="920" y="15" text-anchor="end" class="meta-text" fill="#52617D">Generated: ${dateFormatted}</text>
  </g>
</svg>
    `.trim();
  }

  public static async renderToFile(signal: StrategySignalResult, options: RenderOptions = {}): Promise<string> {
    const svg = this.generateSVG(signal, options);
    const storageDir = options.outputPath ? path.dirname(options.outputPath) : path.resolve(process.cwd(), 'storage/signals');

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const filename = options.outputPath || path.join(storageDir, `signal-${signal.symbol}-${signal.timeframe}-${Date.now()}.svg`);
    fs.writeFileSync(filename, svg, 'utf-8');

    return filename;
  }
}
