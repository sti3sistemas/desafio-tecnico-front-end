import { Box } from '@chakra-ui/react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import ClienteForm from './pages/Clientes/ClienteForm.jsx';
import ClientesList from './pages/Clientes/ClientesList.jsx';
import ProdutoForm from './pages/Produtos/ProdutoForm.jsx';
import ProdutosList from './pages/Produtos/ProdutosList.jsx';

const App = () => (
  <Router>
    <Box minH="100vh" minW="100vw" bg="gray.50" display="flex">
      <Sidebar />
      <Box flex="1" overflowX="hidden" p={8}>
        <Routes>
          <Route path="/clientes" element={<ClientesList />} />
          <Route path="/clientes/cadastrar" element={<ClienteForm />} />
          <Route path="/clientes/alterar/:id" element={<ClienteForm />} />
          <Route path="/produtos" element={<ProdutosList />} />
          <Route path="/produtos/cadastrar" element={<ProdutoForm />} />
          <Route path="/produtos/alterar/:id" element={<ProdutoForm />} />
        </Routes>
      </Box>
    </Box>
  </Router>
);

export default App;
