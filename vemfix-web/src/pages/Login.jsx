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
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();

  return (
    <Box bg="vemfix.pageBg" minH="100vh" py={{ base: 6, md: 10 }} px={4}>
      {/* Botão Voltar */}
      <Container maxW="480px" mb={4}>
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

          {/* Formulário */}
          <VStack spacing={4} as="form" onSubmit={(e) => e.preventDefault()}>
            <FormControl isRequired>
              <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                E-mail
              </FormLabel>
              <Input
                type="email"
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
