import { useState } from 'react';
import { Box, Flex, HStack, Text, Icon, Image, Button } from '@chakra-ui/react';
import { FaStar, FaHeart, FaCommentDots } from 'react-icons/fa';

export default function PostCard({ post }) {
  // Controle de estado puramente visual para interação de curtida
  const [curtido, setCurtido] = useState(false);
  const [curtidas, setCurtidas] = useState(post?.curtidas || 0);

  // Extrai iniciais do nome do prestador quando houver
  const getIniciais = (nome) => {
    if (!nome) return '';
    const partes = nome.trim().split(' ').filter(Boolean);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const prestador = post?.prestador;
  const nome = prestador?.nome;
  const categoria = prestador?.catServico;
  const cidade = prestador?.cidade;
  const avaliacao = prestador?.avaliacao != null ? prestador.avaliacao.toFixed(1) : null;

  const toggleCurtir = () => {
    if (curtido) {
      setCurtidas((prev) => prev - 1);
      setCurtido(false);
    } else {
      setCurtidas((prev) => prev + 1);
      setCurtido(true);
    }
  };

  return (
    <Box
      bg="vemfix.cardBg"
      border="1px solid"
      borderColor="vemfix.border"
      borderRadius="20px"
      p={{ base: 5, md: 6 }}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
      w="100%"
      transition="all 0.25s ease"
      _hover={{
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.07)',
        borderColor: 'brand.200',
      }}
    >
      {/* Topo do Card: Avatar, Dados do Prestador e Avaliação */}
      <Flex align="center" justify="space-between" mb={4}>
        <HStack spacing={3.5} align="center">
          {/* Avatar com iniciais reais */}
          {nome && (
            <Flex
              w="48px"
              h="48px"
              borderRadius="full"
              bg="vemfix.greenLight"
              color="vemfix.green"
              align="center"
              justify="center"
              fontFamily="heading"
              fontWeight="700"
              fontSize="15px"
              flexShrink={0}
              border="2px solid"
              borderColor="white"
              boxShadow="0 2px 6px rgba(26, 158, 110, 0.15)"
            >
              {getIniciais(nome)}
            </Flex>
          )}

          {/* Nome, Categoria e Cidade reais */}
          <Box>
            {nome && (
              <Text
                fontFamily="heading"
                fontWeight="700"
                fontSize={{ base: '15px', md: '16px' }}
                color="vemfix.dark"
                lineHeight="1.3"
              >
                {nome}
              </Text>
            )}
            {(categoria || cidade) && (
              <Text
                fontSize="13px"
                color="vemfix.graySubtitle"
                fontWeight="500"
                lineHeight="1.3"
              >
                {categoria}
                {categoria && cidade ? ' • ' : ''}
                {cidade}
              </Text>
            )}
          </Box>
        </HStack>

        {/* Avaliação com estrela dourada */}
        {avaliacao && (
          <HStack
            spacing={1.5}
            bg="#fffbeb"
            px={3}
            py={1.5}
            borderRadius="full"
            border="1px solid"
            borderColor="#fef3c7"
          >
            <Icon as={FaStar} color="vemfix.star" w={3.5} h={3.5} />
            <Text
              fontFamily="heading"
              fontSize="13px"
              fontWeight="700"
              color="#b45309"
            >
              {avaliacao}
            </Text>
          </HStack>
        )}
      </Flex>

      {/* Título ou Descrição do Post */}
      {post?.titulo && (
        <Text
          fontFamily="heading"
          fontWeight="600"
          fontSize="15px"
          color="vemfix.dark"
          mb={post.descricao ? 1 : 3}
        >
          {post.titulo}
        </Text>
      )}
      {post?.descricao && (
        <Text
          fontSize="14px"
          color="vemfix.grayBody"
          lineHeight="1.5"
          mb={3}
        >
          {post.descricao}
        </Text>
      )}

      {/* Área da Imagem / Anexo (renderiza apenas se o post tiver anexo real) */}
      {post?.anexo && (
        <Box
          w="100%"
          borderRadius="14px"
          overflow="hidden"
          bg="#eef2f6"
          border="1px solid"
          borderColor="#dde1e9"
          mb={4}
        >
          <Image
            src={post.anexo}
            alt={post.titulo || 'Anexo da publicação'}
            w="100%"
            maxH="420px"
            objectFit="cover"
          />
        </Box>
      )}

      {/* Rodapé do Card: Curtidas e Ações de Contato */}
      <Flex align="center" justify="space-between" mt={post?.anexo ? 0 : 4} pt={1}>
        {/* Botão de Curtida */}
        <HStack
          as="button"
          spacing={2}
          onClick={toggleCurtir}
          px={3.5}
          py={1.5}
          borderRadius="full"
          bg={curtido ? 'vemfix.heartLight' : 'gray.50'}
          color={curtido ? 'vemfix.heart' : 'vemfix.grayBody'}
          border="1px solid"
          borderColor={curtido ? 'red.200' : 'gray.200'}
          cursor="pointer"
          transition="all 0.2s ease"
          _hover={{
            bg: curtido ? 'red.100' : 'gray.100',
            transform: 'scale(1.03)',
          }}
          _active={{ transform: 'scale(0.97)' }}
        >
          <Icon
            as={FaHeart}
            color={curtido ? 'vemfix.heart' : 'vemfix.heart'}
            w={4}
            h={4}
          />
          <Text
            fontFamily="heading"
            fontSize="14px"
            fontWeight="700"
            color="vemfix.dark"
          >
            {curtidas.toLocaleString('pt-BR')}
          </Text>
        </HStack>

        {/* Botões de Ação */}
        <HStack spacing={2}>
          <Button
            size="sm"
            variant="ghost"
            color="vemfix.grayBody"
            fontSize="13px"
            fontWeight="600"
            _hover={{ bg: 'gray.100', color: 'vemfix.dark' }}
          >
            Ver perfil
          </Button>
          <Button
            size="sm"
            leftIcon={<FaCommentDots />}
            bg="vemfix.greenLight"
            color="vemfix.green"
            fontSize="13px"
            fontWeight="600"
            _hover={{ bg: 'vemfix.green', color: 'white' }}
            transition="0.2s"
          >
            Conversar
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
