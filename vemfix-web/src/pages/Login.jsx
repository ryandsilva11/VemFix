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
  Button,
  Alert,
  AlertIcon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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
  return 'E-mail ou senha incorretos. Verifique suas credenciais.';
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const response = await api.post('/auth/login', { email, senha });
      // Salva o usuário logado no contexto global
      login(response.data);
      // Redireciona para o Feed
      navigate('/');
    } catch (error) {
      console.error('Erro ao efetuar login:', error);
      setErro(extrairMensagemErro(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="vemfix.pageBg" minH="100vh" py={{ base: 6, md: 10 }} px={4}>
      {/* Botão Voltar */}
      <Container maxW="480px" mb={4}>
        <HStack
          as="button"
          onClick={() => navigate(-1)}
          spacing={2}
          color="vemfix.graySubtitle"
          _hover={{ color: 'vemfix.green' }}
          fontSize="14px"
          fontWeight="600"
          transition="color 0.2s"
        >
          <FaArrowLeft />
          <Text>Voltar</Text>
        </HStack>
      </Container>

      {/* Card Principal */}
      <Container maxW="480px">
        <Box
          bg="white"
          borderRadius="20px"
          p={{ base: 6, md: 10 }}
          boxShadow="0 2px 12px rgba(0, 0, 0, 0.05)"
          border="1px solid"
          borderColor="vemfix.border"
        >
          {/* Cabeçalho */}
          <VStack spacing={1} textAlign="center" mb={6}>
            <Heading
              as="h1"
              fontSize={{ base: '24px', md: '28px' }}
              fontWeight="800"
              fontFamily="heading"
              color="vemfix.dark"
            >
              Acesse sua Conta
            </Heading>
            <Text fontSize="14px" color="vemfix.graySubtitle">
              Entre com seu e-mail e senha para continuar
            </Text>
          </VStack>

          {/* Mensagem de Erro (se houver) */}
          {erro && (
            <Alert status="error" borderRadius="xl" mb={6}>
              <AlertIcon />
              <Text fontSize="14px">{erro}</Text>
            </Alert>
          )}

          {/* Formulário */}
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                E-mail
              </FormLabel>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                focusBorderColor="vemfix.green"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                Senha
              </FormLabel>
              <Input
                type="password"
                name="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                focusBorderColor="vemfix.green"
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
              _hover={{ bg: 'vemfix.greenDark' }}
            >
              Entrar
            </Button>
          </VStack>

          {/* Rodapé: Link para Cadastro */}
          <Text textAlign="center" fontSize="13px" color="vemfix.graySubtitle" mt={6}>
            Ainda não tem conta?{' '}
            <ChakraLink
              as={Link}
              to="/cadastro"
              color="vemfix.green"
              fontWeight="700"
              _hover={{ textDecoration: 'underline' }}
            >
              Cadastre-se
            </ChakraLink>
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
