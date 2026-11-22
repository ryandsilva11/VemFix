import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Feed from './pages/Feed';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import PerfilPrestador from './pages/PerfilPrestador';
import PerfilCliente from './pages/PerfilCliente';
import Suporte from './pages/Suporte';
import Conversas from './pages/Conversas';
import Chat from './pages/Chat';
import { AuthProvider } from './contexts/AuthContext';

function LayoutPrincipal() {
  return (
    <Flex direction="column" minH="100vh" bg="vemfix.pageBg">
      <Header />
      <Feed />
      <Footer />
    </Flex>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutPrincipal />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/prestador/:id" element={<PerfilPrestador />} />
          <Route path="/cliente/:id" element={<PerfilCliente />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/conversas" element={<Conversas />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/chat/prestador/:prestadorId" element={<Chat />} />
          <Route path="/conversa/:chatId" element={<Chat />} />
          <Route path="/conversa/prestador/:prestadorId" element={<Chat />} />
          <Route path="*" element={<LayoutPrincipal />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
