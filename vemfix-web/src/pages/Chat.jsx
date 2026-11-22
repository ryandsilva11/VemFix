import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Input,
  IconButton,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FaArrowLeft, FaPaperPlane, FaPaperclip, FaDollarSign } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Chat() {
  const navigate = useNavigate();
  const { chatId, prestadorId } = useParams();
  const { isAutenticado, usuario } = useAuth();
  const toast = useToast();

  const [outroUsuario, setOutroUsuario] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(chatId || null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const messagesEndRef = useRef(null);

  const isPrestador =
    usuario?.tipo?.toUpperCase() === 'PRESTADOR' || Boolean(usuario?.catServico);

  // Extrai as duas iniciais do nome
  const getIniciais = (nome) => {
    if (!nome) return '';
    const partes = nome.trim().split(' ').filter(Boolean);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  // Formata hora no padrão HH:mm
  const formatarHorario = (dataStr) => {
    if (!dataStr) return '';
    try {
      const data = new Date(dataStr);
      if (isNaN(data.getTime())) return '';
      const hora = data.getHours().toString().padStart(2, '0');
      const min = data.getMinutes().toString().padStart(2, '0');
      return `${hora}:${min}`;
    } catch {
      return '';
    }
  };

  // Rola até o final das mensagens
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [mensagens]);

  // Carrega os dados da conversa ou do prestador selecionado
  useEffect(() => {
    async function carregarDados() {
      if (!isAutenticado || !usuario?.id) {
        navigate('/cadastro');
        return;
      }

      setCarregando(true);

      try {
        if (chatId) {
          // Caso 1: Acessou direto por ID do chat existente (ex: vindo da lista de conversas)
          setCurrentChatId(chatId);
          const resChat = await api.get(`/chats/${chatId}`);
          const chat = resChat.data;

          const souCliente = usuario.id === chat.clienteId;
          const outroId = souCliente ? chat.prestadorId : chat.clienteId;
          const outroNome = souCliente ? chat.prestadorNome : chat.clienteNome;
          const outroTipo = souCliente ? 'prestador' : 'cliente';
          let catServico = chat.prestadorCatServico || '';

          if (souCliente && !catServico && outroId) {
            try {
              const resP = await api.get(`/prestadores/${outroId}`);
              catServico = resP.data?.catServico || '';
            } catch {
              catServico = '';
            }
          }

          setOutroUsuario({
            id: outroId,
            nome: outroNome,
            tipo: outroTipo,
            catServico,
          });

          // Busca mensagens existentes
          const resMsg = await api.get(`/mensagens/${chatId}`);
          const msgsFormatadas = (resMsg.data || []).map((m) => ({
            id: m.id,
            remetenteTipo: m.remetenteTipo,
            conteudo: m.conteudo,
            horario: formatarHorario(m.dataEnvio),
          }));
          setMensagens(msgsFormatadas);
        } else if (prestadorId) {
          // Caso 2: Clicou em "Conversar" no perfil do prestador
          // 1. Busca dados do prestador
          const resP = await api.get(`/prestadores/${prestadorId}`);
          const dadosPrestador = resP.data;

          setOutroUsuario({
            id: dadosPrestador.id,
            nome: dadosPrestador.nome,
            tipo: 'prestador',
            catServico: dadosPrestador.catServico || '',
          });

          // 2. Verifica se JÁ existe conversa entre o cliente atual e este prestador
          try {
            const endpoint = isPrestador
              ? `/chats/prestador/${usuario.id}`
              : `/chats/cliente/${usuario.id}`;
            const resChats = await api.get(endpoint);
            const chatExistente = (resChats.data || []).find(
              (c) => c.prestadorId === Number(prestadorId)
            );

            if (chatExistente) {
              setCurrentChatId(chatExistente.id);
              const resMsg = await api.get(`/mensagens/${chatExistente.id}`);
              const msgsFormatadas = (resMsg.data || []).map((m) => ({
                id: m.id,
                remetenteTipo: m.remetenteTipo,
                conteudo: m.conteudo,
                horario: formatarHorario(m.dataEnvio),
              }));
              setMensagens(msgsFormatadas);
            } else {
              // Não existe chat ainda: NÃO cria no banco agora!
              // Só criará quando o usuário enviar a primeira mensagem.
              setCurrentChatId(null);
              setMensagens([]);
            }
          } catch {
            setCurrentChatId(null);
            setMensagens([]);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar conversa:', err);
        toast({
          title: 'Erro ao carregar conversa',
          description: 'Não foi possível carregar os dados desta conversa.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [chatId, prestadorId, isAutenticado, usuario, navigate, isPrestador, toast]);

  // Polling em tempo real: busca novas mensagens a cada 2 segundos sem recarregar a tela
  useEffect(() => {
    if (!currentChatId) return;

    let ativo = true;

    const buscarNovasMensagens = async () => {
      try {
        const resMsg = await api.get(`/mensagens/${currentChatId}`);
        if (!ativo) return;

        const msgs = resMsg.data || [];
        setMensagens((prevMsgs) => {
          if (msgs.length !== prevMsgs.length) {
            return msgs.map((m) => ({
              id: m.id,
              remetenteTipo: m.remetenteTipo,
              conteudo: m.conteudo,
              horario: formatarHorario(m.dataEnvio),
            }));
          }
          return prevMsgs;
        });
      } catch {
        // Silencioso durante o polling em segundo plano
      }
    };

    const interval = setInterval(buscarNovasMensagens, 2000);

    return () => {
      ativo = false;
      clearInterval(interval);
    };
  }, [currentChatId]);

  // Caso esteja na tela de um prestador antes de enviar a 1ª mensagem,
  // detecta se o prestador respondeu ou iniciou o chat
  useEffect(() => {
    if (currentChatId || !prestadorId || !usuario?.id) return;

    let ativo = true;

    const checarSeChatFoiCriado = async () => {
      try {
        const endpoint = isPrestador
          ? `/chats/prestador/${usuario.id}`
          : `/chats/cliente/${usuario.id}`;
        const resChats = await api.get(endpoint);
        if (!ativo) return;

        const chatExistente = (resChats.data || []).find(
          (c) =>
            (isPrestador && c.clienteId === Number(prestadorId)) ||
            (!isPrestador && c.prestadorId === Number(prestadorId))
        );

        if (chatExistente) {
          setCurrentChatId(chatExistente.id);
        }
      } catch {
        // Silencioso
      }
    };

    const interval = setInterval(checarSeChatFoiCriado, 2500);

    return () => {
      ativo = false;
      clearInterval(interval);
    };
  }, [currentChatId, prestadorId, usuario, isPrestador]);

  // Envio de nova mensagem
  const handleEnviarMensagem = async (e) => {
    if (e) e.preventDefault();
    const texto = novaMensagem.trim();
    if (!texto || enviando) return;

    setEnviando(true);
    try {
      let idChatAtual = currentChatId;

      // Se a conversa ainda não foi criada no banco, cria agora na primeira mensagem!
      if (!idChatAtual) {
        const clienteId = isPrestador ? outroUsuario.id : usuario.id;
        const pId = isPrestador ? usuario.id : outroUsuario.id;

        const resChat = await api.post('/chats', {
          clienteId,
          prestadorId: pId,
        });
        idChatAtual = resChat.data.id;
        setCurrentChatId(idChatAtual);
      }

      // Envia a mensagem no chat
      const remetenteTipo = isPrestador ? 'PRESTADOR' : 'CLIENTE';
      const resMsg = await api.post(`/mensagens/${idChatAtual}`, {
        remetenteTipo,
        conteudo: texto,
      });

      const nova = {
        id: resMsg.data.id,
        remetenteTipo: resMsg.data.remetenteTipo,
        conteudo: resMsg.data.conteudo,
        horario: formatarHorario(resMsg.data.dataEnvio),
      };

      setMensagens((prev) => [...prev, nova]);
      setNovaMensagem('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      toast({
        title: 'Erro ao enviar mensagem',
        description: 'Não foi possível enviar sua mensagem. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Flex direction="column" minH="100vh" bg="vemfix.pageBg">
      <Header />

      <Flex justify="center" flex={1}>
        <Box
          w="100%"
          maxW="740px"
          h="calc(100vh - 66px)"
          display="flex"
          flexDirection="column"
          bg="white"
          borderLeft={{ base: 'none', md: '1px solid' }}
          borderRight={{ base: 'none', md: '1px solid' }}
          borderColor="vemfix.border"
        >
          {/* Topo da Conversa (Chat Header) */}
          <Flex
            align="center"
            gap={3}
            px={{ base: 3.5, md: 4 }}
            py={3}
            borderBottom="1px solid"
            borderColor="vemfix.border"
            bg="white"
            flexShrink={0}
          >
            {/* Botão de Voltar */}
            <IconButton
              aria-label="Voltar"
              icon={<FaArrowLeft />}
              variant="ghost"
              size="sm"
              color="gray.400"
              _hover={{ color: 'vemfix.green', bg: 'gray.50' }}
              onClick={() => navigate(-1)}
            />

            {/* Avatar do outro usuário */}
            <Flex
              w="38px"
              h="38px"
              minW="38px"
              borderRadius="full"
              bg={outroUsuario?.tipo === 'prestador' ? 'vemfix.greenLight' : 'blue.50'}
              color={outroUsuario?.tipo === 'prestador' ? 'vemfix.green' : 'blue.600'}
              fontWeight="800"
              fontSize="13px"
              align="center"
              justify="center"
              flexShrink={0}
            >
              {getIniciais(outroUsuario?.nome)}
            </Flex>

            {/* Informações: Nome + Tag + Categoria (logo após o nome, sem 'Online') */}
            <HStack spacing={2} align="center" flexWrap="nowrap" overflow="hidden">
              <Text
                fontSize="14.5px"
                fontWeight="700"
                color="vemfix.dark"
                whiteSpace="nowrap"
              >
                {outroUsuario?.nome || 'Carregando...'}
              </Text>

              {outroUsuario?.tipo === 'prestador' ? (
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
                  {outroUsuario.catServico && (
                    <>
                      <Text color="gray.300">•</Text>
                      <Text>{outroUsuario.catServico}</Text>
                    </>
                  )}
                </HStack>
              ) : outroUsuario?.tipo === 'cliente' ? (
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
              ) : null}
            </HStack>
          </Flex>

          {/* Área das Mensagens */}
          <Box
            flex={1}
            overflowY="auto"
            p={{ base: 4, md: 5 }}
            bg="vemfix.pageBg"
            display="flex"
            flexDirection="column"
            gap={3}
          >
            {carregando ? (
              <Flex justify="center" align="center" h="100%">
                <Spinner size="md" color="vemfix.green" />
              </Flex>
            ) : mensagens.length === 0 ? (
              <Flex justify="center" align="center" h="100%">
                <Text fontSize="13px" color="vemfix.graySubtitle">
                  Inicie a conversa enviando uma mensagem abaixo.
                </Text>
              </Flex>
            ) : (
              mensagens.map((msg, index) => {
                const ehMinha =
                  (isPrestador && msg.remetenteTipo?.toUpperCase() === 'PRESTADOR') ||
                  (!isPrestador && msg.remetenteTipo?.toUpperCase() === 'CLIENTE');

                return (
                  <Box
                    key={msg.id || index}
                    alignSelf={ehMinha ? 'flex-end' : 'flex-start'}
                    maxW={{ base: '82%', sm: '75%' }}
                  >
                    <Box
                      bg={ehMinha ? 'vemfix.green' : 'white'}
                      color={ehMinha ? 'white' : 'vemfix.dark'}
                      px={3.5}
                      py={2.5}
                      borderRadius={
                        ehMinha
                          ? '14px 4px 14px 14px'
                          : '4px 14px 14px 14px'
                      }
                      boxShadow="0 1px 3px rgba(0, 0, 0, 0.05)"
                      fontSize="13.5px"
                      lineHeight="1.5"
                      wordBreak="break-word"
                    >
                      {msg.conteudo}
                    </Box>
                    {msg.horario && (
                      <Text
                        fontSize="10px"
                        color="vemfix.graySubtitle"
                        mt={1}
                        px={1}
                        textAlign={ehMinha ? 'right' : 'left'}
                      >
                        {msg.horario}
                      </Text>
                    )}
                  </Box>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Barra de Entrada de Mensagem */}
          <Flex
            as="form"
            onSubmit={handleEnviarMensagem}
            align="center"
            gap={2}
            p={{ base: 3, md: 3.5 }}
            bg="white"
            borderTop="1px solid"
            borderColor="vemfix.border"
            flexShrink={0}
          >
            <Input
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              placeholder="Digite sua mensagem..."
              borderRadius="full"
              bg="gray.50"
              border="1px solid"
              borderColor="vemfix.border"
              fontSize="13px"
              h="38px"
              _hover={{ borderColor: 'gray.300', bg: 'white' }}
              _focus={{
                bg: 'white',
                borderColor: 'vemfix.green',
                boxShadow: '0 0 0 1px #1A9E6E',
              }}
            />

            <IconButton
              aria-label="Anexar arquivo"
              icon={<FaPaperclip size={14} />}
              variant="ghost"
              borderRadius="full"
              w="36px"
              h="36px"
              minW="36px"
              color="gray.500"
              _hover={{ bg: 'gray.100', color: 'vemfix.green' }}
              onClick={() =>
                toast({
                  title: 'Anexo',
                  description: 'Envio de anexos estará disponível em breve.',
                  status: 'info',
                  duration: 2500,
                  isClosable: true,
                })
              }
            />

            <IconButton
              aria-label="Orçamento"
              icon={<FaDollarSign size={14} />}
              variant="ghost"
              borderRadius="full"
              w="36px"
              h="36px"
              minW="36px"
              color="gray.500"
              _hover={{ bg: 'gray.100', color: 'vemfix.green' }}
              onClick={() =>
                toast({
                  title: 'Orçamento',
                  description: 'Funcionalidade de orçamento estará disponível em breve.',
                  status: 'info',
                  duration: 2500,
                  isClosable: true,
                })
              }
            />

            <IconButton
              aria-label="Enviar"
              type="submit"
              icon={<FaPaperPlane size={13} />}
              bg="vemfix.green"
              color="white"
              borderRadius="full"
              w="36px"
              h="36px"
              minW="36px"
              _hover={{ bg: 'vemfix.greenDark', transform: 'scale(1.05)' }}
              _active={{ bg: 'vemfix.greenDark' }}
              isDisabled={!novaMensagem.trim() || enviando}
              isLoading={enviando}
              transition="all 0.2s"
            />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
