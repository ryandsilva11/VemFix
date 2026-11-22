import { useState, useEffect } from 'react';
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
  Button,
  SimpleGrid,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
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

export default function AlterarDados() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAutenticado, usuario, login } = useAuth();

  const isPrestador =
    usuario?.tipo?.toUpperCase() === 'PRESTADOR' || Boolean(usuario?.catServico);

  const [loadingDados, setLoadingDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const [form, setForm] = useState({
    telefone: '',
    cidade: '',
    catServico: 'Encanador',
    exp: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: '',
  });

  const [isOutro, setIsOutro] = useState(false);
  const [especialidadeOutro, setEspecialidadeOutro] = useState('');

  // Carrega os dados atuais do usuário da API
  useEffect(() => {
    if (!isAutenticado || !usuario?.id) {
      navigate('/login');
      return;
    }

    async function carregarPerfil() {
      setLoadingDados(true);
      setErro(null);
      try {
        const endpoint = isPrestador
          ? `/prestadores/${usuario.id}`
          : `/clientes/${usuario.id}`;
        const res = await api.get(endpoint);
        const dados = res.data;

        const ehOutro =
          dados.catServico && !CATEGORIAS_PADRAO.includes(dados.catServico);

        setIsOutro(Boolean(ehOutro));
        if (ehOutro) {
          setEspecialidadeOutro(dados.catServico);
        }

        setForm((prev) => ({
          ...prev,
          telefone: dados.telefone || '',
          cidade: dados.cidade || '',
          catServico: ehOutro ? 'Outro' : dados.catServico || 'Encanador',
          exp: dados.exp || '',
        }));
      } catch (err) {
        console.error('Erro ao buscar dados do perfil:', err);
        setErro('Não foi possível carregar os dados atuais. Tente recarregar a página.');
      } finally {
        setLoadingDados(false);
      }
    }

    carregarPerfil();
  }, [isAutenticado, usuario, isPrestador, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    // Validações básicas
    const telefoneLimpo = form.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setErro('O telefone deve ter entre 10 e 11 dígitos.');
      return;
    }

    if (!form.cidade.trim()) {
      setErro('A cidade é obrigatória.');
      return;
    }

    // Validação de alteração de senha
    const querAlterarSenha =
      form.senhaAtual.trim() !== '' ||
      form.novaSenha.trim() !== '' ||
      form.confirmarNovaSenha.trim() !== '';

    if (querAlterarSenha) {
      if (!form.senhaAtual) {
        setErro('Para alterar a senha, informe sua senha atual.');
        return;
      }

      if (!form.novaSenha || form.novaSenha.length < 8) {
        setErro('A nova senha deve ter no mínimo 8 caracteres.');
        return;
      }

      if (form.novaSenha !== form.confirmarNovaSenha) {
        setErro('A confirmação da nova senha não confere.');
        return;
      }

      // Valida se a senha atual está correta tentando autenticar
      try {
        await api.post('/auth/login', {
          email: usuario.email,
          senha: form.senhaAtual,
        });
      } catch {
        setErro('A senha atual informada está incorreta.');
        return;
      }
    }

    setSalvando(true);

    try {
      let categoriaFinal = form.catServico;
      if (isOutro && especialidadeOutro.trim() !== '') {
        categoriaFinal = especialidadeOutro.trim();
      }

      const payload = isPrestador
        ? {
            nome: usuario.nome,
            telefone: telefoneLimpo,
            cidade: form.cidade.trim(),
            catServico: categoriaFinal,
            exp: form.exp || '',
            ...(querAlterarSenha ? { senha: form.novaSenha } : {}),
          }
        : {
            nome: usuario.nome,
            telefone: telefoneLimpo,
            cidade: form.cidade.trim(),
            ...(querAlterarSenha ? { senha: form.novaSenha } : {}),
          };

      const endpoint = isPrestador
        ? `/prestadores/${usuario.id}`
        : `/clientes/${usuario.id}`;

      const res = await api.patch(endpoint, payload);

      // Atualiza o contexto de autenticação com os novos dados
      login({
        ...usuario,
        ...res.data,
        tipo: isPrestador ? 'PRESTADOR' : 'CLIENTE',
      });

      toast({
        title: 'Dados atualizados!',
        description: 'Suas informações foram salvas com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      // Retorna para o perfil do usuário
      navigate(isPrestador ? `/prestador/${usuario.id}` : `/cliente/${usuario.id}`);
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
      const msg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors[0]?.defaultMessage
          : null) ||
        'Não foi possível salvar as alterações.';
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Box bg="vemfix.pageBg" minH="100vh" py={{ base: 6, md: 10 }} px={4}>
      {/* Botão Voltar */}
      <Container maxW="640px" mb={4}>
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
      <Container maxW="640px">
        <Box
          bg="white"
          borderRadius="20px"
          p={{ base: 6, md: 10 }}
          boxShadow="0 2px 12px rgba(0, 0, 0, 0.05)"
          border="1px solid"
          borderColor="vemfix.border"
        >
          {/* Cabeçalho */}
          <VStack spacing={2} textAlign="center" mb={6}>
            <Heading
              as="h1"
              fontSize={{ base: '24px', md: '28px' }}
              fontWeight="800"
              fontFamily="heading"
              color="vemfix.dark"
            >
              Alterar Dados
            </Heading>
            <Text fontSize="14px" color="vemfix.graySubtitle">
              Mantenha suas informações sempre atualizadas
            </Text>

            {/* Badge de tipo puxado automaticamente da conta */}
            <Badge
              bg={isPrestador ? 'vemfix.greenLight' : 'blue.50'}
              color={isPrestador ? 'vemfix.green' : 'blue.600'}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="12px"
              fontWeight="700"
              mt={1}
            >
              {isPrestador ? 'Conta Prestador' : 'Conta Cliente'}
            </Badge>
          </VStack>

          {/* Mensagem de Erro (se houver) */}
          {erro && (
            <Alert status="error" borderRadius="xl" mb={6}>
              <AlertIcon />
              <Text fontSize="14px">{erro}</Text>
            </Alert>
          )}

          {loadingDados ? (
            <Flex justify="center" align="center" minH="240px" direction="column" gap={3}>
              <Spinner size="lg" color="vemfix.green" thickness="3px" />
              <Text fontSize="14px" color="vemfix.graySubtitle">
                Carregando seus dados...
              </Text>
            </Flex>
          ) : (
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
              {/* Telefone e Cidade */}
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                    Telefone
                  </FormLabel>
                  <Input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
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
                    value={form.cidade}
                    onChange={handleChange}
                    placeholder="Sua cidade"
                    focusBorderColor="vemfix.green"
                  />
                </FormControl>
              </SimpleGrid>

              {/* Campos específicos do Prestador */}
              {isPrestador && (
                <>
                  <FormControl isRequired>
                    <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                      Categoria de Serviço
                    </FormLabel>
                    <Select
                      name="catServico"
                      value={form.catServico}
                      focusBorderColor="vemfix.green"
                      onChange={(e) => {
                        handleChange(e);
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
                      value={form.exp}
                      onChange={handleChange}
                      placeholder="Conte um pouco sobre sua experiência e serviços prestados..."
                      focusBorderColor="vemfix.green"
                      rows={3}
                    />
                  </FormControl>
                </>
              )}

              {/* Seção Alterar Senha */}
              <Box w="100%" pt={3} borderTop="1px solid" borderColor="gray.100">
                <Text fontSize="14px" fontWeight="700" color="vemfix.dark" mb={0.5}>
                  Alterar Senha
                </Text>
                <Text fontSize="12px" color="vemfix.graySubtitle" mb={3}>
                  Preencha os campos abaixo apenas se desejar trocar sua senha.
                </Text>

                <VStack spacing={3} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                      Senha atual
                    </FormLabel>
                    <Input
                      type="password"
                      name="senhaAtual"
                      value={form.senhaAtual}
                      onChange={handleChange}
                      placeholder="Digite sua senha atual"
                      focusBorderColor="vemfix.green"
                    />
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                    <FormControl>
                      <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                        Nova senha
                      </FormLabel>
                      <Input
                        type="password"
                        name="novaSenha"
                        value={form.novaSenha}
                        onChange={handleChange}
                        placeholder="Mínimo 8 dígitos"
                        focusBorderColor="vemfix.green"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="13px" fontWeight="600" color="vemfix.dark">
                        Confirmar nova senha
                      </FormLabel>
                      <Input
                        type="password"
                        name="confirmarNovaSenha"
                        value={form.confirmarNovaSenha}
                        onChange={handleChange}
                        placeholder="Repita a nova senha"
                        focusBorderColor="vemfix.green"
                      />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </Box>

              {/* Botão Salvar Alterações */}
              <Button
                type="submit"
                bg="vemfix.green"
                color="white"
                w="100%"
                size="lg"
                mt={4}
                isLoading={salvando}
                _hover={{ bg: 'vemfix.greenDark' }}
              >
                Salvar Alterações
              </Button>
            </VStack>
          )}
        </Box>
      </Container>
    </Box>
  );
}
