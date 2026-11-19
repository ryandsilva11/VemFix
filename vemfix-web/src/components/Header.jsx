import { Box, Flex, HStack, Text, Icon, Avatar } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
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
        <HStack spacing={2.5} cursor="pointer" userSelect="none">
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
            cursor="pointer"
            _hover={{ transform: 'scale(1.05)', bg: 'brand.100' }}
            transition="all 0.2s"
            boxShadow="0 1px 3px rgba(0,0,0,0.05)"
          >
            <Icon as={FaUserCircle} w={6} h={6} />
          </Flex>
        </HStack>
      </Flex>
    </Box>
  );
}
