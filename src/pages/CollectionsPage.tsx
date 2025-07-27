import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Plus, Search, Users, Tag, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function CollectionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [collectType, setCollectType] = useState<'authors' | 'keywords'>('authors');
  const [formData, setFormData] = useState({
    authors: '',
    keywords: '',
    max_papers: 50,
  });

  const queryClient = useQueryClient();

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => apiClient.getCollections({ limit: 20 }),
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiClient.getTasks({ limit: 10 }),
    refetchInterval: 5000, // Poll every 5 seconds for active tasks
  });

  const collectMutation = useMutation({
    mutationFn: (data: { authors?: string[]; keywords?: string[]; max_papers: number }) => {
      if (collectType === 'authors') {
        return apiClient.collectByAuthors({
          authors: data.authors,
          max_papers: data.max_papers,
        });
      } else {
        return apiClient.collectByKeywords({
          keywords: data.keywords,
          max_papers: data.max_papers,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
      setFormData({ authors: '', keywords: '', max_papers: 50 });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (collectType === 'authors') {
      const authors = formData.authors.split(',').map(a => a.trim()).filter(Boolean);
      if (authors.length === 0) return;
      collectMutation.mutate({ authors, max_papers: formData.max_papers });
    } else {
      const keywords = formData.keywords.split(',').map(k => k.trim()).filter(Boolean);
      if (keywords.length === 0) return;
      collectMutation.mutate({ keywords, max_papers: formData.max_papers });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'running':
        return 'text-blue-700 bg-blue-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-600">Manage your paper collections and start new data gathering tasks</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Collection
        </button>
      </div>

      {/* Active Tasks */}
      {tasks?.results && tasks.results.filter(t => t.status === 'running').length > 0 && (
        <div className="mb-8 card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Tasks</h2>
          <div className="space-y-4">
            {tasks.results
              .filter(t => t.status === 'running')
              .map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                      <span className="font-medium">
                        {task.type === 'collect_authors' ? 'Collecting by Authors' : 'Collecting by Keywords'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {task.current_item && (
                    <p className="text-sm text-gray-600 mb-2">
                      Currently processing: {task.current_item}
                    </p>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((task.progress / task.total) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {task.progress} / {task.total} completed
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Collection Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Start New Collection</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="authors"
                      checked={collectType === 'authors'}
                      onChange={(e) => setCollectType(e.target.value as 'authors')}
                      className="mr-2"
                    />
                    <Users className="h-4 w-4 mr-1" />
                    By Authors
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="keywords"
                      checked={collectType === 'keywords'}
                      onChange={(e) => setCollectType(e.target.value as 'keywords')}
                      className="mr-2"
                    />
                    <Tag className="h-4 w-4 mr-1" />
                    By Keywords
                  </label>
                </div>
              </div>

              {collectType === 'authors' ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Names (comma-separated)
                  </label>
                  <textarea
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="John Doe, Jane Smith, ..."
                    required
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (comma-separated)
                  </label>
                  <textarea
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="machine learning, artificial intelligence, ..."
                    required
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Papers
                </label>
                <input
                  type="number"
                  value={formData.max_papers}
                  onChange={(e) => setFormData({ ...formData, max_papers: parseInt(e.target.value) })}
                  className="input-field"
                  min="1"
                  max="500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={collectMutation.isPending}
                  className="btn-primary flex items-center"
                >
                  {collectMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Collection
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collections List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : collections?.results?.length ? (
          collections.results.map((collection) => (
            <div key={collection.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getStatusIcon(collection.status)}
                    <h3 className="ml-2 text-lg font-semibold text-gray-900">
                      {collection.name}
                    </h3>
                    <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(collection.status)}`}>
                      {collection.status}
                    </span>
                  </div>
                  {collection.description && (
                    <p className="text-gray-600 mb-3">{collection.description}</p>
                  )}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 mr-1" />
                      {collection.papers_count} papers
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {collection.authors_count} authors
                    </div>
                    <div>
                      Started {formatDistanceToNow(new Date(collection.started_at), { addSuffix: true })}
                    </div>
                  </div>
                  {collection.authors && collection.authors.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">Authors: </span>
                      <span className="text-sm text-gray-600">{collection.authors.join(', ')}</span>
                    </div>
                  )}
                  {collection.keywords && collection.keywords.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Keywords: </span>
                      <span className="text-sm text-gray-600">{collection.keywords.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
            <p className="text-gray-600 mb-4">Start your first collection to begin gathering papers</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 