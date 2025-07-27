import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { mockNetworkData, mockCollections } from '../lib/mockData';
import { 
  Filter,
  Download,
  BarChart3,
  Users,
  Network,
  Zap,
  Target,
  Eye,
  WifiOff,
  Wifi
} from 'lucide-react';
import type { NetworkNode } from '../types/api';

export function NetworkPage() {
  const [selectedCollection, setSelectedCollection] = useState('');
  const [minCollaborations, setMinCollaborations] = useState(1);
  const [includeCitations, setIncludeCitations] = useState(false);
  const [selectedNode] = useState<NetworkNode | null>(null);

  const { data: networkData, isLoading: networkLoading, error: networkError } = useQuery({
    queryKey: ['network-analysis', selectedCollection, minCollaborations, includeCitations],
    queryFn: () => apiClient.getNetworkAnalysis({
      collection_id: selectedCollection,
      min_collaborations: minCollaborations,
      include_citations: includeCitations
    }),
    retry: 1,
  });

  const { data: collections, isLoading: collectionsLoading, error: collectionsError } = useQuery({
    queryKey: ['collections'],
    queryFn: () => apiClient.getCollections({ limit: 100 }),
    retry: 1,
  });

  // Use mock data if API fails
  const displayNetworkData = networkData || (networkError ? mockNetworkData : null);
  const displayCollections = collections?.results || (collectionsError ? mockCollections : []);
  const isUsingMockData = (!networkData && networkError) || (!collections && collectionsError);

  const handleExport = () => {
    if (displayNetworkData) {
      const dataStr = JSON.stringify(displayNetworkData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'network-analysis.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (networkLoading || collectionsLoading) {
    return (
      <div className="p-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <div className="skeleton h-8 w-64"></div>
            <div className="skeleton h-5 w-96"></div>
          </div>
          
          {/* Controls Skeleton */}
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="skeleton h-4 w-24"></div>
                  <div className="skeleton h-10 w-full"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Network Graph Skeleton */}
          <div className="card">
            <div className="skeleton h-96 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Demo Mode Banner */}
      {isUsingMockData && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-soft">
            <WifiOff className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800">Demo Mode</h3>
            <p className="text-sm text-amber-700">
              API is not available, showing sample network data to demonstrate the interface.
            </p>
          </div>
          <div className="flex items-center text-xs text-amber-600">
            <Wifi className="h-4 w-4 mr-1" />
            Mock Data
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Network className="h-8 w-8 text-primary-500 mr-3" />
            Network Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Explore author collaborations and research connections through interactive network visualization.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            className="btn-secondary flex items-center"
            disabled={!displayNetworkData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="btn-primary flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Analyze
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-4 shadow-soft">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Network Controls</h2>
            <p className="text-sm text-gray-500">Configure network visualization parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection Filter
            </label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="select-field"
            >
              <option value="">All Collections</option>
              {displayCollections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Collaborations
            </label>
            <input
              type="number"
              min="1"
              value={minCollaborations}
              onChange={(e) => setMinCollaborations(parseInt(e.target.value) || 1)}
              className="input-field"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeCitations"
              checked={includeCitations}
              onChange={(e) => setIncludeCitations(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="includeCitations" className="ml-3 text-sm font-medium text-gray-700">
              Include citation links
            </label>
          </div>
        </div>
      </div>

      {/* Network Stats */}
      {displayNetworkData?.metadata && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="stat-value">{displayNetworkData.metadata.total_nodes}</div>
            <div className="stat-label">Nodes</div>
          </div>

          <div className="stat-card">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Network className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="stat-value">{displayNetworkData.metadata.total_links}</div>
            <div className="stat-label">Connections</div>
          </div>

          <div className="stat-card">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="stat-value">{displayNetworkData.metadata.total_clusters}</div>
            <div className="stat-label">Clusters</div>
          </div>

          <div className="stat-card">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mx-auto mb-4 shadow-soft">
              <BarChart3 className="h-6 w-6 text-amber-600" />
            </div>
            <div className="stat-value">{(displayNetworkData.metadata.network_density * 100).toFixed(1)}%</div>
            <div className="stat-label">Density</div>
          </div>
        </div>
      )}

      {/* Network Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="card p-0 overflow-hidden">
            <div className="network-container h-96">
              {/* Placeholder for Network Visualization */}
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow">
                    <Network className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Network Graph</h3>
                  <p className="text-gray-600 max-w-md">
                    Network visualization will appear here once the graph library is properly configured.
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-4 max-w-xs mx-auto">
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 mx-auto mb-2"></div>
                      <div className="text-xs text-gray-500">AI/ML</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500 mx-auto mb-2"></div>
                      <div className="text-xs text-gray-500">Quantum</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 mx-auto mb-2"></div>
                      <div className="text-xs text-gray-500">Healthcare</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center mb-4">
              <Eye className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Node Details</h3>
            </div>
            
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedNode.name}</h4>
                  <p className="text-sm text-gray-600">{selectedNode.affiliation}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedNode.papers_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Papers</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedNode.citation_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Citations</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <strong>Type:</strong> {selectedNode.type || 'N/A'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Click on a node to see details</p>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 text-gray-600 mr-2" />
              Legend
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                <span className="text-sm text-gray-700">AI/ML Research</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-purple-500 mr-3"></div>
                <span className="text-sm text-gray-700">Quantum Computing</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500 mr-3"></div>
                <span className="text-sm text-gray-700">Healthcare AI</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-1 bg-gray-300 mr-3 rounded-full"></div>
                <span className="text-xs text-gray-500">Link thickness = collaboration strength</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 