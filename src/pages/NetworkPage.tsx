import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  Download, 
  Filter,
  Users,
  FileText
} from 'lucide-react';
import type { NetworkNode, NetworkLink } from '../types/api';

export function NetworkPage() {
  const [filters, setFilters] = useState({
    collection_id: '',
    min_collaborations: 1,
    include_citations: false,
  });
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: NetworkNode[]; links: NetworkLink[] }>({ nodes: [], links: [] });
  const [showFilters, setShowFilters] = useState(false);

  const { data: networkData, isLoading, error } = useQuery({
    queryKey: ['network-analysis', filters],
    queryFn: () => apiClient.getNetworkAnalysis(filters),
    enabled: true,
  });

  const { data: collections } = useQuery({
    queryKey: ['collections-for-filter'],
    queryFn: () => apiClient.getCollections({ limit: 100 }),
  });

  // Update graph data when network data changes
  useEffect(() => {
    if (networkData) {
      setGraphData({
        nodes: networkData.nodes.map(node => ({
          ...node,
          val: node.value || 1,
          color: node.type === 'author' ? '#3b82f6' : '#10b981',
        })),
        links: networkData.links.map(link => ({
          ...link,
          color: link.type === 'collaboration' ? '#6366f1' : '#f59e0b',
        })),
      });
    }
  }, [networkData]);

  const handleNodeClick = useCallback((node: NetworkNode) => {
    setSelectedNode(node);
  }, []);

  const handleNodeHover = useCallback(() => {
    // Optional: Add hover effects
  }, []);

  const exportNetwork = async () => {
    try {
      const blob = await apiClient.exportNetwork({
        format: 'json',
        filters,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'network-data.json';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading network data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load network data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Visualization</h1>
          <p className="text-gray-600">Interactive graph of author collaborations and paper citations</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            onClick={exportNetwork}
            className="btn-primary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection
              </label>
              <select
                value={filters.collection_id}
                onChange={(e) => setFilters({ ...filters, collection_id: e.target.value })}
                className="input-field"
              >
                <option value="">All Collections</option>
                {collections?.results.map((collection) => (
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
                value={filters.min_collaborations}
                onChange={(e) => setFilters({ ...filters, min_collaborations: parseInt(e.target.value) || 1 })}
                className="input-field"
                min="1"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.include_citations}
                  onChange={(e) => setFilters({ ...filters, include_citations: e.target.checked })}
                  className="mr-2"
                />
                Include Citations
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph Container */}
        <div className="lg:col-span-3">
          <div className="card p-0 overflow-hidden">
            <div className="h-96 lg:h-[600px] bg-gray-50">
              {graphData.nodes.length > 0 ? (
                <ForceGraph2D
                  graphData={graphData}
                  nodeId="id"
                  nodeLabel="name"
                  nodeAutoColorBy="type"
                  linkSource="source"
                  linkTarget="target"
                  linkWidth={(link: any) => Math.sqrt(link.value || 1)} // eslint-disable-line @typescript-eslint/no-explicit-any
                  linkDirectionalParticles={2}
                  linkDirectionalParticleWidth={2}
                  onNodeClick={handleNodeClick}
                  onNodeHover={handleNodeHover}
                  width={800}
                  height={600}
                  backgroundColor="#f9fafb"
                  linkColor={() => 'rgba(99, 102, 241, 0.6)'}
                  nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    
                    // Draw node
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.val || 4, 0, 2 * Math.PI, false);
                    ctx.fillStyle = node.type === 'author' ? '#3b82f6' : '#10b981';
                    ctx.fill();
                    
                    // Draw label
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = '#374151';
                    ctx.fillText(label, node.x, node.y + (node.val || 4) + 1);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No network data</h3>
                    <p className="text-gray-600">Collect some papers first to see collaboration networks</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Network Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nodes:</span>
                <span className="font-medium">{graphData.nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Links:</span>
                <span className="font-medium">{graphData.links.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Authors:</span>
                <span className="font-medium">
                  {graphData.nodes.filter(n => n.type === 'author').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Papers:</span>
                <span className="font-medium">
                  {graphData.nodes.filter(n => n.type === 'paper').length}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                <span className="text-sm text-gray-600">Authors</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                <span className="text-sm text-gray-600">Papers</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-indigo-500 mr-3"></div>
                <span className="text-sm text-gray-600">Collaborations</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-amber-500 mr-3"></div>
                <span className="text-sm text-gray-600">Citations</span>
              </div>
            </div>
          </div>

          {/* Selected Node Info */}
          {selectedNode && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Details</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  {selectedNode.type === 'author' ? (
                    <Users className="h-4 w-4 text-blue-500 mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="font-medium">{selectedNode.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Type: {selectedNode.type}
                </div>
                {selectedNode.papers_count && (
                  <div className="text-sm text-gray-600">
                    Papers: {selectedNode.papers_count}
                  </div>
                )}
                {selectedNode.citation_count && (
                  <div className="text-sm text-gray-600">
                    Citations: {selectedNode.citation_count}
                  </div>
                )}
                {selectedNode.affiliation && (
                  <div className="text-sm text-gray-600">
                    Affiliation: {selectedNode.affiliation}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 