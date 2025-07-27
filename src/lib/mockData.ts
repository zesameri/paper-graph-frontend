import type { Stats, NetworkData, Collection } from '../types/api';

// Mock data for when the API is not available
export const mockStats: Stats = {
  total_papers: 1247,
  total_authors: 386,
  total_collaborations: 89,
  total_collections: 12,
  recent_papers: [
    {
      id: '1',
      title: 'Transformer Networks for Natural Language Understanding: A Comprehensive Survey',
      abstract: 'This paper presents a comprehensive survey of transformer architectures and their applications in natural language processing. We analyze the evolution from the original attention mechanism to modern large language models...',
      authors: [
        { id: '1', name: 'Dr. Sarah Chen', affiliation: 'Stanford University', created_at: '2024-01-15T10:30:00Z' },
        { id: '2', name: 'Prof. Michael Rodriguez', affiliation: 'MIT', created_at: '2024-01-15T10:30:00Z' }
      ],
      arxiv_id: 'arxiv:2401.12345',
      publication_date: '2024-01-15T00:00:00Z',
      url: 'https://arxiv.org/abs/2401.12345',
      citations_count: 156,
      keywords: ['transformers', 'natural language processing', 'attention mechanism'],
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Quantum Machine Learning: Bridging Quantum Computing and Artificial Intelligence',
      abstract: 'We explore the intersection of quantum computing and machine learning, proposing novel quantum algorithms for neural network training and optimization...',
      authors: [
        { id: '3', name: 'Dr. Emily Johnson', affiliation: 'Google Research', created_at: '2024-01-14T09:15:00Z' },
        { id: '4', name: 'Dr. James Liu', affiliation: 'IBM Quantum', created_at: '2024-01-14T09:15:00Z' }
      ],
      arxiv_id: 'arxiv:2401.11234',
      publication_date: '2024-01-14T00:00:00Z',
      url: 'https://arxiv.org/abs/2401.11234',
      citations_count: 89,
      keywords: ['quantum computing', 'machine learning', 'quantum algorithms'],
      created_at: '2024-01-14T09:15:00Z'
    },
    {
      id: '3',
      title: 'Federated Learning in Healthcare: Privacy-Preserving Medical AI',
      abstract: 'This work addresses the critical need for privacy-preserving machine learning in healthcare applications. We propose a federated learning framework that enables collaborative model training...',
      authors: [
        { id: '5', name: 'Dr. Priya Patel', affiliation: 'Johns Hopkins', created_at: '2024-01-13T14:20:00Z' },
        { id: '6', name: 'Dr. Robert Kim', affiliation: 'Stanford Medicine', created_at: '2024-01-13T14:20:00Z' }
      ],
      semantic_scholar_id: 'ss:567890',
      publication_date: '2024-01-13T00:00:00Z',
      citations_count: 234,
      keywords: ['federated learning', 'healthcare', 'privacy', 'medical AI'],
      created_at: '2024-01-13T14:20:00Z'
    }
  ],
  recent_authors: [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      affiliation: 'Stanford University, Computer Science Department',
      email: 'sarah.chen@stanford.edu',
      papers_count: 47,
      citation_count: 2156,
      h_index: 28,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '3',
      name: 'Dr. Emily Johnson',
      affiliation: 'Google Research, Quantum AI Team',
      papers_count: 32,
      citation_count: 1843,
      h_index: 24,
      created_at: '2024-01-14T09:15:00Z'
    },
    {
      id: '5',
      name: 'Dr. Priya Patel',
      affiliation: 'Johns Hopkins University, School of Medicine',
      papers_count: 28,
      citation_count: 1654,
      h_index: 22,
      created_at: '2024-01-13T14:20:00Z'
    },
    {
      id: '7',
      name: 'Prof. David Zhang',
      affiliation: 'UC Berkeley, EECS Department',
      papers_count: 52,
      citation_count: 3210,
      h_index: 35,
      created_at: '2024-01-12T11:45:00Z'
    }
  ],
  top_collaborations: [
    {
      id: '1',
      author1_id: '1',
      author2_id: '2',
      author1: {
        id: '1',
        name: 'Dr. Sarah Chen',
        affiliation: 'Stanford University',
        created_at: '2024-01-15T10:30:00Z'
      },
      author2: {
        id: '2',
        name: 'Prof. Michael Rodriguez',
        affiliation: 'MIT',
        created_at: '2024-01-15T10:30:00Z'
      },
      papers_count: 8,
      first_collaboration: '2022-03-15T00:00:00Z',
      last_collaboration: '2024-01-15T00:00:00Z',
      strength: 0.87
    },
    {
      id: '2',
      author1_id: '3',
      author2_id: '4',
      author1: {
        id: '3',
        name: 'Dr. Emily Johnson',
        affiliation: 'Google Research',
        created_at: '2024-01-14T09:15:00Z'
      },
      author2: {
        id: '4',
        name: 'Dr. James Liu',
        affiliation: 'IBM Quantum',
        created_at: '2024-01-14T09:15:00Z'
      },
      papers_count: 5,
      first_collaboration: '2023-06-20T00:00:00Z',
      last_collaboration: '2024-01-14T00:00:00Z',
      strength: 0.76
    },
    {
      id: '3',
      author1_id: '5',
      author2_id: '6',
      author1: {
        id: '5',
        name: 'Dr. Priya Patel',
        affiliation: 'Johns Hopkins',
        created_at: '2024-01-13T14:20:00Z'
      },
      author2: {
        id: '6',
        name: 'Dr. Robert Kim',
        affiliation: 'Stanford Medicine',
        created_at: '2024-01-13T14:20:00Z'
      },
      papers_count: 6,
      first_collaboration: '2023-01-10T00:00:00Z',
      last_collaboration: '2024-01-13T00:00:00Z',
      strength: 0.82
    }
  ]
};

export const mockNetworkData: any = {
  nodes: [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      type: 'author',
      group: 'AI/ML',
      size: 45,
      metadata: {
        affiliation: 'Stanford University',
        papers_count: 47,
        citation_count: 2156,
        h_index: 28
      }
    },
    {
      id: 2,
      name: 'Prof. Michael Rodriguez',
      type: 'author',
      group: 'AI/ML',
      size: 38,
      metadata: {
        affiliation: 'MIT',
        papers_count: 35,
        citation_count: 1890,
        h_index: 25
      }
    },
    {
      id: 3,
      name: 'Dr. Emily Johnson',
      type: 'author',
      group: 'Quantum',
      size: 42,
      metadata: {
        affiliation: 'Google Research',
        papers_count: 32,
        citation_count: 1843,
        h_index: 24
      }
    },
    {
      id: 4,
      name: 'Dr. James Liu',
      type: 'author',
      group: 'Quantum',
      size: 35,
      metadata: {
        affiliation: 'IBM Quantum',
        papers_count: 28,
        citation_count: 1234,
        h_index: 20
      }
    },
    {
      id: 5,
      name: 'Dr. Priya Patel',
      type: 'author',
      group: 'Healthcare',
      size: 40,
      metadata: {
        affiliation: 'Johns Hopkins',
        papers_count: 28,
        citation_count: 1654,
        h_index: 22
      }
    },
    {
      id: 6,
      name: 'Dr. Robert Kim',
      type: 'author',
      group: 'Healthcare',
      size: 33,
      metadata: {
        affiliation: 'Stanford Medicine',
        papers_count: 24,
        citation_count: 1123,
        h_index: 18
      }
    },
    {
      id: 7,
      name: 'Prof. David Zhang',
      type: 'author',
      group: 'AI/ML',
      size: 52,
      metadata: {
        affiliation: 'UC Berkeley',
        papers_count: 52,
        citation_count: 3210,
        h_index: 35
      }
    },
    {
      id: 8,
      name: 'Dr. Anna Petrov',
      type: 'author',
      group: 'Quantum',
      size: 30,
      metadata: {
        affiliation: 'MIT',
        papers_count: 22,
        citation_count: 987,
        h_index: 16
      }
    }
  ],
  links: [
    {
      source: 1,
      target: 2,
      value: 8,
      type: 'collaboration'
    },
    {
      source: 3,
      target: 4,
      value: 5,
      type: 'collaboration'
    },
    {
      source: 5,
      target: 6,
      value: 6,
      type: 'collaboration'
    },
    {
      source: 1,
      target: 7,
      value: 4,
      type: 'collaboration'
    },
    {
      source: 2,
      target: 7,
      value: 3,
      type: 'collaboration'
    },
    {
      source: 3,
      target: 8,
      value: 4,
      type: 'collaboration'
    },
    {
      source: 4,
      target: 8,
      value: 2,
      type: 'collaboration'
    }
  ],
  clusters: [
    {
      id: 'ai-ml',
      name: 'AI/ML Research',
      nodes: ['1', '2', '7'],
      size: 3,
      density: 0.67
    },
    {
      id: 'quantum',
      name: 'Quantum Computing',
      nodes: ['3', '4', '8'],
      size: 3,
      density: 0.67
    },
    {
      id: 'healthcare',
      name: 'Healthcare AI',
      nodes: ['5', '6'],
      size: 2,
      density: 1.0
    }
  ],
  metadata: {
    total_nodes: 8,
    total_links: 7,
    total_clusters: 3,
    avg_clustering_coefficient: 0.72,
    network_density: 0.25,
    max_degree: 3,
    generated_at: '2024-01-16T12:00:00Z'
  }
};

export const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'AI/ML Survey 2024',
    description: 'Comprehensive collection of recent AI and machine learning papers',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    papers_count: 245,
    authors_count: 89,
    status: 'completed',
    collection_type: 'keyword',
    parameters: {
      keywords: ['artificial intelligence', 'machine learning', 'neural networks'],
      max_papers: 500,
      date_range: {
        start: '2023-01-01',
        end: '2024-01-01'
      }
    }
  },
  {
    id: '2',
    name: 'Quantum Computing Research',
    description: 'Latest research in quantum computing and quantum algorithms',
    created_at: '2024-01-08T09:00:00Z',
    updated_at: '2024-01-14T16:45:00Z',
    papers_count: 156,
    authors_count: 64,
    status: 'completed',
    collection_type: 'keyword',
    parameters: {
      keywords: ['quantum computing', 'quantum algorithms', 'quantum machine learning'],
      max_papers: 300,
      date_range: {
        start: '2023-06-01',
        end: '2024-01-01'
      }
    }
  },
  {
    id: '3',
    name: 'Healthcare AI Innovations',
    description: 'AI applications in healthcare and medical research',
    created_at: '2024-01-05T11:30:00Z',
    updated_at: '2024-01-13T13:20:00Z',
    papers_count: 198,
    authors_count: 76,
    status: 'completed',
    collection_type: 'keyword',
    parameters: {
      keywords: ['healthcare AI', 'medical AI', 'federated learning'],
      max_papers: 400,
      date_range: {
        start: '2023-01-01',
        end: '2024-01-01'
      }
    }
  },
  {
    id: '4',
    name: 'Stanford CS Authors',
    description: 'Papers by Stanford Computer Science faculty and researchers',
    created_at: '2024-01-12T08:15:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    papers_count: 123,
    authors_count: 45,
    status: 'active',
    collection_type: 'author',
    parameters: {
      author_names: ['Sarah Chen', 'David Zhang', 'Robert Kim'],
      max_papers: 200,
      include_collaborators: true
    }
  }
]; 