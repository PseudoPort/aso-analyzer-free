# ASO Analyzer Free - App Store Optimization Tools

**Now with Beautiful Web GUI!** - Complete with React frontend and API backend

Original repository forked from: https://github.com/nicolaischneider/app-store-kw-rv-eng

## Features

### Web Interface (NEW!)
- Beautiful, responsive React-based GUI
- Mobile-optimized design with smooth animations
- Real-time analysis progress indicators
- Interactive charts and data visualization
- AI provider selection (Gemini/Claude)
- Export functionality for results

### Core Analysis Tools
1. **App Store Data Scraping**: Fetches app information (title, description, screenshots) from the App Store using an app ID
2. **Similar Apps Discovery**: Retrieves data for the top 3 similar apps to expand keyword research
3. **AI-Powered Keyword Generation**: Uses configurable AI providers (Gemini or Claude) to analyze app screenshots and metadata
4. **ASO Analysis**: Evaluates keywords using ASO metrics (traffic and difficulty scores)

## Quick Start

### Web Interface (Recommended)

1. **Start the development environment**:
   ```bash
   npm install
   npm run dev
   ```
   This starts both the API server and frontend development server.

2. **Open your browser** and visit `http://localhost:5173`

3. **Set up your API keys** (copy `.env.example` to `.env`):
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

### Command Line Interface

```bash
# Use default provider (Gemini)
node main.js 1294015297

# Use specific AI provider
node main.js 1294015297 --ai-provider claude
node main.js 1294015297 -p gemini

# Show help
node main.js --help
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

### Getting API Keys

#### For Gemini (Default Provider)
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new project or select an existing one
4. Generate an API key
5. Copy the key to your `.env` file

#### For Claude (Alternative Provider)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or sign in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

## Usage

### Web Interface

1. **App Analyzer Tab**:
   - Enter an App Store ID (numeric ID from app URL)
   - Select your preferred AI provider
   - Click "Analyze App" to start the process
   - View comprehensive results with charts and tables
   - Export results as JSON

2. **Keywords Analyzer Tab**:
   - Add multiple keywords for analysis
   - View traffic vs difficulty scatter plots
   - Get recommendations for each keyword
   - Export results as CSV

### Command Line

```bash
# Basic usage with default provider (Gemini)
node main.js <app_id>

# With specific AI provider
node main.js <app_id> --ai-provider <provider>

# Examples
node main.js 1294015297                    # Use default provider (Gemini)
node main.js 1294015297 --ai-provider claude   # Use Claude
node main.js 1294015297 -p gemini              # Use Gemini explicitly

# Running demo
npm run demo
```

Where `1294015297` is the App Store track ID (the numeric ID found in App Store URLs).

### Command Line Options
- `--ai-provider, -p`: Choose AI provider (`gemini` or `claude`)
- `--help, -h`: Show help information

## Technologies Used

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful & consistent icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **[app-store-scraper](https://github.com/facundoolano/app-store-scraper)** - For scraping App Store data
- **[ASO-V2](https://github.com/bambolee-digital/aso-v2)** - For analyzing keyword traffic and difficulty metrics
- **[Google Gemini 2.5 Pro](https://ai.google.dev/)** - Default AI provider for keyword generation
- **[Claude Sonnet 4](https://www.anthropic.com/)** - Alternative AI provider for keyword generation

## Project Structure

```
aso-analyzer-free/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API integration
│   │   └── ...
│   ├── dist/                  # Built frontend (after npm run build)
│   └── package.json
├── services/                  # Backend services
│   ├── ai-providers/         # AI provider implementations
│   ├── app-store-scraper.js  # App Store data extraction
│   ├── keyword-generator.js  # AI keyword generation
│   └── aso-analyzer.js       # ASO metrics analysis
├── tools/                    # Function calling schemas
├── main.js                   # CLI interface
├── api-server.js            # Express API server
└── package.json             # Backend dependencies
```

## Deployment

### Frontend (Netlify)
- Automatic deployment from GitHub
- Build command: `npm run build`
- Publish directory: `frontend/dist`

### Backend (Railway/Heroku)
- Deploy the API server
- Set environment variables for AI providers
- Configure CORS for frontend domain

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Output

The application provides:
- **Web Interface**: Interactive dashboard with real-time analysis
- **App Data**: Comprehensive app information and similar apps
- **AI-Generated Keywords**: Smart keyword extraction from app content
- **ASO Analysis**: Traffic and difficulty scores with recommendations
- **Visual Charts**: Interactive data visualization
- **Export Options**: JSON and CSV export functionality

## Architecture

The project uses a modular architecture with:
- **Service Layer Pattern**: Modular business logic separation
- **Factory Pattern**: AI provider creation and management
- **Strategy Pattern**: Interchangeable AI implementations
- **API Layer**: RESTful API for frontend-backend communication

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## Cost Considerations

**AI Provider Costs**: 
- **Gemini 2.5 Pro** (Default): More cost-effective option with competitive performance
- **Claude Sonnet 4** (Alternative): Higher cost but potentially better quality for complex analysis

The tool now defaults to Gemini for better cost efficiency while maintaining the option to use Claude when needed.

## Development

### Available Scripts

**Root Project**:
- `npm run dev` - Start both API and frontend in development mode
- `npm run api` - Start only the API server
- `npm run build` - Build the frontend for production
- `npm start` - Run CLI interface

**Frontend Only**:
- `cd frontend && npm run dev` - Start frontend development server
- `cd frontend && npm run build` - Build for production
- `cd frontend && npm run preview` - Preview production build

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/providers` - Get available AI providers
- `POST /api/analyze-app` - Analyze app by ID
- `POST /api/analyze-keywords` - Analyze multiple keywords

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (both CLI and web interface)
5. Update documentation if needed
6. Submit a pull request

## Important Notes

### This is a Proof of Concept

This tool serves as a proof of concept for automated App Store keyword research. The web interface makes it even more accessible for non-technical users!

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- **GitHub Issues**: [Create an issue](https://github.com/PseudoPort/aso-analyzer-free/issues)
- **Documentation**: See ARCHITECTURE.md and DEPLOYMENT.md
- **Web Interface**: Built-in help and tooltips

---

**Ready to optimize your app store presence?** 
- 🌐 **Use the Web Interface**: `npm run dev` then visit `http://localhost:5173`
- 💻 **Use the CLI**: `node main.js --help`
- 🚀 **Deploy to Production**: See [DEPLOYMENT.md](DEPLOYMENT.md)