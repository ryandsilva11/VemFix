import { useState, useEffect } from 'react';
import { Box, VStack, Container, Spinner, Center, Text, Alert, AlertIcon } from '@chakra-ui/react';
import PostCard from '../components/PostCard';
import api from '../services/api';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Executa uma vez assim que a tela de Feed é montada no navegador
  useEffect(() => {
    carregarPosts();
  }, []);

  const carregarPosts = async () => {
    try {
      setLoading(true);
      setErro(null);

      // Chamada GET para http://localhost:8080/posts
      const response = await api.get('/posts');
      setPosts(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar posts da API:', error);
      setErro('Não foi possível conectar com o servidor. Verifique se o backend está ligado na porta 8080.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="vemfix.pageBg" minH="calc(100vh - 66px)" py={{ base: 6, md: 10 }}>
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
    </Box>
  );
}
