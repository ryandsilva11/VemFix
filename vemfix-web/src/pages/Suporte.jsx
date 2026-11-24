import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { FaArrowLeft, FaQuestionCircle, FaPaperPlane } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const FAQ_ITEMS = [
  {
    pergunta: 'Como funciona o pagamento?',
    resposta:
      'O pagamento é feito via Pix (QR Code ou copia e cola), diretamente pelo chat com o prestador após a aprovação do orçamento. A plataforma garante a segurança da transação.',
  },
  {
    pergunta: 'Posso cancelar um serviço?',
    resposta:
      'Sim. Cancelamentos antes do início do serviço garantem reembolso total. Após o início, o reembolso será parcial dependendo do progresso do serviço acordado.',
  },
  {
    pergunta: 'Como entro em contato com um prestador?',
    resposta:
      'Você pode pesquisar pelo nome ou especialidade do prestador na barra de busca superior ou encontrar as publicações dele no Feed. Ao clicar no perfil, você pode iniciar uma conversa direta.',
  },
  {
    pergunta: 'Como sei se o prestador é confiável?',
    resposta:
      'No VemFix, você pode visualizar as avaliações com nota média por estrelas, ver os trabalhos já publicados pelo profissional e conferir a região de atuação pelo CEP antes de solicitar um serviço.',
  },
];

export default function Suporte() {
  const navigate = useNavigate();
  const toast = useToast();
  const { usuario } = useAuth();

  const [form, setForm] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    euSou: usuario?.tipo === 'PRESTADOR' ? 'Prestador' : 'Cliente',
    assunto: 'Dúvida geral',
    mensagem: '',
  });

  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(false);

    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        assunto: `[${form.euSou}] ${form.assunto}`,
        mensagem: form.mensagem,
      };

      await api.post('/suporte', payload);

      setSucesso(true);
      setForm({
        nome: usuario?.nome || '',
        email: usuario?.email || '',
        euSou: usuario?.tipo === 'PRESTADOR' ? 'Prestador' : 'Cliente',
        assunto: 'Dúvida geral',
        mensagem: '',
      });

      toast({
        title: 'Mensagem enviada com sucesso!',
        description: 'Nossa equipe de suporte responderá em até 24 horas.',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } catch (err) {
      console.error('Erro ao enviar mensagem para o suporte:', err);
      const msg =
        err.response?.data?.message ||
        'Não foi possível enviar a mensagem no momento. Tente novamente mais tarde.';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" minH="100vh" bg="vemfix.pageBg">
      <Header />

      <Box flex={1} py={{ base: 6, md: 10 }} px={4}>
        <Container maxW="840px" mx="auto">
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
            _hover={{ color: 'vemfix.green' }}
            fontSize="14px"
            fontWeight="600"
            transition="color 0.2s"
            mb={6}
          >
            <FaArrowLeft />
            <Text>Voltar</Text>
          </HStack>

          {/* Cabeçalho Hero com Destaques Verdes */}
          <VStack spacing={2} align="flex-start" mb={8}>
            <Badge
              bg="vemfix.greenLight"
              color="vemfix.green"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="12px"
              fontWeight="700"
              textTransform="none"
              letterSpacing="0.2px"
            >
              Atendimento & Ajuda
            </Badge>

            <Heading
              as="h1"
              fontSize={{ base: '26px', md: '34px' }}
              fontWeight="800"
              color="vemfix.dark"
              fontFamily="heading"
            >
              Central de <Text as="span" color="vemfix.green">Suporte</Text>
            </Heading>

            <Text fontSize="15px" color="vemfix.graySubtitle">
              Estamos aqui para ajudar clientes e prestadores com agilidade e transparência
            </Text>
          </VStack>

          {/* Seção 1: FAQ - Perguntas Frequentes */}
          <Box mb={10}>
            <HStack spacing={2.5} align="center" mb={4}>
              <Box color="vemfix.green" fontSize="18px">
                <FaQuestionCircle />
              </Box>
              <Heading as="h2" fontSize="20px" fontWeight="700" color="vemfix.dark">
                Perguntas Frequentes
              </Heading>
            </HStack>

            <Accordion allowMultiple>
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem
                  key={index}
                  bg="white"
                  borderRadius="14px"
                  border="1px solid"
                  borderColor="vemfix.border"
                  boxShadow="0 2px 6px rgba(0,0,0,0.02)"
                  mb={3}
                  overflow="hidden"
                  _hover={{ borderColor: 'brand.200' }}
                  transition="border-color 0.2s"
                >
                  <h3>
                    <AccordionButton
                      py={4}
                      px={5}
                      _expanded={{ bg: 'green.50', color: 'vemfix.greenDark' }}
                      _hover={{ bg: 'gray.50' }}
                      transition="background 0.2s"
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        fontSize="14.5px"
                        fontWeight="700"
                        color="vemfix.dark"
                      >
                        {item.pergunta}
                      </Box>
                      <AccordionIcon color="vemfix.green" />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel
                    px={5}
                    py={4}
                    fontSize="14px"
                    color="vemfix.grayBody"
                    lineHeight="1.7"
                    borderTop="1px solid"
                    borderColor="gray.100"
                    borderLeft="4px solid"
                    borderLeftColor="vemfix.green"
                  >
                    {item.resposta}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>

          {/* Seção 2: Fale Conosco (Formulário Moderno com Destaques Verdes) */}
          <Box
            bg="white"
            borderRadius="20px"
            p={{ base: 6, md: 8 }}
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.04)"
            border="1px solid"
            borderColor="vemfix.border"
            position="relative"
            overflow="hidden"
          >
            {/* Faixa decorativa no topo do card */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="4px"
              bg="vemfix.green"
            />

            <VStack spacing={1} align="flex-start" mb={6}>
              <HStack spacing={2} align="center">
                <Box color="vemfix.green" fontSize="16px">
                  <FaPaperPlane />
                </Box>
                <Heading as="h2" fontSize="20px" fontWeight="800" color="vemfix.dark">
                  Fale Conosco
                </Heading>
              </HStack>
              <Text fontSize="13px" color="vemfix.graySubtitle">
                Para clientes e prestadores — respondemos em até 24h
              </Text>
            </VStack>

            {sucesso && (
              <Alert status="success" borderRadius="12px" mb={6}>
                <AlertIcon />
                <Text fontSize="14px">
                  Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.
                </Text>
              </Alert>
            )}

            {erro && (
              <Alert status="error" borderRadius="12px" mb={6}>
                <AlertIcon />
                <Text fontSize="14px">{erro}</Text>
              </Alert>
            )}

            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Nome
                  </FormLabel>
                  <Input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    focusBorderColor="vemfix.green"
                    borderRadius="10px"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    E-mail
                  </FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    focusBorderColor="vemfix.green"
                    borderRadius="10px"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Eu sou
                  </FormLabel>
                  <Select
                    name="euSou"
                    value={form.euSou}
                    onChange={handleChange}
                    focusBorderColor="vemfix.green"
                    borderRadius="10px"
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Prestador">Prestador</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Assunto
                  </FormLabel>
                  <Select
                    name="assunto"
                    value={form.assunto}
                    onChange={handleChange}
                    focusBorderColor="vemfix.green"
                    borderRadius="10px"
                  >
                    <option value="Problema com serviço">Problema com serviço</option>
                    <option value="Reembolso">Reembolso</option>
                    <option value="Dúvida geral">Dúvida geral</option>
                    <option value="Elogio ou sugestão">Elogio ou sugestão</option>
                    <option value="Outro">Outro</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                  Mensagem
                </FormLabel>
                <Textarea
                  name="mensagem"
                  value={form.mensagem}
                  onChange={handleChange}
                  placeholder="Descreva sua dúvida ou problema detalhadamente..."
                  rows={4}
                  focusBorderColor="vemfix.green"
                  borderRadius="10px"
                />
              </FormControl>

              <Button
                type="submit"
                bg="vemfix.green"
                color="white"
                w="100%"
                size="lg"
                mt={2}
                isLoading={loading}
                loadingText="Enviando..."
                _hover={{ bg: 'vemfix.greenDark', transform: 'translateY(-1px)' }}
                _active={{ transform: 'translateY(0)' }}
                boxShadow="0 4px 12px rgba(26, 158, 110, 0.2)"
                transition="all 0.2s"
                borderRadius="12px"
              >
                Enviar Mensagem
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Flex>
  );
}
