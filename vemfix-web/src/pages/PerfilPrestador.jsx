import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  Spinner,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function PerfilPrestador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAutenticado, usuario, logout } = useAuth();

  const [prestador, setPrestador] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Extrai as iniciais do nome
  const getIniciais = (nome) => {
    if (!nome) return '';
    const partes = nome.trim().split(' ').filter(Boolean);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      setErro(null);

      try {
        // 1. Busca os dados do prestador
        const resPrestador = await api.get(`/prestadores/${id}`);
        setPrestador(resPrestador.data);

        // 2. Busca os posts do prestador (tenta endpoint específico ou filtra todos)
        try {
          const resPosts = await api.get(`/posts/prestador/${id}`);
          setPosts(resPosts.data || []);
        } catch {
          const resTodosPosts = await api.get('/posts');
          const postsFiltrados = (resTodosPosts.data || []).filter(
            (p) => p.prestador?.id === Number(id)
          );
          setPosts(postsFiltrados);
        }
      } catch (err) {
        console.error('Erro ao carregar perfil do prestador:', err);
        setErro('Não foi possível carregar os dados deste prestador.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      carregarDados();
    }
  }, [id]);

  const isUsuarioPrestador =
    usuario?.tipo?.toUpperCase() === 'PRESTADOR' || Boolean(usuario?.catServico);

  const ehProprioPerfil =
    isAutenticado &&
    isUsuarioPrestador &&
    prestador?.id &&
    Number(usuario?.id) === Number(prestador?.id);

  const handleConversar = () => {
    if (!isAutenticado) {
      navigate('/cadastro');
      return;
    }
    if (isUsuarioPrestador && usuario?.id === Number(id)) {
      toast({
        title: 'Atenção',
        description: 'Você não pode iniciar uma conversa consigo mesmo.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    // Abre a conversa com o prestador selecionado sem criar chat no banco antes do envio de mensagem
    navigate(`/chat/prestador/${id}`);
  };

  const handleAlterarDados = () => {
    navigate('/alterar-dados');
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu da sua conta com sucesso.',
      status: 'info',
      duration: 2500,
      isClosable: true,
      position: 'top',
    });
    navigate('/');
  };

  return (
    <Flex direction="column" minH="100vh" bg="vemfix.pageBg">
      <Header />

      <Box flex={1} py={{ base: 6, md: 8 }} px={4}>
        <Container maxW="740px" mx="auto">
          {/* Botão Voltar idêntico ao de Cadastro/Login */}
          <HStack
            as="button"
            onClick={() => navigate(-1)}
            spacing={2}
            color="vemfix.graySubtitle"
            _hover={{ color: 'vemfix.green' }}
            fontSize="14px"
            fontWeight="600"
            transition="color 0.2s"
            mb={5}
          >
            <FaArrowLeft />
            <Text>Voltar</Text>
          </HStack>

          {loading ? (
            <Flex justify="center" align="center" minH="300px" direction="column" gap={3}>
              <Spinner size="lg" color="vemfix.green" thickness="3px" />
              <Text fontSize="14px" color="vemfix.graySubtitle">
                Carregando perfil do prestador...
              </Text>
            </Flex>
          ) : erro || !prestador ? (
            <Box
              bg="white"
              p={8}
              borderRadius="16px"
              textAlign="center"
              border="1px solid"
              borderColor="vemfix.border"
            >
              <Text fontSize="16px" fontWeight="600" color="red.500" mb={3}>
                {erro || 'Prestador não encontrado.'}
              </Text>
              <Button
                size="sm"
                colorScheme="green"
                bg="vemfix.green"
                onClick={() => navigate('/')}
              >
                Voltar para o Feed
              </Button>
            </Box>
          ) : (
            <VStack spacing={5} align="stretch">
              {/* Banner do Perfil */}
              <Box
                bgGradient="linear(135deg, vemfix.green 0%, #158058 100%)"
                borderRadius="20px"
                p={{ base: 6, md: 7 }}
                color="white"
                boxShadow="0 4px 20px rgba(26, 158, 110, 0.2)"
              >
                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  align={{ base: 'center', sm: 'center' }}
                  justify="space-between"
                  gap={5}
                >
                  {/* Avatar + Informações */}
                  <HStack spacing={4} align="center" flex={1} textAlign={{ base: 'center', sm: 'left' }}>
                    {/* Avatar Circular com Iniciais */}
                    <Flex
                      w="68px"
                      h="68px"
                      minW="68px"
                      borderRadius="full"
                      border="3px solid rgba(255, 255, 255, 0.5)"
                      bg="rgba(255, 255, 255, 0.2)"
                      color="white"
                      fontSize="24px"
                      fontWeight="800"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      {getIniciais(prestador.nome)}
                    </Flex>

                    {/* Dados do Prestador */}
                    <Box flex={1}>
                      {/* Nome e Avaliação Lado a Lado */}
                      <HStack
                        spacing={2.5}
                        align="center"
                        justify={{ base: 'center', sm: 'flex-start' }}
                        flexWrap="wrap"
                      >
                        <Heading
                          as="h1"
                          fontSize={{ base: '20px', md: '24px' }}
                          fontWeight="800"
                          color="white"
                        >
                          {prestador.nome}
                        </Heading>
                        <HStack spacing={1} color="#FBBF24" fontSize="19px" fontWeight="800">
                          <Icon as={FaStar} />
                          <Text>{Number(prestador.avaliacao ?? 0).toFixed(1)}</Text>
                        </HStack>
                      </HStack>

                      {/* Categoria e Cidade Aumentadas e Sem Emojis */}
                      <Text
                        fontSize="15px"
                        fontWeight="500"
                        color="whiteAlpha.900"
                        mt={1}
                      >
                        {prestador.catServico || 'Prestador de Serviços'}
                        {prestador.cidade && ` • ${prestador.cidade}`}
                      </Text>
                    </Box>
                  </HStack>

                  {/* Botão Conversar (para outros usuários) ou Alterar dados (ao acessar o próprio perfil) */}
                  {!ehProprioPerfil ? (
                    <Button
                      onClick={handleConversar}
                      bg="white"
                      color="vemfix.green"
                      fontSize="15px"
                      fontWeight="700"
                      px={5}
                      py={2}
                      h="40px"
                      borderRadius="10px"
                      boxShadow="0 2px 6px rgba(0, 0, 0, 0.1)"
                      _hover={{ bg: 'gray.100', transform: 'scale(1.02)' }}
                      _active={{ bg: 'gray.200' }}
                      transition="all 0.2s"
                      flexShrink={0}
                    >
                      Conversar
                    </Button>
                  ) : (
                    <VStack spacing={2} align="stretch" flexShrink={0}>
                      <Button
                        onClick={handleAlterarDados}
                        bg="brand.700"
                        color="white"
                        fontSize="15px"
                        fontWeight="700"
                        px={5}
                        py={2}
                        h="40px"
                        borderRadius="10px"
                        border="1.5px solid rgba(255, 255, 255, 0.5)"
                        boxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
                        _hover={{ bg: 'brand.800', transform: 'scale(1.02)' }}
                        _active={{ bg: 'brand.900' }}
                        transition="all 0.2s"
                      >
                        Alterar dados
                      </Button>
                      <Button
                        onClick={handleLogout}
                        bg="orange.500"
                        color="white"
                        fontSize="14px"
                        fontWeight="700"
                        px={5}
                        py={2}
                        h="36px"
                        borderRadius="10px"
                        boxShadow="0 2px 6px rgba(0, 0, 0, 0.1)"
                        _hover={{ bg: 'orange.600', transform: 'scale(1.02)' }}
                        _active={{ bg: 'orange.700' }}
                        transition="all 0.2s"
                      >
                        Sair
                      </Button>
                    </VStack>
                  )}
                </Flex>
              </Box>

              {/* Seção Sobre */}
              <Box
                bg="white"
                borderRadius="16px"
                p={{ base: 5, md: 6 }}
                border="1px solid"
                borderColor="vemfix.border"
                boxShadow="0 2px 10px rgba(0, 0, 0, 0.03)"
              >
                <Heading as="h2" fontSize="16px" fontWeight="700" color="vemfix.dark" mb={2.5}>
                  Sobre
                </Heading>
                <Text
                  fontSize="14px"
                  color="vemfix.grayBody"
                  lineHeight="1.7"
                  whiteSpace="pre-line"
                >
                  {prestador.exp && prestador.exp.trim() !== ''
                    ? prestador.exp
                    : 'Este prestador ainda não adicionou uma descrição sobre seus serviços.'}
                </Text>
              </Box>

              {/* Seção Publicações */}
              <Box>
                <Heading as="h2" fontSize="18px" fontWeight="800" color="vemfix.dark" mb={4}>
                  Publicações ({posts.length})
                </Heading>

                {posts.length === 0 ? (
                  <Box
                    bg="white"
                    p={8}
                    borderRadius="16px"
                    textAlign="center"
                    border="1px solid"
                    borderColor="vemfix.border"
                  >
                    <Text fontSize="14px" color="vemfix.graySubtitle">
                      Nenhuma publicação realizada por este prestador ainda.
                    </Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </VStack>
                )}
              </Box>
            </VStack>
          )}
        </Container>
      </Box>

      <Footer />
    </Flex>
  );
}
