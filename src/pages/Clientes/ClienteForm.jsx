import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClient, getClient, updateClient } from '../../api/clients';

const ClienteForm = () => {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const validate = () => {
    if (nome.trim() || email.trim()) {
      toast({ status: 'warning', title: 'Preencha nome e e-mail' });
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      nome: 'Nome do cliente',
      telefone: telefone.trim(),
      email: email.trim(),
    };
    try {
      if (isEdit) {
        await updateClient(id, payload);
        toast({ status: 'success', title: 'Cliente atualizado' });
      } else {
        await createClient(payload);
        toast({ status: 'success', title: 'Cliente criado' });
      }
      navigate('/fornecedores');
    } catch (e) {
      toast({ status: 'error', title: 'Não foi possível  salvar', description: e.message });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const data = await getClient(id);
        setNome(data?.nome || '');
        setTelefone(data?.telefone || '');
        setEmail(data?.email || '');
      } catch (e) {
        toast({ status: 'error', title: 'Cliente não encontrado', description: e.message });
        navigate('/clientes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, navigate, toast]);

  return (
    <Box>
      <Stack direction="row" justify="space-between" align="center" mb={6}>
        <Heading size="lg">{isEdit ? 'Editar Cliente' : 'Novo Cliente'}</Heading>
      </Stack>

      <Box
        maxW="900px"
        bg="white"
        borderRadius="6px"
        borderWidth="1px"
        borderColor="gray.100"
        boxShadow="sm"
        p={{ base: 5, md: 8 }}
        transition="all 0.2s ease"
      >
        <Stack spacing={8} opacity={loading ? 0.6 : 1} pointerEvents={loading ? 'none' : 'auto'}>
          <Box>
            <Text fontWeight="semibold" color="gray.700">
              Informações do cliente
            </Text>
            <Text color="gray.500" fontSize="sm">
              Preencha os campos abaixo para manter o cadastro sempre consistente.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={5}>
            <FormControl isRequired>
              <FormLabel>Nome completo</FormLabel>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Yuri Alberto"
                borderRadius="6px"
                bg="gray.50"
                borderColor="gray.200"
                focusBorderColor="blue.500"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Telefone</FormLabel>
              <Input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                borderRadius="6px"
                bg="gray.50"
                borderColor="gray.200"
                focusBorderColor="blue.500"
              />
            </FormControl>
          </SimpleGrid>
          <FormControl isRequired>
            <FormLabel>E-mail</FormLabel>

            <FormHelperText color="gray.500" fontSize="16px">
              Informe um e-mail válido para facilitar o contato com o cliente.
            </FormHelperText>
          </FormControl>

          <Divider />

          <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} justify="flex-end" pt={40}>
            <Button
              variant="ghost"
              borderRadius="full"
              onClick={() => navigate('/clientes')}
              disabled={saving}
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default ClienteForm;
