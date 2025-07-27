import axios from 'axios';
import type {
  Paper,
  Author,
  Collaboration,
  Collection,
  Task,
  Stats,
  NetworkData,
  CollectRequest,
  ExportRequest,
} from '../types/api';

const API_BASE_URL = 'https://arxiv-paper-collector-488677975213.us-central1.run.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiClient = {
  // Root endpoint
  getApiInfo: () => api.get('/api/'),

  // Stats
  getStats: (): Promise<Stats> => api.get('/api/stats/').then(res => res.data),

  // Papers
  getPapers: (params?: {
    limit?: number;
    offset?: number;
    search?: string;
    collection_id?: string;
    author_id?: string;
  }): Promise<{ results: Paper[]; count: number; next?: string; previous?: string }> =>
    api.get('/api/papers/', { params }).then(res => res.data),

  getPaper: (id: string): Promise<Paper> =>
    api.get(`/api/papers/${id}/`).then(res => res.data),

  // Authors
  getAuthors: (params?: {
    limit?: number;
    offset?: number;
    search?: string;
    ordering?: string;
  }): Promise<{ results: Author[]; count: number; next?: string; previous?: string }> =>
    api.get('/api/authors/', { params }).then(res => res.data),

  getAuthor: (id: string): Promise<Author> =>
    api.get(`/api/authors/${id}/`).then(res => res.data),

  // Collaborations
  getCollaborations: (params?: {
    limit?: number;
    offset?: number;
    author_id?: string;
    min_papers?: number;
  }): Promise<{ results: Collaboration[]; count: number; next?: string; previous?: string }> =>
    api.get('/api/collaborations/', { params }).then(res => res.data),

  // Collections
  getCollections: (params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<{ results: Collection[]; count: number; next?: string; previous?: string }> =>
    api.get('/api/collections/', { params }).then(res => res.data),

  getCollection: (id: string): Promise<Collection> =>
    api.get(`/api/collections/${id}/`).then(res => res.data),

  // Tasks
  getTasks: (params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<{ results: Task[]; count: number; next?: string; previous?: string }> =>
    api.get('/api/tasks/', { params }).then(res => res.data),

  getTask: (id: string): Promise<Task> =>
    api.get(`/api/tasks/${id}/`).then(res => res.data),

  // Collection actions
  collectByAuthors: (data: CollectRequest): Promise<{ task_id: string; message: string }> =>
    api.post('/api/collect/authors/', data).then(res => res.data),

  collectByKeywords: (data: CollectRequest): Promise<{ task_id: string; message: string }> =>
    api.post('/api/collect/keywords/', data).then(res => res.data),

  // Network analysis
  getNetworkAnalysis: (params?: {
    collection_id?: string;
    min_collaborations?: number;
    include_citations?: boolean;
  }): Promise<NetworkData> =>
    api.get('/api/network/analysis/', { params }).then(res => res.data),

  // Export functions
  exportPapers: (data: ExportRequest): Promise<Blob> =>
    api.post('/api/export/papers/', data, {
      responseType: 'blob',
    }).then(res => res.data),

  exportNetwork: (data: ExportRequest): Promise<Blob> =>
    api.post('/api/export/network/', data, {
      responseType: 'blob',
    }).then(res => res.data),
};

export default apiClient; 