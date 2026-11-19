import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="vemfix.dark"
      color="white"
      py={8}
      px={{ base: 6, md: 8 }}
      mt="auto"
      w="100%"
    >
      <VStack maxW="1100px" mx="auto" spacing={3} textAlign="center">
        {/* Logo VemFix */}
        <HStack spacing={2.5} justify="center">
          <Flex
            w="32px"
            h="32px"
            bg="vemfix.green"
            color="white"
            borderRadius="8px"
            align="center"
            justify="center"
            fontWeight="800"
            fontSize="16px"
            fontFamily="heading"
          >
            V
          </Flex>
          <Text
            fontFamily="heading"
            fontSize="20px"
            fontWeight="800"
            color="white"
          >
            VemFix
          </Text>
        </HStack>

        {/* Texto institucional */}
        <Text fontSize="13px" color="#a0aec0" maxW="460px" lineHeight="1.6">
          Conectamos clientes e prestadores de serviço com confiança, agilidade e qualidade.
        </Text>

        {/* Direitos reservados */}
        <Text fontSize="12px" color="#718096" pt={1}>
          © {new Date().getFullYear()} VemFix – Todos os direitos reservados.
        </Text>
      </VStack>
    </Box>
  );
}
