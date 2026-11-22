import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Conversas() {
  const navigate = useNavigate();
  const { isAutenticado, usuario } = useAuth();

  const [conversas, setConversas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Extrai as duas iniciais do nome
  const getIniciais = (nome) => {
    if (!nome) return '';
    const partes = nome.trim().split(' ').filter(Boolean);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  // Formata a data/hora para exibição
  const formatarHorario = (dataStr) => {
    if (!dataStr) return '';
    try {
      const data = new Date(dataStr);
      if (isNaN(data.getTime())) return '';

      const hoje = new Date();
      const ehHoje =
        data.getDate() === hoje.getDate() &&
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear();

      const hora = data.getHours().toString().padStart(2, '0');
      const min = data.getMinutes().toString().padStart(2, '0');

      if (ehHoje) {
        return `${hora}:${min}`;
      }

      const dia = data.getDate().toString().padStart(2, '0');
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      return `${dia}/${mes} ${hora}:${min}`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    let ativo = true;

    async function carregarConversas(mostrarSpinner = true) {
      if (!isAutenticado || !usuario?.id) {
        if (ativo) {
          setConversas([]);
          setCarregando(false);
        }
        return;
      }

      if (mostrarSpinner) {
        setCarregando(true);
      }

      try {
        const isPrestador =
          usuario?.tipo?.toUpperCase() === 'PRESTADOR' || Boolean(usuario?.catServico);

        // Busca lista de chats do usuário
        const endpoint = isPrestador
          ? `/chats/prestador/${usuario.id}`
          : `/chats/cliente/${usuario.id}`;

        const resChats = await api.get(endpoint).catch(() => ({ data: [] }));
        const listaChats = resChats.data || [];

        if (!ativo) return;

        if (listaChats.length === 0) {
          setConversas([]);
          if (mostrarSpinner) setCarregando(false);
          return;
        }

        // Para cada conversa, busca as mensagens para obter a última mensagem real
        const conversasFormatadas = await Promise.all(
          listaChats.map(async (chat) => {
            let outroUsuarioNome = '';
            let outroUsuarioTipo = 'cliente';
            let catServico = '';

            if (!isPrestador) {
              // Usuário logado é Cliente comum
              outroUsuarioNome = chat.prestadorNome;
              outroUsuarioTipo = 'prestador';
              catServico = chat.prestadorCatServico || '';
            } else {
              // Usuário logado é Prestador
              if (chat.prestadorId === usuario.id) {
                // Eu sou o prestador contratado neste chat
                if (chat.solicitanteTipo === 'PRESTADOR') {
                  outroUsuarioNome = chat.prestadorSolicitanteNome || chat.clienteNome;
                  outroUsuarioTipo = 'prestador';
                  catServico = chat.prestadorSolicitanteCatServico || '';
                } else {
                  outroUsuarioNome = chat.clienteNome;
                  outroUsuarioTipo = 'cliente';
                  catServico = '';
                }
              } else {
                // Eu sou o solicitante (contratei outro prestador)
                outroUsuarioNome = chat.prestadorNome;
                outroUsuarioTipo = 'prestador';
                catServico = chat.prestadorCatServico || '';
              }
            }

            let temMensagens = false;
            let ultimaMensagemTexto = '';
            let horario = '';

            try {
              const resMsg = await api.get(`/mensagens/${chat.id}`);
              const mensagens = resMsg.data || [];
              if (mensagens.length > 0) {
                temMensagens = true;
                const ultimaMsg = mensagens[mensagens.length - 1];
                ultimaMensagemTexto = ultimaMsg.conteudo || '';
                horario = formatarHorario(ultimaMsg.dataEnvio);
              }
            } catch {
              // Mantém o fallback caso o endpoint de mensagens não retorne
            }

            return {
              id: chat.id,
              outroUsuarioNome,
              outroUsuarioTipo,
              catServico,
              ultimaMensagemTexto,
              horario,
              temMensagens,
            };
          })
        );

        if (!ativo) return;

        // Regra: Só exibe na lista conversas que possuem pelo menos uma mensagem enviada/recebida
        const conversasComMensagens = conversasFormatadas.filter((c) => c.temMensagens);
        setConversas(conversasComMensagens);
      } catch (err) {
        console.error('Erro ao carregar conversas:', err);
        if (ativo) setConversas([]);
      } finally {
        if (ativo && mostrarSpinner) {
          setCarregando(false);
        }
      }
    }

    // Carregamento inicial com indicador
    carregarConversas(true);

    // Polling silencioso em tempo real a cada 3.5 segundos
    const interval = setInterval(() => {
      carregarConversas(false);
    }, 3500);

    return () => {
      ativo = false;
      clearInterval(interval);
    };
  }, [isAutenticado, usuario]);

  return (
    <Flex direction="column" minH="100vh" bg="vemfix.pageBg">
      <Header />

      {/* Regra de Ouro: Inicialmente essa tela será 100% vazia, apenas com o header e o footer.
          Ela só irá ter algum conteúdo a partir do momento em que o usuário tiver alguma conversa. */}
      {conversas.length > 0 ? (
        <Box flex={1} py={{ base: 6, md: 8 }} px={4}>
          <Container maxW="740px" mx="auto">
            <Heading as="h1" fontSize="26px" fontWeight="800" color="vemfix.dark" mb={6}>
              Conversas
            </Heading>

            <VStack spacing={3} align="stretch">
              {conversas.map((c) => (
                <Box
                  key={c.id}
                  bg="white"
                  p={{ base: 3.5, md: 4 }}
                  borderRadius="14px"
                  border="1px solid"
                  borderColor="vemfix.border"
                  boxShadow="0 1px 3px rgba(0, 0, 0, 0.02)"
                  _hover={{
                    borderColor: 'vemfix.green',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s ease"
                  cursor="pointer"
                  onClick={() => navigate(`/chat/${c.id}`)}
                >
                  <Flex align="center" gap={3.5}>
                    {/* Foto de perfil (Avatar com iniciais) */}
                    <Flex
                      w="44px"
                      h="44px"
                      minW="44px"
                      borderRadius="full"
                      bg={c.outroUsuarioTipo === 'prestador' ? 'vemfix.greenLight' : 'blue.50'}
                      color={c.outroUsuarioTipo === 'prestador' ? 'vemfix.green' : 'blue.600'}
                      fontWeight="800"
                      fontSize="14px"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      {getIniciais(c.outroUsuarioNome)}
                    </Flex>

                    {/* Informações da conversa */}
                    <Box flex={1} minW={0}>
                      {/* Linha 1: Nome + Tag + Categoria (se houver) */}
                      <HStack spacing={2} align="center" flexWrap="nowrap" overflow="hidden">
                        <Text
                          fontSize="14px"
                          fontWeight="700"
                          color="vemfix.dark"
                          whiteSpace="nowrap"
                        >
                          {c.outroUsuarioNome}
                        </Text>

                        {c.outroUsuarioTipo === 'prestador' ? (
                          <HStack
                            spacing={1.5}
                            fontSize="12px"
                            color="vemfix.graySubtitle"
                            whiteSpace="nowrap"
                            align="center"
                          >
                            <Text color="vemfix.green" fontWeight="600">
                              Prestador
                            </Text>
                            {c.catServico && (
                              <>
                                <Text color="gray.300">•</Text>
                                <Text>{c.catServico}</Text>
                              </>
                            )}
                          </HStack>
                        ) : (
                          <HStack
                            spacing={1.5}
                            fontSize="12px"
                            color="vemfix.graySubtitle"
                            whiteSpace="nowrap"
                            align="center"
                          >
                            <Text color="blue.600" fontWeight="600">
                              Cliente
                            </Text>
                          </HStack>
                        )}
                      </HStack>

                      {/* Linha 2: Última mensagem enviada ou recebida */}
                      <Text
                        fontSize="13px"
                        color="vemfix.grayBody"
                        mt={0.5}
                        noOfLines={1}
                        isTruncated
                      >
                        {c.ultimaMensagemTexto}
                      </Text>

                      {/* Linha 3: Horário de envio */}
                      {c.horario && (
                        <Text fontSize="11px" color="vemfix.graySubtitle" mt={0.5}>
                          {c.horario}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Container>
        </Box>
      ) : (
        <Box flex={1} />
      )}

      <Footer />
    </Flex>
  );
}
