import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { mockStats } from '../lib/mockData';
import { 
  FileText, 
  Users, 
  Network, 
  FolderOpen, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Wifi,
  WifiOff
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: apiClient.getStats,
    retry: 1, // Only retry once to fail faster
  });

  // Use mock data if API fails
  const displayStats = stats || (statsError ? mockStats : null);
  const isUsingMockData = !stats && statsError;

  if (statsLoading) {
    return (
      <div className="p-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <div className="skeleton h-8 w-48"></div>
            <div className="skeleton h-5 w-96"></div>
          </div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card">
                <div className="skeleton h-6 w-6 rounded mx-auto mb-4"></div>
                <div className="skeleton h-8 w-16 mx-auto mb-2"></div>
                <div className="skeleton h-4 w-20 mx-auto"></div>
              </div>
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="card">
                <div className="skeleton h-6 w-32 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="skeleton h-16 w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Papers',
      value: displayStats?.total_papers || 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Authors',
      value: displayStats?.total_authors || 0,
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Collaborations',
      value: displayStats?.total_collaborations || 0,
      icon: Network,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      name: 'Collections',
      value: displayStats?.total_collections || 0,
      icon: FolderOpen,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-50 to-amber-100',
      change: '+5%',
      changeType: 'positive' as const,
    },
  ];

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
              API is not available, showing sample data to demonstrate the interface.
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
            <Sparkles className="h-8 w-8 text-primary-500 mr-3" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your research network.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="btn-primary flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="group">
            <div className="stat-card group-hover:scale-105">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center mx-auto mb-4 shadow-soft`}>
                <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
              
              <div className="stat-value mb-1">
                {stat.value.toLocaleString()}
              </div>
              
              <div className="stat-label mb-3">
                {stat.name}
              </div>
              
              <div className="flex items-center justify-center text-xs">
                <ArrowUpRight className="h-3 w-3 text-success-600 mr-1" />
                <span className="text-success-600 font-medium">{stat.change}</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Papers */}
        <div className="card group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4 shadow-soft">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Papers</h2>
                <p className="text-sm text-gray-500">Latest research discoveries</p>
              </div>
            </div>
            <TrendingUp className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          
          {displayStats?.recent_papers?.length ? (
            <div className="space-y-4">
              {displayStats.recent_papers.slice(0, 5).map((paper) => (
                <div key={paper.id} className="paper-card p-4 hover:shadow-medium transition-all duration-300">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 leading-relaxed">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {paper.authors.map(a => a.name).join(', ')}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(paper.created_at), { addSuffix: true })}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">No papers yet</h3>
              <p className="text-sm text-gray-500 mb-4">Start by creating your first collection</p>
              <button className="btn-primary text-sm">
                Create Collection
              </button>
            </div>
          )}
        </div>

        {/* Recent Authors */}
        <div className="card group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-4 shadow-soft">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Authors</h2>
                <p className="text-sm text-gray-500">Newly discovered researchers</p>
              </div>
            </div>
            <Users className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          
          {displayStats?.recent_authors?.length ? (
            <div className="space-y-4">
              {displayStats.recent_authors.slice(0, 5).map((author) => (
                <div key={author.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="author-avatar w-12 h-12">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{author.name}</p>
                    <p className="text-xs text-gray-500 truncate">{author.affiliation || 'No affiliation'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {author.papers_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">papers</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">No authors yet</h3>
              <p className="text-sm text-gray-500 mb-4">Authors will appear as you collect papers</p>
              <button className="btn-secondary text-sm">
                Browse Authors
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top Collaborations */}
      {displayStats?.top_collaborations?.length && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-4 shadow-soft">
                <Network className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Top Collaborations</h2>
                <p className="text-sm text-gray-500">Strongest research partnerships</p>
              </div>
            </div>
            <Network className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {displayStats.top_collaborations.slice(0, 5).map((collab, index) => (
              <div key={collab.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl hover:shadow-soft transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white text-sm font-bold shadow-soft">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {collab.author1.name} ↔ {collab.author2.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {collab.papers_count} collaborative papers
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-purple-600">
                    {collab.strength.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    strength score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 