export function getAdminHtml(brandName = 'ALPHA QUANT FX'): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} — Admin Command Center</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              green: '#00E676',
              red: '#FF3D71',
              blue: '#00B0FF',
              dark: '#0A0F1D',
              card: '#0F172A',
              border: '#1E293B',
              hover: '#1E293B'
            }
          }
        }
      }
    }
  </script>
  <!-- Feather Icons -->
  <script src="https://unpkg.com/feather-icons"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #060A12; color: #F8FAFC; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .glass { background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); border: 1px solid #1E293B; }
    .neon-glow-green { box-shadow: 0 0 20px rgba(0, 230, 118, 0.2); }
    .neon-glow-red { box-shadow: 0 0 20px rgba(255, 61, 113, 0.2); }
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0A0F1D; }
    ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #334155; }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-brand-green selection:text-black">

  <!-- ==================== AUTH OVERLAY (IF NOT LOGGED IN) ==================== -->
  <div id="authOverlay" class="fixed inset-0 z-50 bg-[#060A12]/95 backdrop-blur-md flex items-center justify-center p-4">
    <div class="glass w-full max-w-md p-8 rounded-2xl border border-brand-border shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-green via-brand-blue to-purple-600"></div>
      
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-green/10 border border-brand-green/30 text-brand-green mb-4">
          <i data-feather="shield" class="w-7 h-7"></i>
        </div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">${brandName}</h1>
        <p class="text-sm text-slate-400 mt-1">Admin Command Center & Site Management</p>
      </div>

      <div id="loginError" class="hidden mb-4 p-3 rounded-lg bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs font-medium"></div>

      <form id="loginForm" onsubmit="handleLogin(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Admin Email</label>
          <input type="email" id="loginEmail" value="admin@alphaquantfx.io" required
            class="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition" />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
          <input type="password" id="loginPassword" value="AdminSecurePassword123!" required
            class="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition" />
        </div>

        <button type="submit" id="loginSubmitBtn"
          class="w-full py-3 px-4 rounded-lg bg-brand-green hover:bg-brand-green/90 text-slate-950 font-bold text-sm tracking-wide transition shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2">
          <span>Log In to Dashboard</span>
          <i data-feather="arrow-right" class="w-4 h-4"></i>
        </button>

        <button type="button" onclick="quickFillAndLogin()"
          class="w-full py-2 px-4 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-700/60 transition">
          ⚡ Quick 1-Click Admin Access (Demo)
        </button>
      </form>
    </div>
  </div>

  <!-- ==================== MAIN DASHBOARD LAYOUT ==================== -->
  <div id="mainDashboard" class="hidden flex-1 flex flex-col min-h-screen">
    
    <!-- TOP NAVIGATION BAR -->
    <header class="glass sticky top-0 z-40 border-b border-brand-border px-6 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-green to-brand-blue flex items-center justify-center text-slate-950 font-black text-lg">
            ⚡
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-base tracking-tight text-white">${brandName}</span>
              <span class="px-2 py-0.5 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-[10px] font-bold">ADMIN</span>
            </div>
            <p class="text-[11px] text-slate-400">Institutional FX Intelligence & Telegram Automation</p>
          </div>
        </div>

        <!-- Live Status Pills -->
        <div class="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-brand-border text-xs">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-brand-border">
            <span class="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
            <span class="text-slate-300 font-medium">Market:</span>
            <span id="headerMarketStatus" class="text-brand-green font-semibold">CONNECTED</span>
          </div>

          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-brand-border">
            <i data-feather="clock" class="w-3 h-3 text-brand-blue"></i>
            <span class="text-slate-300 font-medium">Session:</span>
            <span id="headerSession" class="text-brand-blue font-semibold">LONDON / NY</span>
          </div>

          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-brand-border">
            <i data-feather="send" class="w-3 h-3 text-purple-400"></i>
            <span class="text-slate-300 font-medium">Auto-Post:</span>
            <span id="headerAutoPost" class="text-purple-400 font-semibold">ACTIVE</span>
          </div>
        </div>
      </div>

      <!-- Right Action Bar -->
      <div class="flex items-center gap-3">
        <a href="/docs" target="_blank"
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-brand-border transition font-medium">
          <i data-feather="book-open" class="w-3.5 h-3.5 text-brand-blue"></i>
          <span>Swagger Docs</span>
        </a>

        <button onclick="openGenerateModal()"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-green hover:bg-brand-green/90 text-slate-950 text-xs font-bold transition shadow-md shadow-brand-green/20">
          <i data-feather="zap" class="w-3.5 h-3.5"></i>
          <span>Generate Signal</span>
        </button>

        <div class="flex items-center gap-2 pl-3 border-l border-brand-border">
          <div class="text-right hidden sm:block">
            <div id="adminUserEmail" class="text-xs font-semibold text-white">admin@alphaquantfx.io</div>
            <div class="text-[10px] text-slate-400">Super Administrator</div>
          </div>
          <button onclick="handleLogout()" title="Log out"
            class="p-2 rounded-lg bg-slate-800 hover:bg-brand-red/20 text-slate-400 hover:text-brand-red border border-brand-border transition">
            <i data-feather="log-out" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- NAVIGATION TABS -->
    <div class="border-b border-brand-border bg-[#090D16] px-6">
      <nav class="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 text-sm font-medium">
        <button onclick="switchTab('signals')" id="tabBtn-signals"
          class="tab-btn px-3 py-2 rounded-lg text-brand-green bg-brand-green/10 border border-brand-green/30 flex items-center gap-2 transition whitespace-nowrap">
          <i data-feather="activity" class="w-4 h-4"></i>
          <span>Signals Hub & Auto-Post</span>
        </button>

        <button onclick="switchTab('settings')" id="tabBtn-settings"
          class="tab-btn px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 transition whitespace-nowrap">
          <i data-feather="settings" class="w-4 h-4"></i>
          <span>Site Settings & Env</span>
        </button>

        <button onclick="switchTab('schedule')" id="tabBtn-schedule"
          class="tab-btn px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 transition whitespace-nowrap">
          <i data-feather="calendar" class="w-4 h-4"></i>
          <span>Posting Rules & Photos</span>
        </button>

        <button onclick="switchTab('market')" id="tabBtn-market"
          class="tab-btn px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 transition whitespace-nowrap">
          <i data-feather="trending-up" class="w-4 h-4"></i>
          <span>Live Market Quotes</span>
        </button>

        <button onclick="switchTab('backtest')" id="tabBtn-backtest"
          class="tab-btn px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 transition whitespace-nowrap">
          <i data-feather="cpu" class="w-4 h-4"></i>
          <span>Backtesting Lab</span>
        </button>

        <button onclick="switchTab('logs')" id="tabBtn-logs"
          class="tab-btn px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 transition whitespace-nowrap">
          <i data-feather="terminal" class="w-4 h-4"></i>
          <span>System Diagnostics</span>
        </button>
      </nav>
    </div>

    <!-- MAIN CONTENT CONTAINER -->
    <main class="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">

      <!-- ==================== TAB 1: SIGNALS HUB & AUTO-POST ==================== -->
      <div id="tab-signals" class="tab-content space-y-6">
        
        <!-- Metrics Banner -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="glass p-4 rounded-xl border border-brand-border">
            <div class="text-xs font-medium text-slate-400">Signals Generated</div>
            <div id="statTotalSignals" class="text-2xl font-black text-white mt-1">2</div>
            <div class="text-[11px] text-brand-green mt-1 flex items-center gap-1">
              <i data-feather="arrow-up-right" class="w-3 h-3"></i> Real-time Confluence
            </div>
          </div>

          <div class="glass p-4 rounded-xl border border-brand-border">
            <div class="text-xs font-medium text-slate-400">Win Rate (Verified)</div>
            <div id="statWinRate" class="text-2xl font-black text-brand-green mt-1">74.5%</div>
            <div class="text-[11px] text-slate-400 mt-1">Profit Factor: 2.18</div>
          </div>

          <div class="glass p-4 rounded-xl border border-brand-border">
            <div class="text-xs font-medium text-slate-400">Posts Sent Today</div>
            <div id="statDailyPosts" class="text-2xl font-black text-purple-400 mt-1">1 / 8</div>
            <div id="statPostCap" class="text-[11px] text-slate-400 mt-1">Cap: 8 Posts/Day</div>
          </div>

          <div class="glass p-4 rounded-xl border border-brand-border">
            <div class="text-xs font-medium text-slate-400">Telegram Target</div>
            <div id="statTargetChannel" class="text-sm font-bold text-brand-blue truncate mt-2">@AlphaQuantFX</div>
            <div class="text-[11px] text-slate-400 mt-1">Channel & Group Active</div>
          </div>
        </div>

        <!-- Signal List Table & Action Bar -->
        <div class="glass rounded-xl border border-brand-border overflow-hidden">
          <div class="p-4 border-b border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <span>Active & Historical Signal Stream</span>
                <span class="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-medium">Live Feed</span>
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">Automated 8-factor confluence scoring & Telegram dispatch engine</p>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="fetchSignals()" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-brand-border text-xs flex items-center gap-1.5 transition">
                <i data-feather="refresh-cw" class="w-3.5 h-3.5"></i>
                <span>Refresh</span>
              </button>
              <button onclick="openGenerateModal()" class="px-3 py-2 rounded-lg bg-brand-green hover:bg-brand-green/90 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                <i data-feather="plus" class="w-3.5 h-3.5"></i>
                <span>New Signal</span>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-brand-border">
                <tr>
                  <th class="p-3.5">Pair / Timeframe</th>
                  <th class="p-3.5">Direction</th>
                  <th class="p-3.5">Score</th>
                  <th class="p-3.5">Entry Price</th>
                  <th class="p-3.5">Stop Loss</th>
                  <th class="p-3.5">Take Profit 1</th>
                  <th class="p-3.5">Take Profit 2</th>
                  <th class="p-3.5">Status</th>
                  <th class="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="signalsTableBody" class="divide-y divide-brand-border">
                <!-- Dynamically Populated -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ==================== TAB 2: SITE SETTINGS & ENV MANAGER ==================== -->
      <div id="tab-settings" class="tab-content hidden space-y-6">
        <div class="glass p-6 rounded-xl border border-brand-border">
          <div class="border-b border-brand-border pb-4 mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-white flex items-center gap-2">
                <i data-feather="sliders" class="w-5 h-5 text-brand-green"></i>
                <span>Environment & Platform Configuration</span>
              </h2>
              <p class="text-xs text-slate-400 mt-1">Update your Telegram tokens, OpenAI API keys, broker feed, and brand settings on the fly.</p>
            </div>
            <button onclick="saveEnvironmentSettings()" class="px-4 py-2 rounded-lg bg-brand-green hover:bg-brand-green/90 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-brand-green/20">
              <i data-feather="save" class="w-4 h-4"></i>
              <span>Save & Apply Settings</span>
            </button>
          </div>

          <form id="settingsForm" onsubmit="event.preventDefault(); saveEnvironmentSettings();" class="space-y-6">
            
            <!-- Section: Telegram Credentials -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-purple-400">
                <i data-feather="send" class="w-4 h-4"></i>
                <span>Telegram Bot & Target Destinations</span>
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">
                    Telegram Bot Token (from @BotFather)
                  </label>
                  <div class="relative">
                    <input type="password" id="cfgTelegramBotToken" placeholder="123456789:ABCdefGHIjklMNOpqr..."
                      class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-green" />
                    <button type="button" onclick="togglePasswordVisibility('cfgTelegramBotToken')"
                      class="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs">
                      👁️
                    </button>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">Get this by messaging @BotFather on Telegram and typing /newbot.</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">
                    Target VIP Channel ID / Username
                  </label>
                  <input type="text" id="cfgTelegramChannelId" placeholder="@AlphaQuantFX or -100123456789"
                    class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-green" />
                  <p class="text-[11px] text-slate-500 mt-1">Make sure your bot is added as Administrator with Post privileges.</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">
                    Free / Public Community Group ID
                  </label>
                  <input type="text" id="cfgTelegramGroupId" placeholder="@AlphaQuantPublic"
                    class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-green" />
                  <p class="text-[11px] text-slate-500 mt-1">Target for periodic free signals and daily reports.</p>
                </div>

                <div class="flex items-end">
                  <button type="button" onclick="testTelegramConnection()"
                    class="w-full py-2.5 px-4 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center justify-center gap-2">
                    <i data-feather="check-circle" class="w-4 h-4"></i>
                    <span>🧪 Send Test Message to Telegram</span>
                  </button>
                </div>
              </div>
            </div>

            <hr class="border-brand-border" />

            <!-- Section: AI Engine & OpenAI -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-brand-blue">
                <i data-feather="cpu" class="w-4 h-4"></i>
                <span>OpenAI & AI Explanation Controls</span>
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">OpenAI API Key (Optional)</label>
                  <input type="password" id="cfgOpenaiApiKey" placeholder="sk-..."
                    class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-green" />
                  <p class="text-[11px] text-slate-500 mt-1">Leave blank to use institutional deterministic templates.</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">OpenAI Model</label>
                  <select id="cfgOpenaiModel" class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green">
                    <option value="gpt-4o-mini">gpt-4o-mini (Fast & Cost-Efficient)</option>
                    <option value="gpt-4o">gpt-4o (Deep Reasoning)</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Max Daily AI Budget ($ USD)</label>
                  <input type="number" id="cfgOpenaiBudget" step="0.5" value="5.00"
                    class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green" />
                </div>
              </div>
            </div>

            <hr class="border-brand-border" />

            <!-- Section: Market Feed & Demo Mode -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-brand-green">
                <i data-feather="database" class="w-4 h-4"></i>
                <span>Market Data Provider & Simulation Mode</span>
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Market Provider</label>
                  <select id="cfgMarketProvider" class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green">
                    <option value="DEMO">Demo Simulator (Geometric Brownian Walk)</option>
                    <option value="POLYGON">Polygon.io / Massive Live Feed</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Demo Mode Active</label>
                  <select id="cfgDemoMode" class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green">
                    <option value="true">YES — Safe Simulation Mode</option>
                    <option value="false">NO — Live Market Feed</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Market Provider API Key</label>
                  <input type="password" id="cfgMarketApiKey" placeholder="Polygon / Provider Key"
                    class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-green" />
                </div>
              </div>
            </div>

            <hr class="border-brand-border" />

            <!-- Section: Brand & Website -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-yellow-400">
                <i data-feather="globe" class="w-4 h-4"></i>
                <span>Branding & Public Links</span>
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
                  <input type="text" id="cfgBrandName" value="ALPHA QUANT FX"
                    class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
                  <input type="text" id="cfgBrandWebsite" value="https://alphaquantfx.io"
                    class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Telegram Community Handle</label>
                  <input type="text" id="cfgBrandTelegram" value="@AlphaQuantFX"
                    class="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green" />
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>

      <!-- ==================== TAB 3: POSTING RULES & PHOTO CONTROLS ==================== -->
      <div id="tab-schedule" class="tab-content hidden space-y-6">
        <div class="glass p-6 rounded-xl border border-brand-border space-y-6">
          <div class="border-b border-brand-border pb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-white flex items-center gap-2">
                <i data-feather="image" class="w-5 h-5 text-purple-400"></i>
                <span>Automated Telegram Post & Media Rules</span>
              </h2>
              <p class="text-xs text-slate-400 mt-1">Configure daily post limits, scheduled hours, and whether signals include high-res branded graphics or text.</p>
            </div>
            <button onclick="savePostingRules()" class="px-4 py-2 rounded-lg bg-brand-green hover:bg-brand-green/90 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-brand-green/20">
              <i data-feather="save" class="w-4 h-4"></i>
              <span>Save Posting Rules</span>
            </button>
          </div>

          <form id="postingRulesForm" onsubmit="event.preventDefault(); savePostingRules();" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <!-- 1. General Posting Limits -->
              <div class="glass p-4 rounded-xl border border-brand-border space-y-4">
                <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <i data-feather="check-square" class="w-4 h-4 text-brand-green"></i>
                  <span>Post Frequency Limits</span>
                </h3>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Auto-Posting Switch</label>
                  <select id="ruleAutoPosting" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green">
                    <option value="true">ENABLED (Continuous Auto-Dispatch)</option>
                    <option value="false">PAUSED (Manual Approval Only)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Max Daily Posts / Signals</label>
                  <input type="number" id="ruleMaxDailyPosts" min="1" max="50" value="8"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green" />
                  <p class="text-[11px] text-slate-500 mt-1">Prevents channel spam by capping daily dispatches.</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Min Confluence Score (0-100)</label>
                  <input type="number" id="ruleMinScore" min="50" max="95" value="70"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green" />
                  <p class="text-[11px] text-slate-500 mt-1">Only setups scoring &gt;= this value will trigger an auto-post.</p>
                </div>
              </div>

              <!-- 2. Schedule & Trading Hours -->
              <div class="glass p-4 rounded-xl border border-brand-border space-y-4">
                <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <i data-feather="clock" class="w-4 h-4 text-brand-blue"></i>
                  <span>Posting Hours / Sessions</span>
                </h3>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Schedule Mode</label>
                  <select id="ruleScheduleType" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green">
                    <option value="ON_SIGNAL">Whenever Confluence Detected (24/5)</option>
                    <option value="SCHEDULED_HOURS">Active Only During Selected UTC Hours</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Active Trading Hours (UTC)</label>
                  <div class="grid grid-cols-4 gap-1.5 text-[11px] max-h-36 overflow-y-auto p-2 bg-slate-900 rounded-lg border border-brand-border" id="utcHoursContainer">
                    <!-- Populated by JS -->
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">London: 07-16 UTC | New York: 13-21 UTC</p>
                </div>
              </div>

              <!-- 3. Photo & Media Format -->
              <div class="glass p-4 rounded-xl border border-brand-border space-y-4">
                <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <i data-feather="camera" class="w-4 h-4 text-purple-400"></i>
                  <span>Image & Graphics Style</span>
                </h3>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Attach Graphic / Photo</label>
                  <select id="ruleIncludePhoto" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green">
                    <option value="true">YES — Generate Branded Vector Photo</option>
                    <option value="false">NO — Text Caption Only</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Graphic Style</label>
                  <select id="rulePhotoStyle" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-green">
                    <option value="BRANDED_SIGNAL_CARD">Branded Neon Signal Card (1080x1080)</option>
                    <option value="INFORMATIONAL_ANALYSIS_CARD">Informational Confluence Breakdown Card</option>
                  </select>
                </div>

                <div class="space-y-2 pt-2">
                  <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" id="ruleIncludeAi" checked class="rounded bg-slate-900 border-brand-border text-brand-green focus:ring-0" />
                    <span>Include AI Confluence Rationale</span>
                  </label>

                  <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" id="ruleIncludeDisclaimer" checked class="rounded bg-slate-900 border-brand-border text-brand-green focus:ring-0" />
                    <span>Include Risk Disclaimer & CTA</span>
                  </label>
                </div>
              </div>

            </div>

          </form>
        </div>
      </div>

      <!-- ==================== TAB 4: LIVE MARKET QUOTES ==================== -->
      <div id="tab-market" class="tab-content hidden space-y-6">
        <div class="glass rounded-xl border border-brand-border overflow-hidden">
          <div class="p-4 border-b border-brand-border flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <span>Supported Forex Pairs & Metals (14 Instruments)</span>
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">Real-time geometric brownian walk & institutional spreads</p>
            </div>
            <button onclick="fetchMarketQuotes()" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-brand-border flex items-center gap-1.5 transition">
              <i data-feather="refresh-cw" class="w-3.5 h-3.5"></i>
              <span>Refresh Quotes</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4" id="marketQuotesGrid">
            <!-- Dynamically Populated -->
          </div>
        </div>
      </div>

      <!-- ==================== TAB 5: BACKTESTING LAB ==================== -->
      <div id="tab-backtest" class="tab-content hidden space-y-6">
        <div class="glass p-6 rounded-xl border border-brand-border space-y-6">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <i data-feather="cpu" class="w-5 h-5 text-brand-green"></i>
              <span>Zero Look-Ahead Historical Backtest Simulator</span>
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Simulate quantitative 8-factor confluence rules on historical tick sequences.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Asset Symbol</label>
              <select id="btSymbol" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs">
                <option value="EURUSD">EURUSD</option>
                <option value="XAUUSD">XAUUSD (Gold)</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="GBPJPY">GBPJPY</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Timeframe</label>
              <select id="btTimeframe" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs">
                <option value="15m">15M</option>
                <option value="1h">1H</option>
                <option value="4h">4H</option>
                <option value="5m">5M</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Initial Balance ($)</label>
              <input type="number" id="btBalance" value="10000" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs" />
            </div>

            <div class="flex items-end">
              <button onclick="runBacktestSimulation()" class="w-full py-2.5 px-4 rounded-lg bg-brand-green hover:bg-brand-green/90 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-brand-green/20">
                <i data-feather="play" class="w-4 h-4"></i>
                <span>Run Simulation</span>
              </button>
            </div>
          </div>

          <!-- Backtest Result Card -->
          <div id="btResultCard" class="hidden p-4 rounded-xl bg-slate-900/90 border border-brand-border space-y-4">
            <h3 class="text-xs font-bold uppercase text-brand-green">Simulation Summary</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4" id="btMetricsGrid">
              <!-- Dynamically Populated -->
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== TAB 6: SYSTEM LOGS ==================== -->
      <div id="tab-logs" class="tab-content hidden space-y-6">
        <div class="glass p-6 rounded-xl border border-brand-border space-y-4">
          <div class="flex items-center justify-between border-b border-brand-border pb-3">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <i data-feather="terminal" class="w-5 h-5 text-brand-green"></i>
              <span>Live Console & Event Log</span>
            </h2>
            <button onclick="clearLogs()" class="text-xs text-slate-400 hover:text-white">Clear</button>
          </div>
          <div id="consoleLogs" class="h-80 overflow-y-auto bg-black/60 p-4 rounded-lg font-mono text-xs text-slate-300 space-y-1.5 border border-brand-border">
            <div class="text-brand-green">[System] Admin Command Center loaded.</div>
            <div class="text-slate-400">[Scanner] Continuous MTF scanner operational.</div>
          </div>
        </div>
      </div>

    </main>
  </div>

  <!-- ==================== MODAL: MANUAL SIGNAL GENERATOR ==================== -->
  <div id="generateModal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="glass w-full max-w-lg p-6 rounded-2xl border border-brand-border space-y-4">
      <div class="flex items-center justify-between border-b border-brand-border pb-3">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <i data-feather="zap" class="w-4 h-4 text-brand-green"></i>
          <span>Evaluate & Generate Signal</span>
        </h3>
        <button onclick="closeGenerateModal()" class="text-slate-400 hover:text-white">
          <i data-feather="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Asset Pair</label>
          <select id="genSymbol" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs">
            <option value="EURUSD">EURUSD</option>
            <option value="XAUUSD">XAUUSD (Gold)</option>
            <option value="GBPUSD">GBPUSD</option>
            <option value="USDJPY">USDJPY</option>
            <option value="AUDUSD">AUDUSD</option>
            <option value="USDCAD">USDCAD</option>
            <option value="GBPJPY">GBPJPY</option>
            <option value="XAGUSD">XAGUSD (Silver)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Timeframe</label>
          <select id="genTimeframe" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-brand-border text-white text-xs">
            <option value="15m">15M (Intraday)</option>
            <option value="1h">1H (Structure)</option>
            <option value="4h">4H (Trend)</option>
            <option value="5m">5M (Scalp)</option>
          </select>
        </div>
      </div>

      <button onclick="executeGenerateSignal()" id="btnDoGenerate"
        class="w-full py-2.5 px-4 rounded-lg bg-brand-green hover:bg-brand-green/90 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-brand-green/20">
        <span>Run Quantitative Confluence Engine</span>
      </button>

      <div id="genResultBox" class="hidden p-4 rounded-xl bg-slate-900 border border-brand-border space-y-2 text-xs">
        <!-- Dynamically injected -->
      </div>
    </div>
  </div>

  <!-- ==================== FRONTEND JAVASCRIPT CONTROLLER ==================== -->
  <script>
    let authToken = localStorage.getItem('forex_admin_token') || '';
    let currentSettings = {};

    // Initialize Feather Icons
    document.addEventListener('DOMContentLoaded', () => {
      feather.replace();
      buildUtcHoursCheckboxes();
      checkAuth();
    });

    function checkAuth() {
      if (authToken) {
        document.getElementById('authOverlay').classList.add('hidden');
        document.getElementById('mainDashboard').classList.remove('hidden');
        loadAllData();
      } else {
        document.getElementById('authOverlay').classList.remove('hidden');
        document.getElementById('mainDashboard').classList.add('hidden');
      }
    }

    async function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errBox = document.getElementById('loginError');

      try {
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success && data.data?.accessToken) {
          authToken = data.data.accessToken;
          localStorage.setItem('forex_admin_token', authToken);
          errBox.classList.add('hidden');
          checkAuth();
        } else {
          errBox.textContent = data.error || 'Authentication failed.';
          errBox.classList.remove('hidden');
        }
      } catch (err) {
        errBox.textContent = 'Server connection error.';
        errBox.classList.remove('hidden');
      }
    }

    function quickFillAndLogin() {
      document.getElementById('loginEmail').value = 'admin@alphaquantfx.io';
      document.getElementById('loginPassword').value = 'AdminSecurePassword123!';
      document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }

    function handleLogout() {
      authToken = '';
      localStorage.removeItem('forex_admin_token');
      checkAuth();
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-brand-green', 'bg-brand-green/10', 'border', 'border-brand-green/30');
        btn.classList.add('text-slate-400');
      });

      const targetTab = document.getElementById('tab-' + tabId);
      const targetBtn = document.getElementById('tabBtn-' + tabId);
      if (targetTab) targetTab.classList.remove('hidden');
      if (targetBtn) {
        targetBtn.classList.remove('text-slate-400');
        targetBtn.classList.add('text-brand-green', 'bg-brand-green/10', 'border', 'border-brand-green/30');
      }
      feather.replace();
    }

    function buildUtcHoursCheckboxes() {
      const container = document.getElementById('utcHoursContainer');
      container.innerHTML = '';
      for (let h = 0; h < 24; h++) {
        const formatted = (h < 10 ? '0' : '') + h + ':00';
        const isDefault = [7, 8, 9, 12, 13, 14, 15, 16].includes(h);
        container.innerHTML += \`
          <label class="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" name="utcHour" value="\${h}" \${isDefault ? 'checked' : ''} class="rounded bg-slate-800 border-brand-border text-brand-green focus:ring-0">
            <span>\${formatted}</span>
          </label>
        \`;
      }
    }

    async function loadAllData() {
      await Promise.all([
        fetchSettings(),
        fetchSignals(),
        fetchMarketQuotes(),
        fetchStats()
      ]);
    }

    // ==================== SETTINGS & ENV ====================
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings', {
          headers: { 'Authorization': 'Bearer ' + authToken }
        });
        const data = await res.json();
        if (data.success && data.data) {
          currentSettings = data.data;
          populateSettingsForm(data.data);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }

    function populateSettingsForm(s) {
      document.getElementById('cfgTelegramBotToken').value = s.telegramBotToken || '';
      document.getElementById('cfgTelegramChannelId').value = s.telegramChannelId || '';
      document.getElementById('cfgTelegramGroupId').value = s.telegramGroupId || '';
      document.getElementById('cfgOpenaiApiKey').value = s.openaiApiKey || '';
      document.getElementById('cfgOpenaiModel').value = s.openaiModel || 'gpt-4o-mini';
      document.getElementById('cfgOpenaiBudget').value = s.openaiMaxDailyBudget || 5;
      document.getElementById('cfgMarketProvider').value = s.marketDataProvider || 'DEMO';
      document.getElementById('cfgDemoMode').value = s.demoMode ? 'true' : 'false';
      document.getElementById('cfgMarketApiKey').value = s.marketDataApiKey || '';
      document.getElementById('cfgBrandName').value = s.brandName || 'ALPHA QUANT FX';
      document.getElementById('cfgBrandWebsite').value = s.brandWebsite || 'https://alphaquantfx.io';
      document.getElementById('cfgBrandTelegram').value = s.brandTelegram || '@AlphaQuantFX';

      // Rules Tab
      document.getElementById('ruleAutoPosting').value = s.autoPostingEnabled ? 'true' : 'false';
      document.getElementById('ruleMaxDailyPosts').value = s.maxDailyPosts || 8;
      document.getElementById('ruleMinScore').value = s.minScoreToPost || 70;
      document.getElementById('ruleScheduleType').value = s.postScheduleType || 'ON_SIGNAL';
      document.getElementById('ruleIncludePhoto').value = s.includePhoto ? 'true' : 'false';
      document.getElementById('rulePhotoStyle').value = s.photoStyle || 'BRANDED_SIGNAL_CARD';
      document.getElementById('ruleIncludeAi').checked = s.includeAiExplanation !== false;
      document.getElementById('ruleIncludeDisclaimer').checked = s.includeRiskDisclaimer !== false;

      // Checkboxes
      const hours = s.scheduledHoursUtc || [7, 8, 9, 12, 13, 14, 15, 16];
      document.querySelectorAll('input[name="utcHour"]').forEach(cb => {
        cb.checked = hours.includes(parseInt(cb.value, 10));
      });

      // Update Header & Stats
      document.getElementById('statTargetChannel').textContent = s.telegramChannelId || '@AlphaQuantFX';
      document.getElementById('headerAutoPost').textContent = s.autoPostingEnabled ? 'ACTIVE' : 'PAUSED';
      document.getElementById('headerAutoPost').className = s.autoPostingEnabled ? 'text-purple-400 font-semibold' : 'text-slate-500 font-semibold';
      document.getElementById('statDailyPosts').textContent = (s.postsSentToday || 0) + ' / ' + (s.maxDailyPosts || 8);
    }

    async function saveEnvironmentSettings() {
      const payload = {
        telegramBotToken: document.getElementById('cfgTelegramBotToken').value.trim(),
        telegramChannelId: document.getElementById('cfgTelegramChannelId').value.trim(),
        telegramGroupId: document.getElementById('cfgTelegramGroupId').value.trim(),
        openaiApiKey: document.getElementById('cfgOpenaiApiKey').value.trim(),
        openaiModel: document.getElementById('cfgOpenaiModel').value,
        openaiMaxDailyBudget: parseFloat(document.getElementById('cfgOpenaiBudget').value) || 5,
        marketDataProvider: document.getElementById('cfgMarketProvider').value,
        demoMode: document.getElementById('cfgDemoMode').value === 'true',
        marketDataApiKey: document.getElementById('cfgMarketApiKey').value.trim(),
        brandName: document.getElementById('cfgBrandName').value.trim(),
        brandWebsite: document.getElementById('cfgBrandWebsite').value.trim(),
        brandTelegram: document.getElementById('cfgBrandTelegram').value.trim()
      };

      try {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('✅ Environment settings saved successfully and applied live!');
          fetchSettings();
        } else {
          alert('❌ Failed to save: ' + data.error);
        }
      } catch (err) {
        alert('Server error saving settings.');
      }
    }

    async function savePostingRules() {
      const selectedHours = Array.from(document.querySelectorAll('input[name="utcHour"]:checked')).map(cb => parseInt(cb.value, 10));
      const payload = {
        autoPostingEnabled: document.getElementById('ruleAutoPosting').value === 'true',
        maxDailyPosts: parseInt(document.getElementById('ruleMaxDailyPosts').value, 10) || 8,
        minScoreToPost: parseInt(document.getElementById('ruleMinScore').value, 10) || 70,
        postScheduleType: document.getElementById('ruleScheduleType').value,
        scheduledHoursUtc: selectedHours,
        includePhoto: document.getElementById('ruleIncludePhoto').value === 'true',
        photoStyle: document.getElementById('rulePhotoStyle').value,
        includeAiExplanation: document.getElementById('ruleIncludeAi').checked,
        includeRiskDisclaimer: document.getElementById('ruleIncludeDisclaimer').checked
      };

      try {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('✅ Posting and media rules saved successfully!');
          fetchSettings();
        }
      } catch (err) {
        alert('Server error saving posting rules.');
      }
    }

    async function testTelegramConnection() {
      try {
        const res = await fetch('/api/telegram/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
          }
        });
        const data = await res.json();
        if (data.success) {
          alert('🎉 ' + data.message);
        } else {
          alert('⚠️ Telegram test failed: ' + data.error);
        }
      } catch (err) {
        alert('Could not reach backend test endpoint.');
      }
    }

    // ==================== SIGNALS ====================
    async function fetchSignals() {
      try {
        const res = await fetch('/signals');
        const data = await res.json();
        if (data.success && data.data) {
          renderSignalsTable(data.data);
          document.getElementById('statTotalSignals').textContent = data.data.length;
        }
      } catch (err) {
        console.error('Failed to load signals:', err);
      }
    }

    function renderSignalsTable(signals) {
      const tbody = document.getElementById('signalsTableBody');
      tbody.innerHTML = '';
      if (signals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="p-6 text-center text-slate-500">No signals generated yet. Click "New Signal" above to evaluate one.</td></tr>';
        return;
      }

      signals.forEach(s => {
        const isBuy = s.direction === 'BUY';
        const isSell = s.direction === 'SELL';
        const dirBadge = isBuy
          ? '<span class="px-2 py-0.5 rounded bg-brand-green/20 text-brand-green font-bold">BUY</span>'
          : isSell
          ? '<span class="px-2 py-0.5 rounded bg-brand-red/20 text-brand-red font-bold">SELL</span>'
          : '<span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">WAIT</span>';

        const scoreColor = s.score >= 70 ? 'text-brand-green' : s.score >= 50 ? 'text-yellow-400' : 'text-slate-400';

        tbody.innerHTML += \`
          <tr class="hover:bg-slate-900/50 transition">
            <td class="p-3.5 font-bold text-white">
              <div class="flex items-center gap-1.5">
                <span>\${s.symbol}</span>
                <span class="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded uppercase">\${s.timeframe || '15m'}</span>
              </div>
            </td>
            <td class="p-3.5">\${dirBadge}</td>
            <td class="p-3.5 font-bold \${scoreColor}">\${s.score}/100</td>
            <td class="p-3.5 font-mono text-slate-200">\${s.entryPrice || '-'}</td>
            <td class="p-3.5 font-mono text-brand-red">\${s.stopLoss || '-'}</td>
            <td class="p-3.5 font-mono text-brand-green">\${s.takeProfit1 || '-'}</td>
            <td class="p-3.5 font-mono text-brand-green">\${s.takeProfit2 || '-'}</td>
            <td class="p-3.5">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">\${s.status || 'ACTIVE'}</span>
            </td>
            <td class="p-3.5 text-right space-x-1">
              <button onclick="publishSignalToTelegram('\${s.id}')" title="Broadcast to Telegram with Image"
                class="px-2.5 py-1 rounded bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 font-bold text-[11px] border border-purple-500/30 transition">
                📢 Dispatch Post
              </button>
            </td>
          </tr>
        \`;
      });
      feather.replace();
    }

    async function publishSignalToTelegram(signalId) {
      if (!confirm('Broadcast this signal with high-res branded graphic to Telegram?')) return;
      try {
        const res = await fetch(\`/signals/\${signalId}/publish\`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + authToken }
        });
        const data = await res.json();
        if (data.success) {
          alert('🚀 ' + (data.message || 'Signal published to Telegram!'));
          fetchSignals();
          fetchSettings();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (err) {
        alert('Server error dispatching signal.');
      }
    }

    function openGenerateModal() {
      document.getElementById('generateModal').classList.remove('hidden');
      document.getElementById('genResultBox').classList.add('hidden');
      feather.replace();
    }

    function closeGenerateModal() {
      document.getElementById('generateModal').classList.add('hidden');
    }

    async function executeGenerateSignal() {
      const symbol = document.getElementById('genSymbol').value;
      const timeframe = document.getElementById('genTimeframe').value;
      const btn = document.getElementById('btnDoGenerate');
      btn.innerHTML = '<span>Evaluating Multi-Timeframes...</span>';

      try {
        const res = await fetch('/signals/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol, timeframe })
        });
        const data = await res.json();
        btn.innerHTML = '<span>Run Quantitative Confluence Engine</span>';

        if (data.success && data.data) {
          const s = data.data;
          const box = document.getElementById('genResultBox');
          box.innerHTML = \`
            <div class="flex items-center justify-between">
              <span class="font-bold text-white">\${s.symbol} (\${s.timeframe})</span>
              <span class="font-extrabold text-sm \${s.direction === 'BUY' ? 'text-brand-green' : s.direction === 'SELL' ? 'text-brand-red' : 'text-slate-400'}">\${s.direction}</span>
            </div>
            <div class="text-slate-300">Confluence Score: <b>\${s.score}/100</b> (\${s.scoreCategory})</div>
            <div class="grid grid-cols-3 gap-2 py-1 font-mono text-[11px]">
              <div>Entry: <b>\${s.entryPrice}</b></div>
              <div>SL: <b class="text-brand-red">\${s.stopLoss}</b></div>
              <div>TP1: <b class="text-brand-green">\${s.takeProfit1}</b></div>
            </div>
            <p class="text-slate-400 text-[11px]">\${s.reason || ''}</p>
          \`;
          box.classList.remove('hidden');
          fetchSignals();
        }
      } catch (err) {
        btn.innerHTML = '<span>Run Quantitative Confluence Engine</span>';
        alert('Error evaluating signal.');
      }
    }

    // ==================== MARKET QUOTES ====================
    async function fetchMarketQuotes() {
      try {
        const res = await fetch('/market');
        const data = await res.json();
        if (data.success && data.data) {
          const grid = document.getElementById('marketQuotesGrid');
          grid.innerHTML = '';
          data.data.forEach(p => {
            const isMetal = p.category === 'METALS';
            grid.innerHTML += \`
              <div class="glass p-3.5 rounded-xl border border-brand-border space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-white text-sm">\${p.symbol}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded font-bold \${isMetal ? 'bg-yellow-500/20 text-yellow-400' : 'bg-brand-blue/20 text-brand-blue'}">\${p.category}</span>
                </div>
                <div class="flex items-center justify-between text-xs font-mono">
                  <div>
                    <span class="text-slate-400 text-[10px]">BID</span>
                    <div class="text-white font-semibold">\${p.bid}</div>
                  </div>
                  <div class="text-right">
                    <span class="text-slate-400 text-[10px]">ASK</span>
                    <div class="text-slate-300 font-semibold">\${p.ask}</div>
                  </div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-400 border-t border-brand-border pt-1.5">
                  <span>Spread: <b class="text-slate-200">\${p.spread} pips</b></span>
                  <span class="text-brand-green">● \${p.status}</span>
                </div>
              </div>
            \`;
          });
        }
      } catch (err) {
        console.error('Failed to load quotes:', err);
      }
    }

    async function fetchStats() {
      try {
        const res = await fetch('/signals/stats');
        const data = await res.json();
        if (data.success && data.data) {
          document.getElementById('statWinRate').textContent = data.data.winRate + '%';
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    }

    // ==================== BACKTEST SIMULATION ====================
    async function runBacktestSimulation() {
      const symbol = document.getElementById('btSymbol').value;
      const timeframe = document.getElementById('btTimeframe').value;
      const balance = parseFloat(document.getElementById('btBalance').value) || 10000;

      try {
        const res = await fetch('/backtest/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol, timeframe, initialBalance: balance, candleCount: 200 })
        });
        const data = await res.json();
        if (data.success && data.data?.summary) {
          const sum = data.data.summary;
          const card = document.getElementById('btResultCard');
          const grid = document.getElementById('btMetricsGrid');
          grid.innerHTML = \`
            <div><span class="text-slate-400">Total Trades:</span> <b class="text-white">\${sum.totalTrades}</b></div>
            <div><span class="text-slate-400">Win Rate:</span> <b class="text-brand-green">\${sum.winRate}%</b></div>
            <div><span class="text-slate-400">Profit Factor:</span> <b class="text-brand-blue">\${sum.profitFactor}</b></div>
            <div><span class="text-slate-400">Ending Balance:</span> <b class="text-brand-green">$\${sum.endingBalance}</b></div>
          \`;
          card.classList.remove('hidden');
        }
      } catch (err) {
        alert('Backtest simulation failed.');
      }
    }

    function togglePasswordVisibility(id) {
      const el = document.getElementById(id);
      el.type = el.type === 'password' ? 'text' : 'password';
    }

    function clearLogs() {
      document.getElementById('consoleLogs').innerHTML = '<div class="text-slate-500">Logs cleared.</div>';
    }
  </script>
</body>
</html>`;
}
