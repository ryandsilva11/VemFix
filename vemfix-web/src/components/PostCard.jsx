import { useState, useEffect } from 'react';
import { Box, Flex, HStack, Text, Icon, Image, useToast } from '@chakra-ui/react';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAutenticado, usuario } = useAuth();

  const [curtido, setCurtido] = useState(Boolean(post?.curtido));
  const [curtidas, setCurtidas] = useState(post?.curtidas || 0);
  const [imagemErro, setImagemErro] = useState(false);
  const [loadingCurtida, setLoadingCurtida] = useState(false);

  // Mantém os estados sincronizados se as props do post mudarem (ao atualizar o feed)
  useEffect(() => {
    setCurtido(Boolean(post?.curtido));
    setCurtidas(post?.curtidas || 0);
  }, [post?.curtido, post?.curtidas]);

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
  const cep = prestador?.cep;
  const avaliacao = prestador?.avaliacao != null ? prestador.avaliacao.toFixed(1) : null;

  // Verifica se o anexo existe, não é o texto padrão "string" do Swagger e não falhou ao carregar
  const temAnexo =
    post?.anexo &&
    post.anexo.trim() !== '' &&
    post.anexo !== 'string' &&
    !imagemErro;

  // Clicar no perfil do prestador (abre o perfil mesmo sem estar logado)
  const handlePerfilPrestador = () => {
    if (prestador?.id) {
      navigate(`/prestador/${prestador.id}`);
    }
  };

  // Alterna entre curtir e descurtir o post na conta do usuário logado
  const toggleCurtir = async (e) => {
    e?.stopPropagation();

    if (!isAutenticado || !usuario) {
      navigate('/cadastro');
      return;
    }

    if (loadingCurtida || !post?.id) return;

    const tipoFinal = (
      usuario?.tipo ||
      (usuario?.catServico ? 'PRESTADOR' : 'CLIENTE')
    ).toUpperCase();

    // Alternância otimista imediata na interface
    const proximoCurtido = !curtido;
    const proximaQtd = proximoCurtido ? curtidas + 1 : Math.max(0, curtidas - 1);

    setCurtido(proximoCurtido);
    setCurtidas(proximaQtd);
    setLoadingCurtida(true);

    try {
      const response = await api.patch(
        `/posts/${post.id}`,
        {
          usuarioId: usuario.id,
          tipo: tipoFinal,
        },
        {
          params: {
            usuarioId: usuario.id,
            tipo: tipoFinal,
          },
        }
      );

      if (response.data) {
        if (response.data.curtidas != null) {
          setCurtidas(response.data.curtidas);
        }
        if (response.data.curtido != null) {
          setCurtido(Boolean(response.data.curtido));
        }

        // Sincroniza imediatamente com outras abas abertas no mesmo navegador
        try {
          const canal = new BroadcastChannel('vemfix_posts_channel');
          canal.postMessage({
            type: 'POST_ATUALIZADO',
            postId: post.id,
            curtidas: response.data.curtidas,
            curtidoPorUsuarioId: usuario.id,
            curtido: Boolean(response.data.curtido),
          });
          canal.close();
        } catch {
          // Ignora se BroadcastChannel não estiver disponível
        }
      }
    } catch (error) {
      console.error('Erro ao alternar curtida na API:', error);
      // Reverte alteração otimista em caso de erro na comunicação
      setCurtido(!proximoCurtido);
      setCurtidas(curtidas);
      toast({
        title: 'Erro',
        description:
          error.response?.data?.message ||
          'Não foi possível atualizar a curtida. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoadingCurtida(false);
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
      {/* Topo do Card: Avatar e Dados clicáveis do Prestador + Avaliação */}
      <Flex align="center" justify="space-between" mb={4}>
        <HStack
          as="button"
          onClick={handlePerfilPrestador}
          spacing={3.5}
          align="center"
          textAlign="left"
          cursor="pointer"
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.2s"
        >
          {/* Avatar com iniciais reais (agora botão clicável) */}
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
            {(categoria || cep) && (
              <Text
                fontSize="13px"
                color="vemfix.graySubtitle"
                fontWeight="500"
                lineHeight="1.3"
              >
                {categoria}
                {categoria && cep ? ' • ' : ''}
                {cep ? `CEP ${cep}` : ''}
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

      {/* Área da Imagem / Anexo (renderiza apenas se houver imagem válida e funcional) */}
      {temAnexo && (
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
            onError={() => setImagemErro(true)}
          />
        </Box>
      )}

      {/* Rodapé do Card: Apenas Curtidas (os botões 'Ver perfil' e 'Conversar' foram retirados) */}
      <Flex align="center" justify="flex-start" mt={temAnexo ? 0 : 4} pt={1}>
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
            color={curtido ? 'vemfix.heart' : 'gray.400'}
            w={4}
            h={4}
          />
          <Text
            fontFamily="heading"
            fontSize="14px"
            fontWeight="700"
            color={curtido ? 'red.600' : 'vemfix.dark'}
          >
            {curtidas.toLocaleString('pt-BR')}
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
}
