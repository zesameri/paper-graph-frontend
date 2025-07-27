import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { NetworkPage } from '../pages/NetworkPage';
import { CollectionsPage } from '../pages/CollectionsPage';
import { PapersPage } from '../pages/PapersPage';
import { AuthorsPage } from '../pages/AuthorsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/network" element={<NetworkPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/papers" element={<PapersPage />} />
      <Route path="/authors" element={<AuthorsPage />} />
    </Routes>
  );
} 