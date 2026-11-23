import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Badge,
  Image,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { FaFilePdf, FaDownload, FaExpandAlt } from 'react-icons/fa';
import { baixarOrcamentoPDF } from '../utils/orcamentoPdf';

export default function OrcamentoCard({ orcamento, onExpand }) {
  if (!orcamento) return null;

  const formatarData = (d) => {
    if (!d) return new Date().toLocaleDateString('pt-BR');
    if (Array.isArray(d)) {
      const [ano, mes, dia] = d;
      return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
    }
    const data = new Date(d);
    return isNaN(data.getTime())
      ? new Date().toLocaleDateString('pt-BR')
      : data.toLocaleDateString('pt-BR');
  };

  const dataFormatada = formatarData(orcamento.dataHora);

  const valorFormatado = Number(orcamento.valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const temFoto =
    orcamento.anexo &&
    orcamento.anexo.trim() !== '' &&
    orcamento.anexo !== 'string';

  const handleDownload = (e) => {
    e.stopPropagation();
    baixarOrcamentoPDF(orcamento);
  };

  return (
    <Box
      w="100%"
      maxW={{ base: '320px', sm: '360px' }}
      bg="#121316"
      color="white"
      borderRadius="16px"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 4px 16px rgba(0, 0, 0, 0.25)"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s ease"
      _hover={{
        borderColor: 'vemfix.green',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(26, 158, 110, 0.25)',
      }}
      onClick={() => onExpand && onExpand(orcamento)}
    >
      {/* Topo do Card com Badge e Botão de Download */}
      <Flex
        justify="space-between"
        align="center"
        px={3.5}
        py={2.5}
        bg="whiteAlpha.50"
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
      >
        <HStack spacing={2}>
          <IconButton
            aria-label="Baixar PDF"
            icon={<FaDownload />}
            size="xs"
            variant="ghost"
            color="vemfix.green"
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={handleDownload}
            title="Baixar em PDF"
          />
          <Badge
            bg="vemfix.greenLight"
            color="vemfix.green"
            fontSize="10.5px"
            fontWeight="800"
            px={2}
            py={0.5}
            borderRadius="full"
          >
            Orçamento Oficial
          </Badge>
        </HStack>

        <Icon as={FaFilePdf} color="red.400" fontSize="16px" />
      </Flex>

      {/* Conteúdo do Card */}
      <Box p={3.5}>
        {/* Título e Valor */}
        <Flex justify="space-between" align="flex-start" gap={2} mb={1}>
          <Text
            fontSize="14.5px"
            fontWeight="800"
            color="white"
            noOfLines={1}
            title={orcamento.titulo}
          >
            {orcamento.titulo || 'Orçamento de Serviço'}
          </Text>
        </Flex>

        <Text fontSize="18px" fontWeight="900" color="vemfix.green" mb={2}>
          {valorFormatado}
        </Text>

        {/* Informações Resumidas */}
        <VStack spacing={1} align="stretch" fontSize="11.5px" color="whiteAlpha.700" mb={2.5}>
          <Flex justify="space-between">
            <Text color="whiteAlpha.500">Data:</Text>
            <Text fontWeight="600">{dataFormatada}</Text>
          </Flex>

          <Flex justify="space-between">
            <Text color="whiteAlpha.500">Cliente:</Text>
            <Text fontWeight="600" noOfLines={1}>
              {orcamento.clienteNome || 'Cliente'}
            </Text>
          </Flex>

          {orcamento.cep && (
            <Flex justify="space-between">
              <Text color="whiteAlpha.500">CEP do Local:</Text>
              <Text fontWeight="600">{orcamento.cep}</Text>
            </Flex>
          )}

          {orcamento.prestadorNome && (
            <Flex justify="space-between">
              <Text color="whiteAlpha.500">Prestador:</Text>
              <Text fontWeight="600" noOfLines={1}>
                {orcamento.prestadorNome}
              </Text>
            </Flex>
          )}
        </VStack>

        {/* Snippet do Serviço */}
        {orcamento.descServico && (
          <Box
            bg="#1E2026"
            p={2}
            borderRadius="8px"
            fontSize="11.5px"
            color="whiteAlpha.800"
            mb={2.5}
            noOfLines={2}
          >
            <Text as="span" fontWeight="700" color="whiteAlpha.600">
              Serviço:{' '}
            </Text>
            {orcamento.descServico}
          </Box>
        )}

        {/* Foto em miniatura */}
        {temFoto && (
          <Box
            borderRadius="8px"
            overflow="hidden"
            bg="#1E2026"
            mb={2.5}
            maxH="110px"
            textAlign="center"
          >
            <Image
              src={orcamento.anexo}
              alt="Foto do problema"
              maxH="110px"
              w="100%"
              objectFit="cover"
            />
          </Box>
        )}

        {/* Rodapé com Dica de Clique para Expandir */}
        <Flex
          justify="center"
          align="center"
          gap={1.5}
          pt={2}
          borderTop="1px dashed"
          borderColor="whiteAlpha.100"
          color="whiteAlpha.600"
          fontSize="11px"
          fontWeight="500"
        >
          <Icon as={FaExpandAlt} fontSize="10px" />
          <Text>Clique para expandir e ver detalhes</Text>
        </Flex>
      </Box>
    </Box>
  );
}
