# Antigravity OS 🌐💻

Welcome to **Antigravity OS**, a test development of a modern, feature-rich web-based operating system. Built on **React** and **Vite**, Antigravity OS delivers a premium desktop-like environment directly inside the browser with a clean dark-mode aesthetic, glassmorphic UI elements, and smooth micro-animations.

---

## 🚀 Features

### 🖥️ Desktop & Window Management
- **Animated Boot Screen:** A clean loader initializing the system environment.
- **Dynamic Desktop Layout:** Responsive workspace containing application shortcuts and custom wallpapers.
- **Advanced Window Manager:** A custom hook handling window creation, focus priority, dragging, resizing, minimization, maximization, and snapping.
- **Glassmorphic Taskbar & Start Menu:** Displays open processes, system info, and supports context menus for fast window control (minimize, maximize, close).
- **Responsive Context Menus:** Right-click controls on the desktop and taskbar items for direct interactions.

### 📦 Pre-installed Applications
1. **🌐 Web Browser:**
   - Simulated web browsing.
   - Built-in engine toggling (Standard Engine, Stealth Node, and Ultra Unblocker).
   - Search engine presets (Google, DuckDuckGo, Bing, Brave).
   - Service worker-assisted proxy integrations.
2. **🛡️ S-Tunnel Client:**
   - A secure network tunneling console.
   - Selectable proxy nodes with real-time ping simulation and load metrics.
   - Custom STunnel / Shadowsocks configuration inputs (Server, Credentials, SNI).
3. **📟 Interactive Terminal:**
   - Commands support: `help`, `ls`, `clear`, `neofetch`, `whoami`, `date`, `tunnel`.
   - Rich output formatting.
4. **📁 File Explorer:**
   - Sidebar navigations (`Documents`, `Downloads`, `Pictures`, `Music`, `Videos`).
   - Mock filesystem visualizer.
5. **⚙️ Settings:**
   - Customize OS wallpaper theme instantly.
   - View system versions and build details.
6. **ℹ️ About OS:**
   - Learn more about the operating system.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Icons:** Lucide React
- **Styling:** Vanilla CSS (Tailored HSL variables, glassmorphism, responsive grids)
- **Service Workers:** Advanced request interception / tunneling simulations

---

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/omega-u20/web-os.git
   cd web-os
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

