
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddSubject from './pages/AddSubject';
import SubjectDetail from './pages/SubjectDetail';
import EditSubject from './pages/EditSubject';
import MarkHours from './pages/MarkHours';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="add" element={<AddSubject />} />
        <Route path="subject/:id" element={<SubjectDetail />} />
        <Route path="subject/:id/edit" element={<EditSubject />} />
        <Route path="subject/:id/mark" element={<MarkHours />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
