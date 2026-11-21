import { Box, Flex, HStack, Text, Icon, useToast } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAutenticado, usuario } = useAuth();

  // Extrai iniciais do nome do usuário logado
  const getIniciais = (nome) => {
    if (!nome) return '';
    const partes = nome.trim().split(' ').filter(Boolean);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

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
      toast({
        title: `Perfil de ${usuario?.nome || 'Usuário'}`,
        description: 'A tela de perfil será implementada nas próximas etapas.',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
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
      >
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
        <HStack spacing={{ base: 4, md: 8 }} display={{ base: 'none', sm: 'flex' }}>
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
            transition="color 0.2s"
          >
            Pesquisar
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
            transition="color 0.2s"
          >
            Suporte
          </Text>
        </HStack>

        {/* Perfil do Usuário */}
        <HStack spacing={3}>
          <Flex
            align="center"
            justify="center"
            w="38px"
            h="38px"
            borderRadius="full"
            bg="vemfix.greenLight"
            color="vemfix.green"
            fontWeight="700"
            fontSize="14px"
            cursor="pointer"
            onClick={handlePerfil}
            _hover={{ transform: 'scale(1.05)', bg: 'brand.100' }}
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
