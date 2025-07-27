import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { 
  Search, 
  Users, 
  FileText, 
  Building,
  Mail,
  ExternalLink,
  TrendingUp,
  Award
} from 'lucide-react';
import type { Author } from '../types/api';

export function AuthorsPage() {
  const [filters, setFilters] = useState({
    search: '',
    ordering: '-papers_count',
    limit: 20,
    offset: 0,
  });

  const { data: authors, isLoading } = useQuery({
    queryKey: ['authors', filters],
    queryFn: () => apiClient.getAuthors(filters),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch due to the filters dependency
  };

  const handleSort = (field: string) => {
    const newOrdering = filters.ordering === field ? `-${field}` : field;
    setFilters({ ...filters, ordering: newOrdering });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
          <p className="text-gray-600">Discover researchers and their collaboration networks</p>
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
              placeholder="Search authors by name or affiliation..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Sort Controls */}
      <div className="mb-6 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <button
          onClick={() => handleSort('name')}
          className={`px-3 py-1 text-sm rounded ${
            filters.ordering === 'name' || filters.ordering === '-name'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Name
        </button>
        <button
          onClick={() => handleSort('papers_count')}
          className={`px-3 py-1 text-sm rounded ${
            filters.ordering === 'papers_count' || filters.ordering === '-papers_count'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Papers
        </button>
        <button
          onClick={() => handleSort('citation_count')}
          className={`px-3 py-1 text-sm rounded ${
            filters.ordering === 'citation_count' || filters.ordering === '-citation_count'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Citations
        </button>
        <button
          onClick={() => handleSort('h_index')}
          className={`px-3 py-1 text-sm rounded ${
            filters.ordering === 'h_index' || filters.ordering === '-h_index'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          H-Index
        </button>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : authors?.results?.length ? (
          authors.results.map((author: Author) => (
            <div key={author.id} className="card hover:shadow-md transition-shadow">
              {/* Author Header */}
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {author.name}
                  </h3>
                  {author.affiliation && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{author.affiliation}</span>
                    </div>
                  )}
                  {author.email && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{author.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="text-lg font-semibold">
                      {author.papers_count || 0}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">Papers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-lg font-semibold">
                      {author.citation_count || 0}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">Citations</div>
                </div>
              </div>

              {/* H-Index */}
              {author.h_index && (
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    <Award className="h-3 w-3 mr-1" />
                    H-Index: {author.h_index}
                  </div>
                </div>
              )}

              {/* ORCID Link */}
              {author.orcid && (
                <div className="pt-4 border-t">
                  <a
                    href={`https://orcid.org/${author.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View ORCID Profile
                  </a>
                </div>
              )}

              {/* Research Areas - placeholder for future enhancement */}
              <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-gray-500 text-center">
                  Member since {new Date(author.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No authors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {authors?.results && authors.results.length > 0 && (
        <div className="mt-8">
          <div className="text-sm text-gray-600 text-center mb-4">
            Showing {authors.results.length} of {authors.count} authors
          </div>
          <div className="flex justify-center space-x-2">
            {authors.previous && (
              <button
                onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - filters.limit) })}
                className="btn-secondary"
              >
                Previous
              </button>
            )}
            {authors.next && (
              <button
                onClick={() => setFilters({ ...filters, offset: filters.offset + filters.limit })}
                className="btn-secondary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {authors?.count && authors.results && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {authors.count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Authors</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {authors.results.reduce((sum, author) => sum + (author.papers_count || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Papers</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {authors.results.reduce((sum, author) => sum + (author.citation_count || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Citations</div>
          </div>
        </div>
      )}
    </div>
  );
} 