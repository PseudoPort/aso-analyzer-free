# ASO Analyzer Free - Frontend

Beautiful, responsive web interface for the ASO Analyzer Free project built with React, Vite, and Tailwind CSS.

## Features

- Beautiful UI/UX - Modern, clean design with smooth animations
- Mobile Responsive - Optimized for all device sizes
- Fast Performance - Built with Vite for lightning-fast development and builds
- AI Provider Selection - Choose between Gemini and Claude AI providers
- Interactive Charts - Visualize keyword performance with Recharts
- Smooth Animations - Enhanced user experience with Framer Motion
- Netlify Ready - Optimized for Netlify deployment

## Tech Stack

- **React 19** - Modern React with latest features
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful & consistent icons
- **Axios** - Promise-based HTTP client

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to Netlify

## Deployment

### Netlify Deployment

1. **Automatic Deployment** (Recommended):
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy automatically on push

2. **Manual Deployment**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

## License

This project is open source and available under the MIT License.