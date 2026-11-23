import { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Input,
  Textarea,
  Button,
  IconButton,
  SimpleGrid,
  FormControl,
  FormLabel,
  Image,
  useToast,
  Icon,
} from '@chakra-ui/react';
import {
  FaTimes,
  FaCamera,
  FaDownload,
  FaTrash,
  FaFilePdf,
} from 'react-icons/fa';
import { baixarOrcamentoPDF } from '../utils/orcamentoPdf';

export default function OrcamentoModal({
  isOpen,
  onClose,
  modo = 'elaborar', // 'elaborar' | 'visualizar'
  chatId,
  clienteNome = '',
  clienteCep = '',
  prestadorNome = '',
  orcamento = null,
  onEnviar,
}) {
  const toast = useToast();
  const fileInputRef = useRef(null);

  // Chave do localStorage para este chat
  const storageKey = `vemfix_rascunho_orcamento_${chatId || 'default'}`;

  // Data atual no formato YYYY-MM-DD para o input type="date"
  const hojeStr = new Date().toISOString().split('T')[0];

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [dataEmissao, setDataEmissao] = useState(hojeStr);
  const [nomeCliente, setNomeCliente] = useState('');
  const [cepCliente, setCepCliente] = useState('');
  const [nomePrestador, setNomePrestador] = useState('');
  const [valor, setValor] = useState('');
  const [foto, setFoto] = useState('');
  const [descProblema, setDescProblema] = useState('');
  const [descServico, setDescServico] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Carrega rascunho ou dados iniciais ao abrir o modal
  useEffect(() => {
    if (!isOpen) return;

    if (modo === 'visualizar' && orcamento) {
      // Modo de visualização expandida de orçamento existente
      setTitulo(orcamento.titulo || '');
      setDataEmissao(
        orcamento.dataHora
          ? new Date(orcamento.dataHora).toISOString().split('T')[0]
          : hojeStr
      );
      setNomeCliente(orcamento.clienteNome || clienteNome);
      setCepCliente(orcamento.cep || clienteCep);
      setNomePrestador(orcamento.prestadorNome || prestadorNome);
      setValor(
        orcamento.valor != null
          ? Number(orcamento.valor).toFixed(2).replace('.', ',')
          : ''
      );
      setFoto(orcamento.anexo && orcamento.anexo !== 'string' ? orcamento.anexo : '');
      setDescProblema(orcamento.descProblema || '');
      setDescServico(orcamento.descServico || '');
      return;
    }

    // Modo Elaborar:
    // 1. Tenta carregar rascunho salvo no localStorage
    try {
      const rascunhoJson = localStorage.getItem(storageKey);
      if (rascunhoJson) {
        const r = JSON.parse(rascunhoJson);
        setTitulo(r.titulo || '');
        setDataEmissao(r.dataEmissao || hojeStr);
        setNomeCliente(r.nomeCliente || clienteNome);
        setCepCliente(r.cepCliente || clienteCep);
        setNomePrestador(r.nomePrestador || prestadorNome);
        setValor(r.valor || '');
        setFoto(r.foto || '');
        setDescProblema(r.descProblema || '');
        setDescServico(r.descServico || '');
        return;
      }
    } catch {
      // Ignora erro no parse do localStorage
    }

    // 2. Se não tem rascunho mas já houve um orçamento enviado antes, usa como base
    if (orcamento) {
      setTitulo(orcamento.titulo || '');
      setDataEmissao(hojeStr);
      setNomeCliente(orcamento.clienteNome || clienteNome);
      setCepCliente(orcamento.cep || clienteCep);
      setNomePrestador(orcamento.prestadorNome || prestadorNome);
      setValor(
        orcamento.valor != null
          ? Number(orcamento.valor).toFixed(2).replace('.', ',')
          : ''
      );
      setFoto(orcamento.anexo && orcamento.anexo !== 'string' ? orcamento.anexo : '');
      setDescProblema(orcamento.descProblema || '');
      setDescServico(orcamento.descServico || '');
      return;
    }

    // 3. Inicialização padrão
    setTitulo('');
    setDataEmissao(hojeStr);
    setNomeCliente(clienteNome);
    setCepCliente(clienteCep);
    setNomePrestador(prestadorNome);
    setValor('');
    setFoto('');
    setDescProblema('');
    setDescServico('');
  }, [isOpen, modo, orcamento, chatId, clienteNome, clienteCep, prestadorNome, hojeStr, storageKey]);

  // Upload e conversão da foto para Base64
  const handleSelecionarFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Formato inválido',
        description: 'Por favor, selecione um arquivo de imagem.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A imagem deve ter no máximo 8MB.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Salvar rascunho no localStorage
  const handleSalvarRascunho = () => {
    const rascunho = {
      titulo,
      dataEmissao,
      nomeCliente,
      cepCliente,
      nomePrestador,
      valor,
      foto,
      descProblema,
      descServico,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(rascunho));
      toast({
        title: 'Rascunho salvo',
        description: 'Os dados foram salvos no rascunho com sucesso.',
        status: 'success',
        duration: 2500,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o rascunho localmente.',
        status: 'error',
        duration: 2500,
        isClosable: true,
      });
    }
  };

  // Limpar todo o orçamento e rascunho
  const handleLimpar = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignora erro
    }

    setTitulo('');
    setDataEmissao(hojeStr);
    setNomeCliente(clienteNome);
    setCepCliente(clienteCep);
    setNomePrestador(prestadorNome);
    setValor('');
    setFoto('');
    setDescProblema('');
    setDescServico('');

    toast({
      title: 'Orçamento limpo',
      description: 'Todos os campos e o rascunho foram limpos.',
      status: 'info',
      duration: 2500,
      isClosable: true,
    });
  };

  // Enviar orçamento ao cliente
  const handleEnviar = async () => {
    if (!titulo.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o título do orçamento.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!nomeCliente.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o nome do cliente.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!cepCliente.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o CEP do cliente.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Tratamento e validação do valor
    const valorNumerico = parseFloat(
      valor.toString().replace(/\./g, '').replace(',', '.')
    );

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, informe um valor estimado válido maior que zero.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!descProblema.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, detalhe a descrição do problema.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!descServico.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, detalhe a descrição do serviço a ser feito.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setEnviando(true);
    try {
      const dadosOrcamento = {
        chatId,
        titulo: titulo.trim(),
        valor: valorNumerico,
        cep: cepCliente.trim(),
        descProblema: descProblema.trim(),
        descServico: descServico.trim(),
        anexo: foto || null,
        clienteNome: nomeCliente.trim(),
        prestadorNome: nomePrestador || prestadorNome,
        dataHora: dataEmissao ? `${dataEmissao}T12:00:00` : null,
      };

      // Salva no localStorage para que os dados fiquem guardados para edição futura
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            titulo,
            dataEmissao,
            nomeCliente,
            cepCliente,
            nomePrestador,
            valor,
            foto,
            descProblema,
            descServico,
          })
        );
      } catch {
        // Silencioso
      }

      if (onEnviar) {
        await onEnviar(dadosOrcamento);
      }

      toast({
        title: 'Orçamento enviado!',
        description: 'O orçamento foi registrado e enviado na conversa.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (err) {
      console.error('Erro ao enviar orçamento:', err);
      toast({
        title: 'Erro ao enviar orçamento',
        description: 'Não foi possível enviar o orçamento. Tente novamente.',
        status: 'error',
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setEnviando(false);
    }
  };

  const ehVisualizacao = modo === 'visualizar';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent
        bg="#121316"
        color="white"
        borderRadius="20px"
        border="1px solid"
        borderColor="whiteAlpha.100"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.75)"
        overflow="hidden"
        maxW={{ base: '92%', md: '560px' }}
        my={4}
      >
        <ModalBody p={{ base: 5, md: 7 }}>
          {/* Header do Modal com Ações */}
          <Flex justify="space-between" align="center" mb={1}>
            {ehVisualizacao ? (
              <Button
                size="sm"
                leftIcon={<FaDownload />}
                colorScheme="green"
                bg="vemfix.green"
                _hover={{ bg: 'vemfix.greenDark' }}
                fontSize="12px"
                fontWeight="700"
                h="32px"
                borderRadius="8px"
                onClick={() =>
                  baixarOrcamentoPDF({
                    id: orcamento?.id,
                    titulo,
                    dataHora: dataEmissao,
                    clienteNome: nomeCliente,
                    cep: cepCliente,
                    prestadorNome: nomePrestador || prestadorNome,
                    valor,
                    descProblema,
                    descServico,
                    anexo: foto,
                  })
                }
              >
                Baixar PDF
              </Button>
            ) : (
              <Box w="32px" />
            )}

            <IconButton
              aria-label="Fechar"
              icon={<FaTimes />}
              size="sm"
              variant="ghost"
              color="whiteAlpha.600"
              _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              borderRadius="full"
              onClick={onClose}
            />
          </Flex>

          {/* Título e Subtítulo */}
          <VStack spacing={1} mb={6} textAlign="center">
            <Text fontSize="22px" fontWeight="800" color="white" letterSpacing="-0.3px">
              {ehVisualizacao ? 'Orçamento de Serviço' : 'Elaborar Orçamento'}
            </Text>
            <Text fontSize="13px" color="whiteAlpha.600">
              {ehVisualizacao
                ? 'Confira os detalhes e termos deste orçamento'
                : 'Preencha os dados do orçamento para o cliente'}
            </Text>
          </VStack>

          {/* Formulário / Dados */}
          <VStack spacing={4} align="stretch">
            {/* Título do Orçamento */}
            <FormControl isRequired={!ehVisualizacao}>
              <FormLabel fontSize="12.5px" fontWeight="600" color="whiteAlpha.900" mb={1.5}>
                Título do Orçamento
              </FormLabel>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                isReadOnly={ehVisualizacao}
                placeholder="Ex: Conserto de vazamento"
                bg="#1E2026"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="10px"
                fontSize="13.5px"
                h="40px"
                _placeholder={{ color: 'whiteAlpha.400' }}
                _focus={{ borderColor: 'vemfix.green', boxShadow: '0 0 0 1px #1A9E6E' }}
              />
            </FormControl>

            {/* Linha com Data e Nome do Cliente */}
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3.5}>
              <FormControl isRequired={!ehVisualizacao}>
                <FormLabel fontSize="12.5px" fontWeight="600" color="whiteAlpha.900" mb={1.5}>
                  Data
                </FormLabel>
                <Input
                  type="date"
                  value={dataEmissao}
                  onChange={(e) => setDataEmissao(e.target.value)}
                  isReadOnly={ehVisualizacao}
                  bg="#1E2026"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="10px"
                  fontSize="13.5px"
                  h="40px"
                  colorScheme="dark"
                  _focus={{ borderColor: 'vemfix.green', boxShadow: '0 0 0 1px #1A9E6E' }}
                />
              </FormControl>

              <FormControl isRequired={!ehVisualizacao}>
                <FormLabel fontSize="12.5px" fontWeight="600" color="whiteAlpha.900" mb={1.5}>
                  Nome do Cliente
                </FormLabel>
                <Input
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  isReadOnly={ehVisualizacao}
                  placeholder="Nome do cliente"
                  bg="#1E2026"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="10px"
                  fontSize="13.5px"
                  h="40px"
                  _placeholder={{ color: 'whiteAlpha.400' }}
                  _focus={{ borderColor: 'vemfix.green', boxShadow: '0 0 0 1px #1A9E6E' }}
                />
              </FormControl>
            </SimpleGrid>

            {/* CEP do Cliente */}
            <FormControl isRequired={!ehVisualizacao}>
              <FormLabel fontSize="12.5px" fontWeight="600" color="whiteAlpha.900" mb={1.5}>
                CEP do Cliente
              </FormLabel>
              <Input
                value={cepCliente}
                onChange={(e) => setCepCliente(e.target.value)}
                isReadOnly={ehVisualizacao}
                placeholder="00000-000"
                bg="#1E2026"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="10px"
                fontSize="13.5px"
                h="40px"
                _placeholder={{ color: 'whiteAlpha.400' }}
                _focus={{ borderColor: 'vemfix.green', boxShadow: '0 0 0 1px #1A9E6E' }}
              />
            </FormControl>

            {/* Valor Estimado (R$) */}
            <FormControl isRequired={!ehVisualizacao}>
              <FormLabel fontSize="12.5px" fontWeight="600" color="whiteAlpha.900" mb={1.5}>
                Valor Estimado (R$)
              </FormLabel>
              <Input
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                isReadOnly={ehVisualizacao}
                placeholder="Ex: 150,00"
                bg="#1E2026"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="10px"
                fontSize="13.5px"
                h="40px"
                _placeholder={{ color: 'whiteAlpha.400' }}
                _focus={{ borderColor: 'vemfix.green', boxShadow: '0 0 0 1px #1A9E6E' }}
              />
            </FormControl>

            {/* Fotos e Vídeos do Problema (Opcional - UMA foto) */}
            <FormControl>
              <FormLabel fontSize="12.5px" fontWeight="600" color="whiteAlpha.900" mb={1.5}>
                Fotos e Vídeos do Problema{' '}
                <Text as="span" fontSize="11px" color="whiteAlpha.500" fontWeight="400">
                  (Opcional)
                </Text>
              </FormLabel>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleSelecionarFoto}
              />

              {foto ? (
                <Box
                  position="relative"
                  borderRadius="10px"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  bg="#1E2026"
                  p={2}
                  textAlign="center"
                >
                  <Image
                    src={foto}
                    alt="Foto do local"
                    maxH="180px"
                    mx="auto"
                    borderRadius="6px"
                    objectFit="contain"
                  />
                  {!ehVisualizacao && (
                    <Flex justify="center" gap={2} mt={2}>
                      <Button
                        size="xs"
                        variant="outline"
                        colorScheme="whiteAlpha"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Trocar Foto
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        leftIcon={<FaTrash />}
                        onClick={() => setFoto('')}
                      >
                        Remover
                      </Button>
                    </Flex>
                  )}
                </Box>
              ) : !ehVisualizacao ? (
                <Box
                  border="1px dashed"
                  borderColor="whiteAlpha.300"
                  borderRadius="12px"
                  bg="#1E2026"
                  py={6}
                  px={4}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ borderColor: 'vemfix.green', bg: '#23262D' }}
                  transition="all 0.2s"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <VStack spacing={2}>
                    <Icon as={FaCamera} fontSize="24px" color="whiteAlpha.600" />
                    <Text fontSize="12.5px" color="whiteAlpha.700" fontWeight="500">
                      Adicionar fotos do local
                    </Text>
                  </VStack>
                </Box>
              ) : (
                <Text fontSize="12px" color="whiteAlpha.500" fontStyle="italic">
                  Nenhuma foto anexada a este orçamento.
                </Text>
              )}
            </FormControl>

            {/* Descrição do Problema */}
            <FormControl isRequired={!ehVisualizacao}>
              <FormLabel fontSize="12.5px" fontWeight="600" color="whiteAlpha.900" mb={1.5}>
                Descrição do Problema
              </FormLabel>
              <Textarea
                value={descProblema}
                onChange={(e) => setDescProblema(e.target.value)}
                isReadOnly={ehVisualizacao}
                placeholder="Detalhe o problema identificado..."
                bg="#1E2026"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="10px"
                fontSize="13px"
                minH="72px"
                resize="vertical"
                _placeholder={{ color: 'whiteAlpha.400' }}
                _focus={{ borderColor: 'vemfix.green', boxShadow: '0 0 0 1px #1A9E6E' }}
              />
            </FormControl>

            {/* Descrição do Serviço */}
            <FormControl isRequired={!ehVisualizacao}>
              <FormLabel fontSize="12.5px" fontWeight="600" color="whiteAlpha.900" mb={1.5}>
                Descrição do Serviço
              </FormLabel>
              <Textarea
                value={descServico}
                onChange={(e) => setDescServico(e.target.value)}
                isReadOnly={ehVisualizacao}
                placeholder="Detalhe o serviço planejado..."
                bg="#1E2026"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="10px"
                fontSize="13px"
                minH="72px"
                resize="vertical"
                _placeholder={{ color: 'whiteAlpha.400' }}
                _focus={{ borderColor: 'vemfix.green', boxShadow: '0 0 0 1px #1A9E6E' }}
              />
            </FormControl>

            {/* Botões de Ação na Elaboração */}
            {!ehVisualizacao && (
              <VStack spacing={2.5} pt={2} align="stretch">
                <SimpleGrid columns={2} spacing={3}>
                  <Button
                    bg="vemfix.green"
                    color="white"
                    borderRadius="10px"
                    h="42px"
                    fontSize="13.5px"
                    fontWeight="700"
                    _hover={{ bg: 'vemfix.greenDark', transform: 'scale(1.01)' }}
                    _active={{ bg: 'vemfix.greenDark' }}
                    onClick={handleEnviar}
                    isLoading={enviando}
                    loadingText="Enviando..."
                  >
                    Enviar ao Cliente
                  </Button>

                  <Button
                    variant="outline"
                    borderColor="whiteAlpha.300"
                    color="white"
                    borderRadius="10px"
                    h="42px"
                    fontSize="13.5px"
                    fontWeight="600"
                    _hover={{ bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.500' }}
                    onClick={handleSalvarRascunho}
                  >
                    Salvar Rascunho
                  </Button>
                </SimpleGrid>

                <Button
                  variant="ghost"
                  color="red.400"
                  size="sm"
                  fontSize="12px"
                  fontWeight="600"
                  _hover={{ bg: 'red.900', color: 'red.200' }}
                  onClick={handleLimpar}
                >
                  Limpar Orçamento e Rascunho
                </Button>
              </VStack>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
