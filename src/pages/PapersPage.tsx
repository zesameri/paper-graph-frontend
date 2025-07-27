import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  Calendar,
  Users,
  FileText,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Paper } from '../types/api';

export function PapersPage() {
  const [filters, setFilters] = useState({
    search: '',
    collection_id: '',
    author_id: '',
    limit: 20,
    offset: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<'title' | 'publication_date' | 'citations_count'>('publication_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: papers, isLoading } = useQuery({
    queryKey: ['papers', filters, sortField, sortOrder],
    queryFn: () => apiClient.getPapers(filters),
  });

  const { data: collections } = useQuery({
    queryKey: ['collections-for-filter'],
    queryFn: () => apiClient.getCollections({ limit: 100 }),
  });

  const { data: authors } = useQuery({
    queryKey: ['authors-for-filter'],
    queryFn: () => apiClient.getAuthors({ limit: 100 }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch due to the filters dependency
  };

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportPapers = async () => {
    try {
      const blob = await apiClient.exportPapers({
        format: 'csv',
        filters: {
          collection_id: filters.collection_id || undefined,
          author_ids: filters.author_id ? [filters.author_id] : undefined,
        },
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'papers.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Papers</h1>
          <p className="text-gray-600">Browse and search through collected research papers</p>
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
            onClick={exportPapers}
            className="btn-primary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search papers by title, abstract, or keywords..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Author
              </label>
              <select
                value={filters.author_id}
                onChange={(e) => setFilters({ ...filters, author_id: e.target.value })}
                className="input-field"
              >
                <option value="">All Authors</option>
                {authors?.results.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sort Controls */}
      <div className="mb-4 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <button
          onClick={() => handleSort('title')}
          className={`flex items-center px-3 py-1 text-sm rounded ${
            sortField === 'title' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Title
          {sortField === 'title' && (
            sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
          )}
        </button>
        <button
          onClick={() => handleSort('publication_date')}
          className={`flex items-center px-3 py-1 text-sm rounded ${
            sortField === 'publication_date' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Date
          {sortField === 'publication_date' && (
            sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
          )}
        </button>
        <button
          onClick={() => handleSort('citations_count')}
          className={`flex items-center px-3 py-1 text-sm rounded ${
            sortField === 'citations_count' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Citations
          {sortField === 'citations_count' && (
            sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
          )}
        </button>
      </div>

      {/* Papers List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : papers?.results?.length ? (
          <>
            <div className="text-sm text-gray-600 mb-4">
              Showing {papers.results.length} of {papers.count} papers
            </div>
            {papers.results.map((paper: Paper) => (
              <div key={paper.id} className="card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                    {paper.title}
                  </h3>
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 p-2 text-gray-400 hover:text-primary-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {paper.authors.map(a => a.name).join(', ')}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(paper.publication_date), { addSuffix: true })}
                  </div>
                  {paper.citations_count && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {paper.citations_count} citations
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-3 line-clamp-3">
                  {truncateText(paper.abstract, 300)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {paper.arxiv_id && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded">arXiv</span>
                    )}
                    {paper.pubmed_id && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">PubMed</span>
                    )}
                    {paper.semantic_scholar_id && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Semantic Scholar</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Added {formatDistanceToNow(new Date(paper.created_at), { addSuffix: true })}
                  </div>
                </div>

                {paper.keywords && paper.keywords.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-1">
                      {paper.keywords.slice(0, 5).map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                      {paper.keywords.length > 5 && (
                        <span className="inline-block text-gray-500 text-xs px-2 py-1">
                          +{paper.keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {papers.previous && (
                  <button
                    onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - filters.limit) })}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                )}
                {papers.next && (
                  <button
                    onClick={() => setFilters({ ...filters, offset: filters.offset + filters.limit })}
                    className="btn-secondary"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
} 