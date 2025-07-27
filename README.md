# ArXiv Paper Collector - Frontend

A modern React frontend for exploring academic papers and author collaboration networks. This application connects to a Django REST API backend that collects and analyzes papers from arXiv, PubMed, and Semantic Scholar.

## 🌟 Features

- **Interactive Dashboard** - Overview of collected papers, authors, and collaborations
- **Network Visualization** - Interactive graphs showing author collaborations and paper citations
- **Collection Management** - Start new paper collections by author names or keywords
- **Papers Explorer** - Search, filter, and browse collected research papers
- **Authors Directory** - Discover researchers and their collaboration networks
- **Real-time Progress** - Live tracking of collection tasks
- **Export Functionality** - Download data in CSV, JSON, or BibTeX formats

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for API state management
- **React Force Graph** for network visualization
- **Vite** for development and building
- **Axios** for HTTP requests

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### API Connection

The frontend connects to a live Django API at:
```
https://arxiv-paper-collector-488677975213.us-central1.run.app
```

No additional backend setup is required - the API is already running and CORS-enabled.

## 📱 Usage

### 1. Dashboard
- View overall statistics (papers, authors, collaborations)
- See recent activity and top collaborations
- Quick access to all features

### 2. Start a Collection
- Go to Collections page
- Click "New Collection"
- Choose to collect by:
  - **Author names**: Enter comma-separated author names
  - **Keywords**: Enter research keywords/topics
- Set maximum papers limit
- Track progress in real-time

### 3. Explore Network Visualization
- View interactive author collaboration graphs
- Filter by collection, collaboration strength
- Click nodes to see author details
- Export network data for external analysis

### 4. Browse Papers & Authors
- Search and filter papers by title, abstract, keywords
- Sort by date, citations, relevance
- View author profiles with statistics
- Export data in multiple formats

## 🎨 Key Components

### Dashboard (`/`)
- Real-time stats cards
- Recent papers and authors
- Top collaborations overview

### Network Visualization (`/network`)
- Interactive force-directed graphs
- Author collaboration networks
- Paper citation relationships
- Filtering and export tools

### Collections (`/collections`)
- Collection management interface
- Real-time task progress tracking
- Form for starting new collections

### Papers Explorer (`/papers`)
- Searchable papers table
- Advanced filtering options
- Export functionality

### Authors Directory (`/authors`)
- Author profile cards
- Statistics and metrics
- Search and sorting

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app layout
│   └── AppRoutes.tsx   # Route definitions
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── NetworkPage.tsx
│   ├── CollectionsPage.tsx
│   ├── PapersPage.tsx
│   └── AuthorsPage.tsx
├── lib/                # Utilities and API client
│   └── api.ts         # API client with all endpoints
├── types/              # TypeScript type definitions
│   └── api.ts         # API response types
└── index.css          # Global styles and Tailwind setup
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### API Integration

The API client (`src/lib/api.ts`) provides methods for:

- `getStats()` - Dashboard statistics
- `getPapers()` - Fetch papers with filtering
- `getAuthors()` - Fetch authors with search
- `getCollections()` - Fetch collections
- `collectByAuthors()` - Start author-based collection
- `collectByKeywords()` - Start keyword-based collection
- `getNetworkAnalysis()` - Get collaboration network data
- `exportPapers()` - Export papers data
- `exportNetwork()` - Export network data

## 🎯 Features in Detail

### Real-time Collection Tracking
The app polls the `/api/tasks/` endpoint every 5 seconds to show:
- Current collection progress
- Items being processed
- Completion status
- Error handling

### Network Visualization
Built with React Force Graph:
- Nodes represent authors (blue) or papers (green)
- Links show collaborations or citations
- Interactive zoom, pan, and click
- Custom node rendering with labels
- Filtering by collection and metrics

### Error Handling
- Graceful API error states
- Loading skeletons
- Connection retry logic
- User-friendly error messages

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite and configure build settings
3. Environment variables are automatically handled
4. Deploy with zero configuration

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist/` folder to Netlify
3. Configure redirects for SPA routing

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 🌐 API Documentation

### Base URL
```
https://arxiv-paper-collector-488677975213.us-central1.run.app
```

### Key Endpoints
- `GET /api/` - API information
- `GET /api/stats/` - Dashboard statistics
- `GET /api/papers/` - List papers (with filtering)
- `GET /api/authors/` - List authors (with search)
- `GET /api/collections/` - List collections
- `POST /api/collect/authors/` - Start collection by authors
- `POST /api/collect/keywords/` - Start collection by keywords
- `GET /api/network/analysis/` - Get network data
- `POST /api/export/papers/` - Export papers
- `POST /api/export/network/` - Export network

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with the powerful Django REST API backend
- Network visualization powered by React Force Graph
- UI design inspired by modern research tools
- Icons by Lucide React
