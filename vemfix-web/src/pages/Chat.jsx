import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Input,
  IconButton,
  Button,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaPaperclip,
  FaDollarSign,
  FaFilePdf,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import OrcamentoModal from '../components/OrcamentoModal';
import OrcamentoCard from '../components/OrcamentoCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Chat() {
  const navigate = useNavigate();
  const { chatId, prestadorId } = useParams();
  const { isAutenticado, usuario } = useAuth();
  const toast = useToast();

  const [outroUsuario, setOutroUsuario] = useState(null);
  const [chatDados, setChatDados] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(chatId || null);
  const [mensagens, setMensagens] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Estados do Modal de Orçamento
  const [isOrcamentoModalOpen, setIsOrcamentoModalOpen] = useState(false);
  const [modoModalOrcamento, setModoModalOrcamento] = useState('elaborar');
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);

  const messagesEndRef = useRef(null);

  const isPrestador =
    usuario?.tipo?.toUpperCase() === 'PRESTADOR' || Boolean(usuario?.catServico);

  // Define se o usuário atual é o prestador contratado/procurado nesta conversa específica
  const souPrestadorDoChat = chatDados ? usuario?.id === chatDados.prestadorId : false;

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
  }, [mensagens, orcamentos]);

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
          setChatDados(chat);

          const euSouPrestador = usuario.id === chat.prestadorId;
          let outroId, outroNome, outroTipo, catServico, outroCep;

          if (euSouPrestador) {
            // Eu sou o prestador contratado; o outro usuário é quem solicitou o serviço
            if (chat.solicitanteTipo === 'PRESTADOR') {
              outroId = chat.prestadorSolicitanteId;
              outroNome = chat.prestadorSolicitanteNome || chat.clienteNome;
              outroTipo = 'prestador';
              catServico = chat.prestadorSolicitanteCatServico || '';
              outroCep = chat.clienteCep || '';
            } else {
              outroId = chat.clienteId;
              outroNome = chat.clienteNome;
              outroTipo = 'cliente';
              catServico = '';
              outroCep = chat.clienteCep || '';
            }
          } else {
            // Eu sou o solicitante (seja cliente ou prestador solicitante)
            outroId = chat.prestadorId;
            outroNome = chat.prestadorNome;
            outroTipo = 'prestador';
            catServico = chat.prestadorCatServico || '';
            outroCep = chat.clienteCep || '';
          }

          setOutroUsuario({
            id: outroId,
            nome: outroNome,
            tipo: outroTipo,
            catServico,
            cep: outroCep,
          });

          // Busca mensagens existentes
          const resMsg = await api.get(`/mensagens/${chatId}`);
          const msgsFormatadas = (resMsg.data || []).map((m) => ({
            id: m.id,
            remetenteTipo: m.remetenteTipo,
            conteudo: m.conteudo,
            dataEnvio: m.dataEnvio,
            horario: formatarHorario(m.dataEnvio),
          }));
          setMensagens(msgsFormatadas);

          // Busca orçamentos existentes desta conversa
          try {
            const resOrc = await api.get(`/orcamentos/chat/${chatId}`);
            setOrcamentos(resOrc.data || []);
          } catch {
            setOrcamentos([]);
          }
        } else if (prestadorId) {
          // Caso 2: Clicou em "Conversar" no perfil de um prestador
          // 1. Busca dados do prestador procurado
          const resP = await api.get(`/prestadores/${prestadorId}`);
          const dadosPrestador = resP.data;

          setOutroUsuario({
            id: dadosPrestador.id,
            nome: dadosPrestador.nome,
            tipo: 'prestador',
            catServico: dadosPrestador.catServico || '',
            cep: dadosPrestador.cep || '',
          });

          // 2. Verifica se JÁ existe conversa entre este usuário e este prestador
          try {
            const endpoint = isPrestador
              ? `/chats/prestador/${usuario.id}`
              : `/chats/cliente/${usuario.id}`;
            const resChats = await api.get(endpoint);
            const chatExistente = (resChats.data || []).find((c) => {
              if (isPrestador) {
                return (
                  c.prestadorSolicitanteId === usuario.id &&
                  c.prestadorId === Number(prestadorId)
                );
              }
              return (
                c.clienteId === usuario.id &&
                c.prestadorId === Number(prestadorId)
              );
            });

            if (chatExistente) {
              setChatDados(chatExistente);
              setCurrentChatId(chatExistente.id);
              const resMsg = await api.get(`/mensagens/${chatExistente.id}`);
              const msgsFormatadas = (resMsg.data || []).map((m) => ({
                id: m.id,
                remetenteTipo: m.remetenteTipo,
                conteudo: m.conteudo,
                dataEnvio: m.dataEnvio,
                horario: formatarHorario(m.dataEnvio),
              }));
              setMensagens(msgsFormatadas);

              // Busca orçamentos do chat existente
              try {
                const resOrc = await api.get(`/orcamentos/chat/${chatExistente.id}`);
                setOrcamentos(resOrc.data || []);
              } catch {
                setOrcamentos([]);
              }
            } else {
              setChatDados(null);
              setCurrentChatId(null);
              setMensagens([]);
              setOrcamentos([]);
            }
          } catch {
            setChatDados(null);
            setCurrentChatId(null);
            setMensagens([]);
            setOrcamentos([]);
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

  // Polling em tempo real: busca novas mensagens e orçamentos a cada 2.5 segundos
  useEffect(() => {
    if (!currentChatId) return;

    let ativo = true;

    const buscarNovasMensagensEOrcamentos = async () => {
      try {
        const [resMsg, resOrc] = await Promise.all([
          api.get(`/mensagens/${currentChatId}`),
          api.get(`/orcamentos/chat/${currentChatId}`).catch(() => ({ data: [] })),
        ]);

        if (!ativo) return;

        const msgs = resMsg.data || [];
        setMensagens((prevMsgs) => {
          if (msgs.length !== prevMsgs.length) {
            return msgs.map((m) => ({
              id: m.id,
              remetenteTipo: m.remetenteTipo,
              conteudo: m.conteudo,
              dataEnvio: m.dataEnvio,
              horario: formatarHorario(m.dataEnvio),
            }));
          }
          return prevMsgs;
        });

        const orcs = resOrc.data || [];
        setOrcamentos((prevOrcs) => {
          if (orcs.length !== prevOrcs.length) {
            return orcs;
          }
          return prevOrcs;
        });
      } catch {
        // Silencioso durante o polling em segundo plano
      }
    };

    const interval = setInterval(buscarNovasMensagensEOrcamentos, 2500);

    return () => {
      ativo = false;
      clearInterval(interval);
    };
  }, [currentChatId]);

  // Envio de nova mensagem de texto
  const handleEnviarMensagem = async (e) => {
    if (e) e.preventDefault();
    const texto = novaMensagem.trim();
    if (!texto || enviando) return;

    setEnviando(true);
    try {
      let idChatAtual = currentChatId;
      let dadosDoChat = chatDados;

      // Se a conversa ainda não foi criada no banco, cria agora na primeira mensagem!
      if (!idChatAtual) {
        let payload = {};
        if (isPrestador) {
          payload = {
            prestadorSolicitanteId: usuario.id,
            prestadorId: outroUsuario.id,
          };
        } else {
          payload = {
            clienteId: usuario.id,
            prestadorId: outroUsuario.id,
          };
        }

        const resChat = await api.post('/chats', payload);
        dadosDoChat = resChat.data;
        idChatAtual = resChat.data.id;
        setChatDados(dadosDoChat);
        setCurrentChatId(idChatAtual);
      }

      const souPrestadorNesteChat = dadosDoChat ? usuario.id === dadosDoChat.prestadorId : false;
      const remetenteTipo = souPrestadorNesteChat ? 'PRESTADOR' : 'CLIENTE';

      const resMsg = await api.post(`/mensagens/${idChatAtual}`, {
        remetenteTipo,
        conteudo: texto,
      });

      const nova = {
        id: resMsg.data.id,
        remetenteTipo: resMsg.data.remetenteTipo,
        conteudo: resMsg.data.conteudo,
        dataEnvio: resMsg.data.dataEnvio,
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

  // Envio de orçamento pelo prestador
  const handleEnviarOrcamento = async (dadosOrcamento) => {
    let idChatAtual = currentChatId;
    let dadosDoChat = chatDados;

    // Se a conversa ainda não foi criada, cria antes de salvar o orçamento
    if (!idChatAtual) {
      const payloadChat =
        outroUsuario?.tipo === 'prestador'
          ? { prestadorSolicitanteId: outroUsuario.id, prestadorId: usuario.id }
          : { clienteId: outroUsuario.id, prestadorId: usuario.id };

      const resChat = await api.post('/chats', payloadChat);
      dadosDoChat = resChat.data;
      idChatAtual = resChat.data.id;
      setChatDados(dadosDoChat);
      setCurrentChatId(idChatAtual);
    }

    // Cria o orçamento no banco de dados
    const payload = {
      chatId: idChatAtual,
      titulo: dadosOrcamento.titulo,
      valor: dadosOrcamento.valor,
      cep: dadosOrcamento.cep,
      descProblema: dadosOrcamento.descProblema,
      descServico: dadosOrcamento.descServico,
      anexo: dadosOrcamento.anexo,
      dataHora: dadosOrcamento.dataHora,
    };

    const resOrc = await api.post('/orcamentos', payload);
    const novoOrcamento = resOrc.data;

    // Atualiza a lista de orçamentos imediatamente
    setOrcamentos((prev) => [novoOrcamento, ...prev]);

    // Envia uma mensagem no chat registrando a emissão formal do orçamento
    const valorFmt = Number(dadosOrcamento.valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const resMsg = await api.post(`/mensagens/${idChatAtual}`, {
      remetenteTipo: 'PRESTADOR',
      conteudo: `📄 Orçamento emitido: "${dadosOrcamento.titulo}" no valor de ${valorFmt}`,
    });

    const novaMsg = {
      id: resMsg.data.id,
      remetenteTipo: resMsg.data.remetenteTipo,
      conteudo: resMsg.data.conteudo,
      dataEnvio: resMsg.data.dataEnvio,
      horario: formatarHorario(resMsg.data.dataEnvio),
    };

    setMensagens((prev) => [...prev, novaMsg]);
  };

  // Abre a visualização expandida de um orçamento
  const handleExpandirOrcamento = (orc) => {
    setOrcamentoSelecionado(orc);
    setModoModalOrcamento('visualizar');
    setIsOrcamentoModalOpen(true);
  };

  // Constrói a timeline combinada de mensagens e orçamentos ordenada por timestamp
  const timelineItens = [
    ...mensagens.map((m) => ({
      tipoItem: 'MENSAGEM',
      id: `msg-${m.id}`,
      timestamp: new Date(m.dataEnvio || 0).getTime(),
      dados: m,
    })),
    ...orcamentos.map((o) => ({
      tipoItem: 'ORCAMENTO',
      id: `orc-${o.id}`,
      timestamp: new Date(o.dataHora || 0).getTime(),
      dados: o,
    })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  // Nome e CEP do cliente para pré-preenchimento no modal
  const clienteNomePreenchimento = souPrestadorDoChat
    ? outroUsuario?.nome || 'Cliente'
    : usuario?.nome || 'Cliente';

  const clienteCepPreenchimento = souPrestadorDoChat
    ? outroUsuario?.cep || ''
    : usuario?.cep || '';

  const prestadorNomePreenchimento = souPrestadorDoChat
    ? usuario?.nome || 'Prestador'
    : outroUsuario?.nome || 'Prestador';

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
            justify="space-between"
            px={{ base: 3.5, md: 4 }}
            py={3}
            borderBottom="1px solid"
            borderColor="vemfix.border"
            bg="white"
            flexShrink={0}
          >
            {/* Lado Esquerdo: Voltar + Avatar + Dados do Usuário */}
            <HStack spacing={3} minW={0} flex={1}>
              <IconButton
                aria-label="Voltar"
                icon={<FaArrowLeft />}
                variant="ghost"
                size="sm"
                color="gray.400"
                _hover={{ color: 'vemfix.green', bg: 'gray.50' }}
                onClick={() => navigate(-1)}
              />

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

              <HStack spacing={2} align="center" flexWrap="nowrap" overflow="hidden" minW={0}>
                <Text
                  fontSize="14.5px"
                  fontWeight="700"
                  color="vemfix.dark"
                  whiteSpace="nowrap"
                  isTruncated
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
            </HStack>

            {/* Lado Direito: Ícone de Acesso Rápido ao Último Orçamento (caso exista pelo menos 1) */}
            {orcamentos.length > 0 && (
              <Button
                leftIcon={<FaFilePdf />}
                size="sm"
                bg="red.50"
                color="red.600"
                border="1px solid"
                borderColor="red.200"
                _hover={{ bg: 'red.100', transform: 'scale(1.02)' }}
                borderRadius="full"
                px={3}
                h="32px"
                fontSize="12px"
                fontWeight="800"
                boxShadow="0 1px 3px rgba(229, 62, 62, 0.12)"
                onClick={() => handleExpandirOrcamento(orcamentos[0])}
                title="Clique para visualizar o último orçamento elaborado"
                flexShrink={0}
                ml={2}
              >
                Orçamento
              </Button>
            )}
          </Flex>

          {/* Área das Mensagens e Orçamentos */}
          <Box
            flex={1}
            overflowY="auto"
            p={{ base: 4, md: 5 }}
            bg="vemfix.pageBg"
            display="flex"
            flexDirection="column"
            gap={3.5}
          >
            {carregando ? (
              <Flex justify="center" align="center" h="100%">
                <Spinner size="md" color="vemfix.green" />
              </Flex>
            ) : timelineItens.length === 0 ? (
              <Flex justify="center" align="center" h="100%">
                <Text fontSize="13px" color="vemfix.graySubtitle">
                  Inicie a conversa enviando uma mensagem abaixo.
                </Text>
              </Flex>
            ) : (
              timelineItens.map((item) => {
                if (item.tipoItem === 'ORCAMENTO') {
                  const orc = item.dados;
                  // O orçamento foi emitido pelo prestador contratado da conversa
                  // Se eu sou o prestador contratado, alinha à direita; se sou o cliente, à esquerda
                  return (
                    <Box
                      key={item.id}
                      alignSelf={souPrestadorDoChat ? 'flex-end' : 'flex-start'}
                    >
                      <OrcamentoCard
                        orcamento={orc}
                        onExpand={handleExpandirOrcamento}
                      />
                    </Box>
                  );
                }

                // Tipo: MENSAGEM
                const msg = item.dados;
                const ehMinha = souPrestadorDoChat
                  ? msg.remetenteTipo?.toUpperCase() === 'PRESTADOR'
                  : msg.remetenteTipo?.toUpperCase() === 'CLIENTE';

                return (
                  <Box
                    key={item.id}
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
                  description: 'Envio de anexos diretos estará disponível em breve.',
                  status: 'info',
                  duration: 2500,
                  isClosable: true,
                })
              }
            />

            {/* O botão de enviar orçamento só aparece para o Prestador contratado nesta conversa */}
            {souPrestadorDoChat && (
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
                onClick={() => {
                  setModoModalOrcamento('elaborar');
                  setOrcamentoSelecionado(orcamentos.length > 0 ? orcamentos[0] : null);
                  setIsOrcamentoModalOpen(true);
                }}
                title="Elaborar Orçamento"
              />
            )}

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

      {/* Modal de Elaboração ou Visualização Expandida de Orçamento */}
      <OrcamentoModal
        isOpen={isOrcamentoModalOpen}
        onClose={() => setIsOrcamentoModalOpen(false)}
        modo={modoModalOrcamento}
        chatId={currentChatId}
        clienteNome={clienteNomePreenchimento}
        clienteCep={clienteCepPreenchimento}
        prestadorNome={prestadorNomePreenchimento}
        orcamento={orcamentoSelecionado}
        onEnviar={handleEnviarOrcamento}
      />
    </Flex>
  );
}
