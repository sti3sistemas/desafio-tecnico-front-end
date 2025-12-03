import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  SimpleGrid,
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
import { deleteProduct, listProducts } from '../../api/products';
import SummaryStatCard from '../../components/SummaryStatCard';

const ProdutosList = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');

  const obterProdutos = async () => {
    setLoading(true);
    try {
      const data = await listProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      toast({ status: 'error', title: 'Erro ao carregar produtos', description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!query) return products;
  }, [products, query]);

  const totalEstoque = 0;
  const produtosSemEstoque = 0;
  const precoMedio = 0;

  const formatarPrecoEmReais = (valor) => {
    const numero = Number(valor);
    if (Number.isNaN(numero)) return 'R$ 0,00';

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(numero);
  };

  const excluirProduto = async (prod) => {
    if (!prod) return;
    const ok = window.confirm(`Tem certeza que deseja excluir "${prod.nome}"?`);
    if (!ok) return;
    try {
      await deleteProduct(prod.id);
      toast({ status: 'success', title: 'Produto excluído' });
      await obterProdutos();
    } catch (e) {
      toast({ status: 'error', title: 'Erro ao excluir', description: e.message });
    }
  };

  const stats = [
    {
      label: 'Produtos cadastrados',
      value: 0,
      helper: 'Catálogo completo',
    },
    {
      label: 'Sem estoque',
      value: 0,
      helper: 'Precisa reposição',
      accentColor: 'red.500',
    },
    { label: 'Preço médio', value: 0, helper: 'Baseado no catálogo' },
    {
      label: 'Itens em estoque',
      value: 0,
      helper: 'Soma das unidades',
    },
  ];

  useEffect(() => {
    obterProdutos();
  }, []);

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
            Produtos
          </Heading>
          <Text color="gray.500">Visualize rapidamente estoque e precos.</Text>
        </Box>
        <Button
          colorScheme="green"
          borderRadius="6px"
          onClick={() => navigate('/produtos/cadastrar')}
          h="48px"
          w="200px"
        >
          Novo
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        {stats.map((stat) => (
          <SummaryStatCard key={stat.label} {...stat} />
        ))}
      </SimpleGrid>

      <Box
        bg="white"
        borderRadius="6px"
        boxShadow="md"
        borderWidth="1px"
        borderColor="gray.100"
        p={{ base: 4, md: 6 }}
      >
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={5} align="stretch">
          <InputGroup maxW={{ base: '100%', md: '520px' }}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou descrição"
              borderRadius="6px"
              bg="gray.50"
            />
          </InputGroup>
          <Flex w="full" justify="flex-end">
            <Button
              variant="solid"
              alignSelf={{ base: 'stretch', md: 'flex-start' }}
              onClick={obterProdutos}
              w="160px"
              isLoading={loading}
            >
              Atualizar
            </Button>
          </Flex>
        </Stack>

        {loading ? (
          <Stack align="center" py={12}>
            <Spinner /> <Text>Carregando...</Text>
          </Stack>
        ) : (
          <>
            <Box overflowX="auto">
              <Table variant="filled">
                <Thead>
                  <Tr>
                    <Th>Produto</Th>
                    <Th isNumeric>Preço (R$)</Th>
                    <Th isNumeric>Estoque</Th>
                    <Th textAlign="right">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredProducts.map((p) => {
                    const estoque = Number.isFinite(Number(p?.estoque)) ? Number(p.estoque) : 0;
                    const precoEmReais = formatarPrecoEmReais(Number(p.preco || 0).toFixed(2));
                    const estoqueStatus =
                      estoque <= 0 ? (
                        <Badge colorScheme="red" variant="subtle">
                          Sem estoque
                        </Badge>
                      ) : estoque < 5 ? (
                        <Badge colorScheme="orange" variant="subtle">
                          Baixo
                        </Badge>
                      ) : null;

                    return (
                      <Tr key={p.id}>
                        <Td maxW={{ base: '100%', md: '440px' }}>
                          <Text fontWeight="semibold">{p.nome}</Text>
                          <Text
                            color="gray.500"
                            fontSize="sm"
                            maxW={{ base: '100%', md: '840px' }}
                            whiteSpace="normal"
                            wordBreak="break-word"
                          >
                            {p.descricao || 'Sem descrição'}
                          </Text>
                        </Td>
                        <Td isNumeric>{precoEmReais}</Td>
                        <Td isNumeric>
                          <HStack justify="flex-end" spacing={2}>
                            <Text as="span" fontWeight={estoque <= 0 ? 'bold' : 'medium'}>
                              {estoque}
                            </Text>
                            {estoqueStatus}
                          </HStack>
                        </Td>
                        <Td textAlign="right">
                          <Stack direction="row" justify="flex-end" spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              onClick={() => excluirProduto(p)}
                            >
                              Excluir
                            </Button>
                          </Stack>
                        </Td>
                      </Tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <Tr>
                      <Td colSpan={5}>
                        <Text py={6} textAlign="center" color="gray.500">
                          Nenhum produto encontrado com o filtro informado.
                        </Text>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </>
        )}
      </Box>
    </Stack>
  );
};

export default ProdutosList;
