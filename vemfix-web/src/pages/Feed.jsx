import { useState } from 'react';
import { Box, VStack, Container } from '@chakra-ui/react';
import PostCard from '../components/PostCard';

export default function Feed() {
  // Estado inicial vazio aguardando o consumo da API
  const [posts, setPosts] = useState([]);

  return (
    <Box bg="vemfix.pageBg" minH="calc(100vh - 66px)" py={{ base: 6, md: 10 }}>
      <Container maxW="680px" px={{ base: 4, md: 0 }}>
        {/* Estrutura do feed pronta para receber e mapear os dados reais do banco */}
        <VStack spacing={6} align="stretch">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
