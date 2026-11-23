import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Container,
  Spinner,
  Center,
  Text,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import PostCard from '../components/PostCard';
import CriarPostModal from '../components/CriarPostModal';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Feed() {
  const { isAutenticado, usuario } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [isCriarPostOpen, setIsCriarPostOpen] = useState(false);

  // Apenas prestadores podem criar posts
  const isPrestador =
    isAutenticado &&
    (usuario?.tipo?.toUpperCase() === 'PRESTADOR' || Boolean(usuario?.catServico));

  // Executa ao montar o componente ou quando o usuário logado mudar
  useEffect(() => {
    carregarPosts();

    // 1. Sincronização instantânea em tempo real entre abas no mesmo navegador
    let canal;
    try {
      canal = new BroadcastChannel('vemfix_posts_channel');
      canal.onmessage = (event) => {
        if (event.data?.type === 'POST_ATUALIZADO') {
          const { postId, curtidas, curtidoPorUsuarioId, curtido } = event.data;
          setPosts((prevPosts) =>
            prevPosts.map((p) => {
              if (p.id === postId) {
                const ehMeuUsuario = usuario?.id === curtidoPorUsuarioId;
                return {
                  ...p,
                  curtidas,
                  curtido: ehMeuUsuario ? curtido : p.curtido,
                };
              }
              return p;
            })
          );
        } else if (event.data?.type === 'NOVO_POST') {
          carregarPosts(true);
        }
      };
    } catch {
      // Ignora se indisponível
    }

    // 2. Atualização automática ao focar ou voltar para a aba
    const handleVisivel = () => {
      if (document.visibilityState === 'visible') {
        carregarPosts(true);
      }
    };
    const handleFocus = () => {
      carregarPosts(true);
    };

    document.addEventListener('visibilitychange', handleVisivel);
    window.addEventListener('focus', handleFocus);

    // 3. Polling suave periódico para refletir interações de usuários em computadores diferentes
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        carregarPosts(true);
      }
    }, 8000);

    return () => {
      if (canal) canal.close();
      document.removeEventListener('visibilitychange', handleVisivel);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [usuario?.id, usuario?.tipo]);

  // Carrega posts com suporte a atualização silenciosa (sem piscar a tela ou exibir spinner)
  const carregarPosts = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);
      if (!silencioso) setErro(null);

      const params = {};
      if (usuario?.id) {
        const tipoFinal = (
          usuario?.tipo ||
          (usuario?.catServico ? 'PRESTADOR' : 'CLIENTE')
        ).toUpperCase();
        params.usuarioId = usuario.id;
        params.tipo = tipoFinal;
      }

      // Chamada GET para /posts informando o usuário logado para carregar o status de curtida
      const response = await api.get('/posts', { params });
      setPosts(response.data || []);
    } catch (error) {
      if (!silencioso) {
        console.error('Erro ao buscar posts da API:', error);
        setErro('Não foi possível conectar com o servidor. Verifique se o backend está ligado na porta 8080.');
      }
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  const handlePostCriado = (novoPost) => {
    // Insere o post criado no topo da lista do feed imediatamente
    setPosts((prevPosts) => [{ ...novoPost, curtido: false, curtidas: 0 }, ...prevPosts]);
  };

  return (
    <Box bg="vemfix.pageBg" minH="calc(100vh - 66px)" py={{ base: 6, md: 10 }} position="relative">
      <Container maxW="680px" px={{ base: 4, md: 0 }}>
        {/* Estado 1: Carregando dados da API */}
        {loading ? (
          <Center py={20}>
            <Spinner size="xl" color="vemfix.green" thickness="4px" />
          </Center>
        ) : erro ? (
          /* Estado 2: Falha ao conectar com o backend */
          <Alert status="warning" borderRadius="xl" boxShadow="sm">
            <AlertIcon />
            <Text fontSize="14px" color="gray.800">
              {erro}
            </Text>
          </Alert>
        ) : posts.length === 0 ? (
          /* Estado 3: Backend respondeu com sucesso, mas o banco ainda não tem posts cadastrados */
          <Center py={16}>
            <Text color="vemfix.graySubtitle" fontSize="15px">
              Nenhuma publicação encontrada no momento.
            </Text>
          </Center>
        ) : (
          /* Estado 4: Renderização dos posts reais vindos do banco de dados */
          <VStack spacing={6} align="stretch">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </VStack>
        )}
      </Container>

      {/* Botão flutuante de '+' exclusivo para Prestador */}
      {isPrestador && (
        <Tooltip label="Criar novo post" placement="left" hasArrow bg="vemfix.dark" color="white" fontSize="12px">
          <IconButton
            aria-label="Criar novo post"
            icon={<FaPlus size={20} />}
            position="fixed"
            bottom={{ base: '24px', md: '36px' }}
            right={{ base: '20px', md: 'max(24px, calc(50% - 340px - 76px))' }}
            w="58px"
            h="58px"
            borderRadius="full"
            bg="vemfix.green"
            color="white"
            boxShadow="0 8px 24px rgba(26, 158, 110, 0.42), 0 2px 6px rgba(0, 0, 0, 0.12)"
            _hover={{
              bg: 'vemfix.greenDark',
              transform: 'scale(1.08)',
              boxShadow: '0 12px 28px rgba(26, 158, 110, 0.55)',
            }}
            _active={{
              bg: 'vemfix.greenDark',
              transform: 'scale(0.96)',
            }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            zIndex={1000}
            onClick={() => setIsCriarPostOpen(true)}
          />
        </Tooltip>
      )}

      {/* Modal de Publicação de Post */}
      <CriarPostModal
        isOpen={isCriarPostOpen}
        onClose={() => setIsCriarPostOpen(false)}
        onPostCriado={handlePostCriado}
      />
    </Box>
  );
}
