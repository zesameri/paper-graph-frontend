export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  arxiv_id?: string;
  pubmed_id?: string;
  semantic_scholar_id?: string;
  publication_date: string;
  url?: string;
  citations_count?: number;
  keywords?: string[];
  collection_id?: string;
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
  affiliation?: string;
  email?: string;
  orcid?: string;
  h_index?: number;
  citation_count?: number;
  papers_count?: number;
  created_at: string;
}

export interface Collaboration {
  id: string;
  author1_id: string;
  author2_id: string;
  author1: Author;
  author2: Author;
  papers_count: number;
  first_collaboration: string;
  last_collaboration: string;
  strength: number;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  authors?: string[];
  keywords?: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  papers_count: number;
  authors_count: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface Task {
  id: string;
  type: 'collect_authors' | 'collect_keywords';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  total: number;
  current_item?: string;
  result?: {
    papers_collected?: number;
    authors_discovered?: number;
    collection_id?: string;
    message?: string;
  };
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  total_papers: number;
  total_authors: number;
  total_collaborations: number;
  total_collections: number;
  recent_papers: Paper[];
  recent_authors: Author[];
  top_collaborations: Collaboration[];
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  clusters?: NetworkCluster[];
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'author' | 'paper';
  group?: number;
  value?: number;
  papers_count?: number;
  citation_count?: number;
  affiliation?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
  type: 'collaboration' | 'citation';
}

export interface NetworkCluster {
  id: string;
  name: string;
  nodes: string[];
  color: string;
}

export interface CollectRequest {
  authors?: string[];
  keywords?: string[];
  max_papers?: number;
  include_citations?: boolean;
}

export interface ExportRequest {
  format: 'csv' | 'json' | 'bibtex';
  filters?: {
    collection_id?: string;
    author_ids?: string[];
    date_from?: string;
    date_to?: string;
  };
} 