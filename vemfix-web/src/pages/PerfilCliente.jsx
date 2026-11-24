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
  Badge,
  Button,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function PerfilCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAutenticado, usuario, logout } = useAuth();

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const isUsuarioCliente =
    usuario?.tipo?.toUpperCase() === 'CLIENTE' || (!usuario?.catServico && Boolean(usuario?.id));

  const ehProprioPerfil =
    isAutenticado &&
    isUsuarioCliente &&
    cliente?.id &&
    Number(usuario?.id) === Number(cliente?.id);

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

  // Extrai as iniciais do nome
  const getIniciais = (nome) => {
    if (!nome) return '';
    const partes = nome.trim().split(' ').filter(Boolean);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    async function carregarCliente() {
      setLoading(true);
      setErro(null);

      try {
        const response = await api.get(`/clientes/${id}`);
        setCliente(response.data);
      } catch (err) {
        console.error('Erro ao carregar perfil do cliente:', err);
        setErro('Não foi possível carregar os dados deste cliente.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      carregarCliente();
    }
  }, [id]);

  return (
    <Flex direction="column" minH="100vh" bg="vemfix.pageBg">
      <Header />

      <Box flex={1} py={{ base: 6, md: 8 }} px={4}>
        <Container maxW="740px" mx="auto">
          {/* Botão Voltar */}
          <HStack
            as="button"
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            spacing={2}
            color="vemfix.graySubtitle"
            _hover={{ color: 'blue.600' }}
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
              <Spinner size="lg" color="blue.500" thickness="3px" />
              <Text fontSize="14px" color="vemfix.graySubtitle">
                Carregando perfil do cliente...
              </Text>
            </Flex>
          ) : erro || !cliente ? (
            <Box
              bg="white"
              p={8}
              borderRadius="16px"
              textAlign="center"
              border="1px solid"
              borderColor="vemfix.border"
            >
              <Text fontSize="16px" fontWeight="600" color="red.500" mb={3}>
                {erro || 'Cliente não encontrado.'}
              </Text>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => navigate('/')}
              >
                Voltar para o Feed
              </Button>
            </Box>
          ) : (
            <VStack spacing={5} align="stretch">
              {/* Banner do Perfil do Cliente com Tema Azul */}
              <Box
                bgGradient="linear(135deg, blue.500 0%, blue.700 100%)"
                borderRadius="20px"
                p={{ base: 6, md: 7 }}
                color="white"
                boxShadow="0 4px 20px rgba(37, 99, 235, 0.2)"
              >
                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  align="center"
                  gap={5}
                  textAlign={{ base: 'center', sm: 'left' }}
                >
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
                    {getIniciais(cliente.nome)}
                  </Flex>

                  {/* Dados Básicos: Nome e Cidade */}
                  <Box flex={1}>
                    <HStack
                      spacing={3}
                      align="center"
                      justify={{ base: 'center', sm: 'flex-start' }}
                      flexWrap="wrap"
                    >
                      <Heading
                        as="h1"
                        fontSize={{ base: '22px', md: '26px' }}
                        fontWeight="800"
                        color="white"
                      >
                        {cliente.nome}
                      </Heading>
                      <Badge
                        bg="whiteAlpha.300"
                        color="white"
                        borderRadius="full"
                        px={2.5}
                        py={0.5}
                        fontSize="11px"
                        fontWeight="700"
                        textTransform="none"
                      >
                        Cliente
                      </Badge>
                    </HStack>

                    {/* CEP do Cliente */}
                    {cliente.cep && (
                      <Text
                        fontSize="15px"
                        fontWeight="500"
                        color="whiteAlpha.900"
                        mt={1.5}
                      >
                        CEP: {cliente.cep}
                      </Text>
                    )}
                  </Box>

                  {/* Botões do próprio perfil: Alterar dados e Sair */}
                  {ehProprioPerfil && (
                    <VStack spacing={2} align="stretch" flexShrink={0}>
                      <Button
                        onClick={handleAlterarDados}
                        bg="blue.800"
                        color="white"
                        fontSize="15px"
                        fontWeight="700"
                        px={5}
                        py={2}
                        h="40px"
                        borderRadius="10px"
                        border="1.5px solid rgba(255, 255, 255, 0.5)"
                        boxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
                        _hover={{ bg: 'blue.900', transform: 'scale(1.02)' }}
                        _active={{ bg: 'blue.950' }}
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

              {/* Card de Avaliações Futuras */}
              <Box
                bg="white"
                borderRadius="16px"
                p={{ base: 6, md: 8 }}
                border="1px solid"
                borderColor="vemfix.border"
                boxShadow="0 2px 10px rgba(0, 0, 0, 0.03)"
                textAlign="center"
              >
                <Heading as="h2" fontSize="16px" fontWeight="700" color="vemfix.dark" mb={1.5}>
                  Avaliações Realizadas
                </Heading>
                <Text fontSize="13px" color="vemfix.graySubtitle">
                  As avaliações e opiniões enviadas por {cliente.nome?.split(' ')[0]} sobre os serviços contratados serão exibidas aqui.
                </Text>
              </Box>
            </VStack>
          )}
        </Container>
      </Box>

      <Footer />
    </Flex>
  );
}
