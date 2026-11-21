import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { FaUserCircle, FaSearch, FaTimes, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Header() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAutenticado, usuario } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [isBuscando, setIsBuscando] = useState(false);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Extrai iniciais do nome
  const getIniciais = (nome) => {
    if (!nome) return '';
    const partes = nome.trim().split(' ').filter(Boolean);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  // Carrega clientes e prestadores da API para a pesquisa
  const carregarUsuarios = async () => {
    if (usuarios.length > 0 || carregandoUsuarios) return;
    setCarregandoUsuarios(true);
    try {
      const [resClientes, resPrestadores] = await Promise.all([
        api.get('/clientes').catch(() => ({ data: [] })),
        api.get('/prestadores').catch(() => ({ data: [] })),
      ]);

      const parseAvaliacao = (val) => {
        if (val == null || val === '') return 0.0;
        const num = Number(val);
        return isNaN(num) ? 0.0 : num;
      };

      const listaClientes = (resClientes.data || []).map((c) => ({
        id: c.id,
        nome: c.nome,
        tipo: 'cliente',
        prefixo: 'c/',
        cidade: c.cidade,
      }));

      const listaPrestadores = (resPrestadores.data || []).map((p) => ({
        id: p.id,
        nome: p.nome,
        tipo: 'prestador',
        prefixo: 'p/',
        catServico: p.catServico || '',
        cidade: p.cidade,
        avaliacao: parseAvaliacao(p.avaliacao),
      }));

      setUsuarios([...listaPrestadores, ...listaClientes]);
    } catch (err) {
      console.error('Erro ao buscar usuários para pesquisa:', err);
    } finally {
      setCarregandoUsuarios(false);
    }
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsBuscando(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtra os usuários com base no termo digitado
  const resultadosFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    if (!termo) return [];

    let buscaNome = termo;
    let apenasTipo = null;

    if (termo.startsWith('p/')) {
      apenasTipo = 'prestador';
      buscaNome = termo.slice(2).trim();
    } else if (termo.startsWith('c/')) {
      apenasTipo = 'cliente';
      buscaNome = termo.slice(2).trim();
    }

    return usuarios.filter((u) => {
      const bateTipo = !apenasTipo || u.tipo === apenasTipo;
      const bateNome =
        buscaNome === '' || (u.nome && u.nome.toLowerCase().includes(buscaNome));
      return bateTipo && bateNome;
    });
  }, [termoBusca, usuarios]);

  const handleSelecionarUsuario = (u) => {
    setIsBuscando(false);
    setTermoBusca('');
    if (u.tipo === 'prestador') {
      navigate(`/prestador/${u.id}`);
    } else if (u.tipo === 'cliente') {
      navigate(`/cliente/${u.id}`);
    }
  };

  const handleFocarPesquisa = () => {
    inputRef.current?.focus();
    setIsBuscando(true);
    carregarUsuarios();
  };

  const isPrestador =
    isAutenticado &&
    (usuario?.tipo?.toUpperCase() === 'PRESTADOR' || Boolean(usuario?.catServico));

  const handleMinhasConversas = () => {
    if (!isAutenticado) {
      navigate('/cadastro');
    } else {
      toast({
        title: 'Em breve!',
        description: 'A tela de conversas será implementada nas próximas etapas.',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handlePerfil = () => {
    if (!isAutenticado) {
      navigate('/cadastro');
    } else {
      if (isPrestador && usuario?.id) {
        navigate(`/prestador/${usuario.id}`);
      } else if (usuario?.id) {
        navigate(`/cliente/${usuario.id}`);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <Box
      as="header"
      bg="white"
      borderBottom="1px solid"
      borderColor="vemfix.border"
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.03)"
      w="100%"
    >
      <Flex
        maxW="1160px"
        mx="auto"
        h="66px"
        px={{ base: 4, md: 8 }}
        align="center"
        justify="space-between"
        gap={4}
      >
        {/* Lado Esquerdo: Logo + Links juntos empurrados para a esquerda */}
        <HStack spacing={{ base: 4, md: 8 }} align="center">
          {/* Logo VemFix */}
          <HStack
            spacing={2.5}
            cursor="pointer"
            userSelect="none"
            onClick={() => navigate('/')}
          >
            <Flex
              w="34px"
              h="34px"
              bg="vemfix.green"
              borderRadius="8px"
              align="center"
              justify="center"
              color="white"
              fontWeight="800"
              fontSize="18px"
              fontFamily="heading"
              boxShadow="0 2px 6px rgba(26, 158, 110, 0.25)"
            >
              V
            </Flex>
            <Text
              fontFamily="heading"
              fontSize="22px"
              fontWeight="800"
              color="vemfix.green"
              letterSpacing="-0.5px"
            >
              VemFix
            </Text>
          </HStack>

          {/* Links de Navegação */}
          <HStack spacing={{ base: 4, md: 6 }} display={{ base: 'none', lg: 'flex' }}>
            <Text
              fontSize="14px"
              fontWeight="600"
              color="vemfix.green"
              cursor="pointer"
              onClick={() => navigate('/')}
              transition="color 0.2s"
            >
              Início
            </Text>
            <Text
              fontSize="14px"
              fontWeight="500"
              color="vemfix.grayBody"
              cursor="pointer"
              _hover={{ color: 'vemfix.green' }}
              onClick={handleMinhasConversas}
              transition="color 0.2s"
            >
              Minhas conversas
            </Text>
            <Text
              fontSize="14px"
              fontWeight="500"
              color="vemfix.grayBody"
              cursor="pointer"
              _hover={{ color: 'vemfix.green' }}
              onClick={() => navigate('/suporte')}
              transition="color 0.2s"
            >
              Suporte
            </Text>
          </HStack>
        </HStack>

        {/* Lado Direito: Barra de Pesquisa (levemente mais próxima do ícone) + Ícone de Perfil */}
        <HStack spacing={3} flex={1} justify="flex-end" maxW="460px">
          {/* Barra de Pesquisa */}
          <Box
            position="relative"
            ref={searchRef}
            w="100%"
            maxW={{ base: '190px', sm: '270px', md: '340px' }}
          >
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none" color="gray.400" h="100%">
                <FaSearch size={13} />
              </InputLeftElement>
              <Input
                ref={inputRef}
                value={termoBusca}
                onChange={(e) => {
                  setTermoBusca(e.target.value);
                  setIsBuscando(true);
                }}
                onFocus={() => {
                  setIsBuscando(true);
                  carregarUsuarios();
                }}
                placeholder="Pesquisar (ex: p/ ou c/)..."
                bg="gray.50"
                border="1px solid"
                borderColor="vemfix.border"
                borderRadius="full"
                h="36px"
                fontSize="13px"
                _hover={{ borderColor: 'gray.300', bg: 'white' }}
                _focus={{
                  bg: 'white',
                  borderColor: 'vemfix.green',
                  boxShadow: '0 0 0 1px #1A9E6E',
                }}
              />
              {termoBusca && (
                <InputRightElement h="100%">
                  <Icon
                    as={FaTimes}
                    fontSize="11px"
                    color="gray.400"
                    cursor="pointer"
                    _hover={{ color: 'gray.600' }}
                    onClick={() => setTermoBusca('')}
                  />
                </InputRightElement>
              )}
            </InputGroup>

            {/* Lista Flutuante de Resultados */}
            {isBuscando && termoBusca.trim().length > 0 && (
              <Box
                position="absolute"
                top="calc(100% + 8px)"
                right={0}
                w={{ base: '310px', sm: '420px', md: '480px' }}
                maxW="90vw"
                bg="white"
                borderRadius="16px"
                boxShadow="0 10px 25px -3px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)"
                border="1px solid"
                borderColor="vemfix.border"
                zIndex={200}
                overflow="hidden"
              >
                {carregandoUsuarios ? (
                  <Flex p={4} justify="center" align="center" gap={2}>
                    <Spinner size="xs" color="vemfix.green" />
                    <Text fontSize="13px" color="vemfix.graySubtitle">
                      Buscando usuários...
                    </Text>
                  </Flex>
                ) : resultadosFiltrados.length === 0 ? (
                  <Box p={4} textAlign="center">
                    <Text fontSize="13px" color="vemfix.graySubtitle">
                      Nenhum usuário encontrado para <strong>"{termoBusca}"</strong>
                    </Text>
                  </Box>
                ) : (
                  <Box maxH="380px" overflowY="auto" py={1.5}>
                    {resultadosFiltrados.map((u) => (
                      <Flex
                        key={`${u.tipo}-${u.id}`}
                        align="center"
                        px={3.5}
                        py={2.5}
                        cursor="pointer"
                        _hover={{ bg: 'gray.50' }}
                        transition="background 0.15s"
                        onClick={() => handleSelecionarUsuario(u)}
                      >
                        <HStack spacing={3} align="center" w="100%" overflow="hidden">
                          {/* Mini Avatar com Iniciais */}
                          <Flex
                            w="32px"
                            h="32px"
                            minW="32px"
                            borderRadius="full"
                            bg={u.tipo === 'prestador' ? 'vemfix.greenLight' : 'blue.50'}
                            color={u.tipo === 'prestador' ? 'vemfix.green' : 'blue.600'}
                            fontWeight="800"
                            fontSize="12px"
                            align="center"
                            justify="center"
                          >
                            {getIniciais(u.nome)}
                          </Flex>

                          {/* Nome e Informações Lado a Lado (estilo imagem de referência) */}
                          <HStack spacing={2} align="center" flexWrap="nowrap" overflow="hidden">
                            {/* Nome com prefixo */}
                            <Text
                              fontSize="13px"
                              fontWeight="700"
                              color="vemfix.dark"
                              whiteSpace="nowrap"
                            >
                              <Text
                                as="span"
                                color={u.tipo === 'prestador' ? 'vemfix.green' : 'blue.600'}
                                fontWeight="800"
                              >
                                {u.prefixo}
                              </Text>
                              {u.nome}
                            </Text>

                            {/* Informações complementares lado a lado: Prestador • Categoria • Cidade ★ Avaliação */}
                            {u.tipo === 'prestador' ? (
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
                                {u.catServico && (
                                  <>
                                    <Text color="gray.300">•</Text>
                                    <Text>{u.catServico}</Text>
                                  </>
                                )}
                                {u.cidade && (
                                  <>
                                    <Text color="gray.300">•</Text>
                                    <Text>{u.cidade}</Text>
                                  </>
                                )}
                                <HStack spacing={1} color="orange.400" fontWeight="700" pl={0.5}>
                                  <Icon as={FaStar} fontSize="11px" />
                                  <Text>{Number(u.avaliacao ?? 0).toFixed(1)}</Text>
                                </HStack>
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
                                {u.cidade && (
                                  <>
                                    <Text color="gray.300">•</Text>
                                    <Text>{u.cidade}</Text>
                                  </>
                                )}
                              </HStack>
                            )}
                          </HStack>
                        </HStack>
                      </Flex>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Perfil do Usuário */}
          <Flex
            align="center"
            justify="center"
            w="38px"
            h="38px"
            minW="38px"
            borderRadius="full"
            bg={
              !isAutenticado
                ? 'gray.100'
                : isPrestador
                ? 'vemfix.greenLight'
                : 'blue.50'
            }
            color={
              !isAutenticado
                ? 'gray.500'
                : isPrestador
                ? 'vemfix.green'
                : 'blue.600'
            }
            fontWeight="700"
            fontSize="14px"
            cursor="pointer"
            onClick={handlePerfil}
            _hover={{
              transform: 'scale(1.05)',
              bg: !isAutenticado
                ? 'gray.200'
                : isPrestador
                ? 'brand.100'
                : 'blue.100',
            }}
            transition="all 0.2s"
            boxShadow="0 1px 3px rgba(0,0,0,0.05)"
          >
            {isAutenticado && usuario?.nome ? (
              getIniciais(usuario.nome)
            ) : (
              <Icon as={FaUserCircle} w={6} h={6} />
            )}
          </Flex>
        </HStack>
      </Flex>
    </Box>
  );
}
