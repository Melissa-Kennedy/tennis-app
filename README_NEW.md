# Tennis Map Toronto

An interactive map application displaying public tennis courts across Toronto with detailed information including winter play availability, court lighting, and number of courts.

## Features

- 🗺️ Interactive map with 108+ Toronto tennis court locations
- 📍 Clickable pins with detailed court information
- 🏸 Filter by winter play availability and court lighting
- 📱 Responsive design for mobile and desktop
- 🔍 Searchable sidebar with court listings

## Data

The application displays real-time data for Toronto's public tennis courts, including:
- **Location**: Park name and address
- **Winter Play**: Availability during winter months
- **Lights**: Court lighting availability
- **Courts**: Number of courts at each location

Data is scraped from Toronto's official parks and recreation API.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Maps**: Leaflet with React-Leaflet
- **Routing**: React Router v7
- **Styling**: CSS3 with responsive design
- **Build**: Create React App
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tennis-map

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in browser.

### Building for Production

```bash
# Create production build
npm run build

# Test production build locally
npx serve -s build -l 3001
```

## Data Updates

To update tennis court data:

```bash
# Run the scraper (requires Python)
python3 toronto_tennis_scraper.py
```

This will fetch the latest court information from Toronto's API.

## Deployment

The app is configured for easy deployment to Vercel:

```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod
```

## Project Structure

```
src/
├── components/
│   ├── Map/MapContainer.tsx     # Main map component
│   ├── AddressList/            # Sidebar court listings  
│   └── InfoPage/               # Detailed court info pages
├── data/addresses.json         # Tennis court data
├── types/Address.ts           # TypeScript interfaces
└── App.tsx                    # Main app component
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner in interactive watch mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details