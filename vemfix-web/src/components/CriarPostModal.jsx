import { useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Flex,
  VStack,
  Text,
  Input,
  Textarea,
  Button,
  IconButton,
  FormControl,
  FormLabel,
  Image,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { FaTimes, FaImage, FaTrash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function CriarPostModal({ isOpen, onClose, onPostCriado }) {
  const { usuario } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [titulo, setTitulo] = useState('');
  const [anexo, setAnexo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Seleção e conversão de imagem para base64
  const handleSelecionarArquivo = (e) => {
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
      setAnexo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoverAnexo = () => {
    setAnexo('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePublicar = async () => {
    if (!titulo.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, informe o título do seu post.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!usuario?.id) {
      toast({
        title: 'Sessão expirada',
        description: 'Faça login novamente para publicar.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setEnviando(true);
    try {
      const payload = {
        titulo: titulo.trim(),
        anexo: anexo || '',
        descricao: descricao.trim() || '',
      };

      const res = await api.post(`/posts/${usuario.id}`, payload);

      toast({
        title: 'Post publicado!',
        description: 'Seu trabalho foi compartilhado com sucesso no feed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Limpa os campos
      setTitulo('');
      setAnexo('');
      setDescricao('');

      if (onPostCriado) {
        onPostCriado(res.data);
      }

      onClose();
    } catch (err) {
      console.error('Erro ao publicar post:', err);
      toast({
        title: 'Erro ao publicar',
        description: 'Não foi possível publicar seu post. Tente novamente.',
        status: 'error',
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(3px)" />
      <ModalContent
        bg="white"
        borderRadius="20px"
        border="1px solid"
        borderColor="vemfix.border"
        boxShadow="0 20px 40px rgba(0, 0, 0, 0.12)"
        overflow="hidden"
        maxW={{ base: '92%', md: '520px' }}
      >
        <ModalBody p={{ base: 5, md: 6 }}>
          {/* Header do Modal com botão fechar */}
          <Flex justify="space-between" align="center" mb={1}>
            <Box />
            <IconButton
              aria-label="Fechar"
              icon={<FaTimes />}
              size="sm"
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'vemfix.dark', bg: 'gray.100' }}
              borderRadius="full"
              onClick={onClose}
            />
          </Flex>

          {/* Título e Subtítulo */}
          <VStack spacing={1} mb={5} textAlign="center">
            <Text
              fontSize="22px"
              fontWeight="800"
              color="vemfix.dark"
              letterSpacing="-0.3px"
            >
              Criar Post
            </Text>
            <Text fontSize="13.5px" color="vemfix.graySubtitle">
              Compartilhe seu trabalho com a comunidade
            </Text>
          </VStack>

          {/* Formulário */}
          <VStack spacing={4} align="stretch">
            {/* Título do Post */}
            <FormControl isRequired>
              <FormLabel
                fontSize="13px"
                fontWeight="700"
                color="vemfix.dark"
                mb={1.5}
              >
                Título (obrigatório)
              </FormLabel>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título do seu post"
                bg="gray.50"
                border="1px solid"
                borderColor="vemfix.border"
                borderRadius="10px"
                fontSize="14px"
                h="42px"
                _hover={{ borderColor: 'gray.300', bg: 'white' }}
                _focus={{
                  bg: 'white',
                  borderColor: 'vemfix.green',
                  boxShadow: '0 0 0 1px #1A9E6E',
                }}
              />
            </FormControl>

            {/* Upload de Anexos */}
            <FormControl>
              <FormLabel
                fontSize="13px"
                fontWeight="700"
                color="vemfix.dark"
                mb={1.5}
              >
                Anexos
              </FormLabel>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleSelecionarArquivo}
              />

              {anexo ? (
                <Box
                  position="relative"
                  borderRadius="12px"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="vemfix.border"
                  bg="gray.50"
                  p={2}
                  textAlign="center"
                >
                  <Image
                    src={anexo}
                    alt="Anexo selecionado"
                    maxH="200px"
                    mx="auto"
                    borderRadius="8px"
                    objectFit="contain"
                  />
                  <Flex justify="center" gap={2} mt={2}>
                    <Button
                      size="xs"
                      variant="outline"
                      borderColor="gray.300"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Trocar Imagem
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      leftIcon={<FaTrash />}
                      onClick={handleRemoverAnexo}
                    >
                      Remover
                    </Button>
                  </Flex>
                </Box>
              ) : (
                <Box
                  border="1.5px dashed"
                  borderColor="gray.300"
                  borderRadius="12px"
                  bg="gray.50"
                  py={6}
                  px={4}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ borderColor: 'vemfix.green', bg: 'gray.100' }}
                  transition="all 0.2s"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <VStack spacing={2}>
                    <Icon as={FaImage} fontSize="26px" color="vemfix.green" />
                    <Text
                      fontSize="13px"
                      color="vemfix.grayBody"
                      fontWeight="600"
                    >
                      Adicionar Anexos (fotos ou vídeos)
                    </Text>
                  </VStack>
                </Box>
              )}
            </FormControl>

            {/* Descrição do Post */}
            <FormControl>
              <FormLabel
                fontSize="13px"
                fontWeight="700"
                color="vemfix.dark"
                mb={1.5}
              >
                Descrição (opcional)
              </FormLabel>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva seu trabalho..."
                bg="gray.50"
                border="1px solid"
                borderColor="vemfix.border"
                borderRadius="10px"
                fontSize="13.5px"
                minH="90px"
                resize="vertical"
                _hover={{ borderColor: 'gray.300', bg: 'white' }}
                _focus={{
                  bg: 'white',
                  borderColor: 'vemfix.green',
                  boxShadow: '0 0 0 1px #1A9E6E',
                }}
              />
            </FormControl>

            {/* Botão Publicar */}
            <Button
              bg="vemfix.green"
              color="white"
              borderRadius="12px"
              h="46px"
              fontSize="14.5px"
              fontWeight="700"
              mt={2}
              _hover={{ bg: 'vemfix.greenDark', transform: 'scale(1.01)' }}
              _active={{ bg: 'vemfix.greenDark' }}
              transition="all 0.2s"
              onClick={handlePublicar}
              isLoading={enviando}
              loadingText="Publicando..."
            >
              Publicar Post
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
