# 🎡 Lucky Wheel

A beautiful, customizable, and free random name picker wheel. Perfect for raffles, classroom activities, decision making, and games. Features realistic physics, sound effects, and a stunning glass morphism UI.

![Lucky Wheel Banner](https://img.shields.io/badge/Lucky-Wheel-ff00de?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## ✨ Features

- 🎯 **Interactive Spinning Wheel** - Realistic physics simulation for smooth, engaging spins
- 🌐 **Multi-Language Support** - Thai and English language options
- 🎨 **12 Beautiful Themes** - Choose from a variety of gradient backgrounds
- ⚙️ **Fully Customizable**
  - Custom wheel name
  - Adjustable spin duration (1-15 seconds)
  - Variable spin speed (10-100%)
- 👥 **Participant Management**
  - Add/remove participants easily
  - Toggle participants active/inactive
  - Shuffle participants randomly
- 🏆 **Winner Modal** - Celebrate winners with an animated modal
- 💾 **Persistent Settings** - All settings saved to localStorage
- 🎭 **Glass Morphism UI** - Modern, elegant design with frosted glass effects
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Demo

Visit the live demo: [Your Demo URL]

## 📸 Screenshots

[Add screenshots here]

## 🛠️ Tech Stack

- **Vite** - Lightning-fast build tool and dev server
- **Vanilla JavaScript** - No framework dependencies
- **HTML5 Canvas** - For smooth wheel rendering
- **CSS3** - Modern styling with glass morphism effects
- **LocalStorage API** - For persistent settings

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lucky-wheel.git
cd lucky-wheel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 Usage

### Adding Participants

1. Click the **Settings** button (⚙️) in the top-left corner
2. Enter a name in the input field
3. Click **Add** or press Enter
4. Repeat to add more participants

### Spinning the Wheel

1. Ensure you have at least one active participant
2. Click the **SPIN** button in the center of the wheel
3. Wait for the wheel to stop
4. View the winner in the popup modal
5. Choose to keep or remove the winner from the list

### Customization

Access the Settings modal to customize:

- **Wheel Name** - Give your wheel a custom title
- **Spin Duration** - Set how long the wheel spins (1-15 seconds)
- **Spin Speed** - Adjust the initial spin velocity (10-100%)
- **Background Theme** - Choose from 12 beautiful gradient themes

### Language Toggle

Click the **TH / EN** button in the top-right corner to switch between Thai and English.

### Shuffle Participants

Click the **Shuffle** button (🔀) to randomly reorder all participants.

## 📁 Project Structure

```
lucky-wheel/
├── dist/              # Production build output
├── public/            # Static assets
├── src/
│   ├── main.js        # Application entry point
│   ├── wheel.js       # Wheel rendering and physics
│   ├── state.js       # State management
│   ├── i18n.js        # Internationalization
│   └── style.css      # Styles and themes
├── index.html         # HTML template
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## 🎨 Available Themes

- Default (Purple/Orange)
- Red
- Orange
- Yellow
- Green
- Teal
- Cyan
- Blue
- Indigo
- Purple
- Pink
- Rose

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Building for Production

```bash
npm run build
```

The optimized production files will be generated in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by various spinning wheel implementations
- Built with modern web technologies
- Designed with love for the community

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ by Alpaka Lab

⭐ Star this repo if you find it useful!
