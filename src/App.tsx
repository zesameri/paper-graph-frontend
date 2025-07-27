import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './components/AppRoutes';
import { Layout } from './components/Layout';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
