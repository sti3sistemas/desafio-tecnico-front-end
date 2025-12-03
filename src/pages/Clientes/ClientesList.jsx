import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteClient, listClients } from '../../api/clients';

const ClientesList = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');

  const obterClientes = async () => {
    setLoading(true);
    try {
      const data = await listClients();
      const produtos = await listClients();
      setClientes(Array.isArray(data) ? data : []);
    } catch (e) {
      toast({
        status: 'error',
        title: 'Não foi possível visualizar os clientes',
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obterClientes();
  }, []);

  const clientesFiltrados = useMemo(() => {
    if (!busca) return clientes;
    const textoBusca = busca.toLowerCase().trim();
    return clientes.filter((cliente) => {
      const nome = cliente?.nome?.toLowerCase() ?? '';
      const email = cliente?.email?.toLowerCase() ?? '';
      const telefone = cliente?.telefone?.toLowerCase() ?? '';
      return (
        nome.includes(textoBusca) || email.includes(textoBusca) || telefone.includes(textoBusca)
      );
    });
  }, [clientes, busca]);

  const excluirCliente = async (cliente) => {
    if (!cliente) return;
    setLoading(true);
    const ok = window.confirm(`Deseja remover o cliente "${cliente.nome}"?`);
    if (!ok) return;
    try {
      await deleteClient(cliente.id);
      toast({ status: 'success', title: 'Cliente removido' });
      await obterClientes();
    } catch (e) {
      toast({
        status: 'error',
        title: 'Não foi possível remover o cliente',
        description: e.message,
      });
    } finally {
      setLoading(true);
    }
  };

  return (
    <Stack spacing={8}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        gap={4}
        align="flex-start"
      >
        <Box>
          <Heading size="lg" mb={2}>
            Clientes
          </Heading>
        </Box>
        <Button
          colorScheme="red"
          borderRadius="6px"
          onClick={() => navigate('/clientes/cadastrar')}
          h="48px"
          w="200px"
        >
          Cadastrar novo
        </Button>
      </Flex>
      <Box
        bg="white"
        borderRadius="6px"
        boxShadow="md"
        borderWidth="1px"
        borderColor="gray.100"
        p={{ base: 4, md: 6 }}
      >
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={5}>
          <InputGroup maxW={{ base: '100%', md: '520px' }}>
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Inserir placeholder"
              borderRadius="6px"
              bg="gray.50"
            />
          </InputGroup>
          <Flex w="full" justify="flex-end">
            <Button
              variant="solid"
              alignSelf={{ base: 'stretch', md: 'flex-start' }}
              onClick={obterClientes}
              w="160px"
              isDisabled={loading}
            >
              Atualizar
            </Button>
          </Flex>
        </Stack>

        <>
          <Box overflowX="auto">
            <Table variant="filled">
              <Thead>
                <Tr>
                  <Th>Telefone</Th>
                  <Th>E-mail</Th>
                  <Th>Nome</Th>
                  <Th textAlign="right">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Td colSpan={4}>
                    <Stack align="center" py={12}>
                      <Spinner /> <Text>Carregando...</Text>
                    </Stack>
                  </Td>
                ) : (
                  <>
                    {clientesFiltrados?.map((c) => (
                      <Tr key={c.id}>
                        <Td>
                          <Text>{c.email}</Text>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Text>{c.telefone || '-'}</Text>
                            {!c.telefone && (
                              <Badge colorScheme="orange" variant="subtle">
                                Sem telefone
                              </Badge>
                            )}
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontWeight="semibold">{c.nome}</Text>
                        </Td>
                        <Td textAlign="right">
                          <Stack direction="row" justify="flex-end" spacing={2}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/clientes/alterar/${c.id}`)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              onClick={() => navigate(`/clientes/alterar/${c.id}`)}
                            >
                              Excluir
                            </Button>
                          </Stack>
                        </Td>
                      </Tr>
                    ))}
                    {clientesFiltrados?.length === 0 && (
                      <Tr h="168px">
                        <Td colSpan={4}>
                          <Text py={6} textAlign="center" color="gray.500">
                            Nenhum cliente encontrado com o filtro informado.
                          </Text>
                        </Td>
                      </Tr>
                    )}
                  </>
                )}
              </Tbody>
            </Table>
          </Box>
          <Text mt={4} color="gray.600">
            Exibindo {clientesFiltrados?.length} de {clientes?.length} produtos
          </Text>
        </>
      </Box>
    </Stack>
  );
};

export default ClientesList;
