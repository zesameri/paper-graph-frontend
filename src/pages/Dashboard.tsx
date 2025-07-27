import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { FileText, Users, Network, FolderOpen, TrendingUp, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: apiClient.getStats,
  });

  if (statsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load dashboard stats. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Papers',
      value: stats?.total_papers || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Authors',
      value: stats?.total_authors || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Collaborations',
      value: stats?.total_collaborations || 0,
      icon: Network,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Collections',
      value: stats?.total_collections || 0,
      icon: FolderOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your paper collection and network analysis</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Papers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Papers</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          {stats?.recent_papers?.length ? (
            <div className="space-y-4">
              {stats.recent_papers.slice(0, 5).map((paper) => (
                <div key={paper.id} className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{paper.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {paper.authors.map(a => a.name).join(', ')}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(paper.created_at), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No papers collected yet</p>
          )}
        </div>

        {/* Recent Authors */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Authors</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          {stats?.recent_authors?.length ? (
            <div className="space-y-4">
              {stats.recent_authors.slice(0, 5).map((author) => (
                <div key={author.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{author.name}</p>
                    <p className="text-sm text-gray-500">{author.affiliation || 'No affiliation'}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {author.papers_count || 0} papers
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No authors discovered yet</p>
          )}
        </div>
      </div>

      {/* Top Collaborations */}
      {stats?.top_collaborations?.length && (
        <div className="mt-8 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Collaborations</h2>
            <Network className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.top_collaborations.slice(0, 5).map((collab) => (
              <div key={collab.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {collab.author1.name} ↔ {collab.author2.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {collab.papers_count} collaborative papers
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary-600">
                    Strength: {collab.strength.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(collab.last_collaboration), { addSuffix: true })}
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