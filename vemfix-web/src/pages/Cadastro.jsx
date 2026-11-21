import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Checkbox,
  Button,
  Flex,
  SimpleGrid,
  Alert,
  AlertIcon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const CATEGORIAS_PADRAO = [
  'Encanador',
  'Eletricista',
  'Pintor',
  'Jardineiro',
  'Limpeza',
  'Pedreiro',
  'Ar condicionado',
  'Chaveiro',
  'Outro',
];

// Trata mensagens de erro da API com segurança para nunca quebrar o React
const extrairMensagemErro = (error) => {
  const data = error.response?.data;
  if (!data) {
    return 'Não foi possível conectar ao servidor. Verifique se a API está em execução.';
  }
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data.message === 'string' && data.message.trim() !== '') {
    return data.message;
  }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const primeiro = data.errors[0];
    return typeof primeiro === 'string'
      ? primeiro
      : primeiro.defaultMessage || primeiro.message || 'Dados inválidos.';
  }
  return 'Não foi possível realizar o cadastro. Verifique se o CPF ou e-mail já foram cadastrados.';
};

export default function Cadastro() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tipo, setTipo] = useState('cliente'); // 'cliente' ou 'prestador'
  const [isOutro, setIsOutro] = useState(false);
  const [especialidadeOutro, setEspecialidadeOutro] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Estado do formulário de Cliente
  const [formCliente, setFormCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    cpf: '',
    dataNasc: '',
    senha: '',
  });

  // Estado do formulário de Prestador
  const [formPrestador, setFormPrestador] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    cpf: '',
    dataNasc: '',
    catServico: 'Encanador',
    exp: '',
    senha: '',
  });

  const handleChangeCliente = (e) => {
    setFormCliente({ ...formCliente, [e.target.name]: e.target.value });
  };

  const handleChangePrestador = (e) => {
    setFormPrestador({ ...formPrestador, [e.target.name]: e.target.value });
  };

  // Envio do formulário de Cliente para POST /clientes
  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      // Limpa pontuações de CPF e Telefone para casar com os requisitos do DTO
      const payload = {
        ...formCliente,
        cpf: formCliente.cpf.replace(/\D/g, ''),
        telefone: formCliente.telefone.replace(/\D/g, ''),
      };

      const response = await api.post('/clientes', payload);
      // Salva no contexto de autenticação como usuário logado
      login(response.data);
      // Redireciona para o Feed
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      setErro(extrairMensagemErro(error));
    } finally {
      setLoading(false);
    }
  };

  // Envio do formulário de Prestador para POST /prestadores
  const handleSubmitPrestador = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const categoriaFinal = isOutro && especialidadeOutro.trim() !== ''
        ? especialidadeOutro
        : formPrestador.catServico;

      const payload = {
        ...formPrestador,
        catServico: categoriaFinal,
        cpf: formPrestador.cpf.replace(/\D/g, ''),
        telefone: formPrestador.telefone.replace(/\D/g, ''),
      };

      const response = await api.post('/prestadores', payload);
      // Salva no contexto de autenticação como usuário logado
      login(response.data);
      // Redireciona para o Feed
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar prestador:', error);
      setErro(extrairMensagemErro(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="vemfix.pageBg" minH="100vh" py={{ base: 6, md: 10 }} px={4}>
      {/* Botão Voltar */}
      <Container maxW="640px" mb={4}>
        <HStack
          as="button"
          onClick={() => navigate('/')}
          spacing={2}
          color="vemfix.graySubtitle"
          _hover={{ color: 'vemfix.green' }}
          fontSize="14px"
          fontWeight="600"
          transition="color 0.2s"
        >
          <FaArrowLeft />
          <Text>Voltar para o início</Text>
        </HStack>
      </Container>

      {/* Card Principal */}
      <Container maxW="640px">
        <Box
          bg="white"
          borderRadius="20px"
          p={{ base: 6, md: 10 }}
          boxShadow="0 2px 12px rgba(0, 0, 0, 0.05)"
          border="1px solid"
          borderColor="vemfix.border"
        >
          {/* Cabeçalho do Card */}
          <VStack spacing={1} textAlign="center" mb={6}>
            <Heading
              as="h1"
              fontSize={{ base: '24px', md: '28px' }}
              fontWeight="800"
              fontFamily="heading"
              color="vemfix.dark"
            >
              Crie sua Conta
            </Heading>
            <Text fontSize="14px" color="vemfix.graySubtitle">
              Rápido e simples — comece em menos de 1 minuto
            </Text>
          </VStack>

          {/* Mensagem de Erro da API (se houver) */}
          {erro && (
            <Alert status="error" borderRadius="xl" mb={6}>
              <AlertIcon />
              <Text fontSize="14px">{erro}</Text>
            </Alert>
          )}

          {/* Seletor de Tipo: Sou Cliente vs Sou Prestador */}
          <Flex
            bg="gray.100"
            p="4px"
            borderRadius="10px"
            mb={6}
            userSelect="none"
          >
            <Button
              flex={1}
              size="sm"
              borderRadius="8px"
              bg={tipo === 'cliente' ? 'white' : 'transparent'}
              color={tipo === 'cliente' ? 'vemfix.green' : 'vemfix.grayBody'}
              fontWeight="700"
              fontSize="14px"
              boxShadow={tipo === 'cliente' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'}
              _hover={{ bg: tipo === 'cliente' ? 'white' : 'gray.200' }}
              onClick={() => {
                setTipo('cliente');
                setErro(null);
              }}
            >
              Sou Cliente
            </Button>
            <Button
              flex={1}
              size="sm"
              borderRadius="8px"
              bg={tipo === 'prestador' ? 'white' : 'transparent'}
              color={tipo === 'prestador' ? 'vemfix.green' : 'vemfix.grayBody'}
              fontWeight="700"
              fontSize="14px"
              boxShadow={tipo === 'prestador' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'}
              _hover={{ bg: tipo === 'prestador' ? 'white' : 'gray.200' }}
              onClick={() => {
                setTipo('prestador');
                setErro(null);
              }}
            >
              Sou Prestador
            </Button>
          </Flex>

          {/* Formulário: Sou Cliente */}
          {tipo === 'cliente' && (
            <VStack spacing={4} as="form" onSubmit={handleSubmitCliente}>
              <FormControl isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                  Nome completo
                </FormLabel>
                <Input
                  name="nome"
                  value={formCliente.nome}
                  onChange={handleChangeCliente}
                  placeholder="Seu nome"
                  focusBorderColor="vemfix.green"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                  E-mail
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formCliente.email}
                  onChange={handleChangeCliente}
                  placeholder="seu@email.com"
                  focusBorderColor="vemfix.green"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Telefone
                  </FormLabel>
                  <Input
                    name="telefone"
                    value={formCliente.telefone}
                    onChange={handleChangeCliente}
                    placeholder="(11) 99999-9999"
                    focusBorderColor="vemfix.green"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Cidade
                  </FormLabel>
                  <Input
                    name="cidade"
                    value={formCliente.cidade}
                    onChange={handleChangeCliente}
                    placeholder="Sua cidade"
                    focusBorderColor="vemfix.green"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    CPF
                  </FormLabel>
                  <Input
                    name="cpf"
                    value={formCliente.cpf}
                    onChange={handleChangeCliente}
                    placeholder="000.000.000-00"
                    focusBorderColor="vemfix.green"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Data de nascimento
                  </FormLabel>
                  <Input
                    type="date"
                    name="dataNasc"
                    value={formCliente.dataNasc}
                    onChange={handleChangeCliente}
                    focusBorderColor="vemfix.green"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                  Senha
                </FormLabel>
                <Input
                  type="password"
                  name="senha"
                  value={formCliente.senha}
                  onChange={handleChangeCliente}
                  placeholder="Mínimo 8 dígitos"
                  focusBorderColor="vemfix.green"
                />
              </FormControl>

              <Checkbox colorScheme="green" defaultChecked fontSize="13px" color="vemfix.grayBody" pt={2} w="100%">
                Concordo com os Termos de Uso e Privacidade
              </Checkbox>

              <Button
                type="submit"
                bg="vemfix.green"
                color="white"
                w="100%"
                size="lg"
                mt={2}
                isLoading={loading}
                _hover={{ bg: 'vemfix.greenDark' }}
              >
                Criar Conta
              </Button>
            </VStack>
          )}

          {/* Formulário: Sou Prestador */}
          {tipo === 'prestador' && (
            <VStack spacing={4} as="form" onSubmit={handleSubmitPrestador}>
              <FormControl isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                  Nome completo
                </FormLabel>
                <Input
                  name="nome"
                  value={formPrestador.nome}
                  onChange={handleChangePrestador}
                  placeholder="Seu nome"
                  focusBorderColor="vemfix.green"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                  E-mail
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formPrestador.email}
                  onChange={handleChangePrestador}
                  placeholder="seu@email.com"
                  focusBorderColor="vemfix.green"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Telefone
                  </FormLabel>
                  <Input
                    name="telefone"
                    value={formPrestador.telefone}
                    onChange={handleChangePrestador}
                    placeholder="(11) 99999-9999"
                    focusBorderColor="vemfix.green"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Cidade
                  </FormLabel>
                  <Input
                    name="cidade"
                    value={formPrestador.cidade}
                    onChange={handleChangePrestador}
                    placeholder="Sua cidade"
                    focusBorderColor="vemfix.green"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    CPF
                  </FormLabel>
                  <Input
                    name="cpf"
                    value={formPrestador.cpf}
                    onChange={handleChangePrestador}
                    placeholder="000.000.000-00"
                    focusBorderColor="vemfix.green"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Data de nascimento
                  </FormLabel>
                  <Input
                    type="date"
                    name="dataNasc"
                    value={formPrestador.dataNasc}
                    onChange={handleChangePrestador}
                    focusBorderColor="vemfix.green"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                  Categoria de Serviço
                </FormLabel>
                <Select
                  name="catServico"
                  value={formPrestador.catServico}
                  focusBorderColor="vemfix.green"
                  onChange={(e) => {
                    handleChangePrestador(e);
                    setIsOutro(e.target.value === 'Outro');
                  }}
                >
                  {CATEGORIAS_PADRAO.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
                {isOutro && (
                  <Input
                    placeholder="Digite sua especialidade..."
                    value={especialidadeOutro}
                    onChange={(e) => setEspecialidadeOutro(e.target.value)}
                    mt={2}
                    focusBorderColor="vemfix.green"
                  />
                )}
              </FormControl>

              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                  Breve descrição da experiência
                </FormLabel>
                <Textarea
                  name="exp"
                  value={formPrestador.exp}
                  onChange={handleChangePrestador}
                  placeholder="Conte um pouco sobre sua experiência e serviços prestados..."
                  focusBorderColor="vemfix.green"
                  rows={3}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                  Senha
                </FormLabel>
                <Input
                  type="password"
                  name="senha"
                  value={formPrestador.senha}
                  onChange={handleChangePrestador}
                  placeholder="Mínimo 8 dígitos"
                  focusBorderColor="vemfix.green"
                />
              </FormControl>

              <Checkbox colorScheme="green" defaultChecked fontSize="13px" color="vemfix.grayBody" pt={2} w="100%">
                Concordo com os Termos de Uso e Privacidade
              </Checkbox>

              <Button
                type="submit"
                bg="vemfix.green"
                color="white"
                w="100%"
                size="lg"
                mt={2}
                isLoading={loading}
                _hover={{ bg: 'vemfix.greenDark' }}
              >
                Criar Conta
              </Button>
            </VStack>
          )}

          {/* Rodapé: Link para tela de Login */}
          <Text textAlign="center" fontSize="13px" color="vemfix.graySubtitle" mt={6}>
            Já tem conta?{' '}
            <ChakraLink
              as={Link}
              to="/login"
              color="vemfix.green"
              fontWeight="700"
              _hover={{ textDecoration: 'underline' }}
            >
              Entrar
            </ChakraLink>
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
