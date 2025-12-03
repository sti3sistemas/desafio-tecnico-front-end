import {
  Badge,
  Box,
  Divider,
  HStack,
  Icon,
  Switch,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { isMocksEnabled, setMocksEnabled } from '../mocks/browser';
import AssinaturaAutor from './AssinaturaAutor';
import Sti3Logo from './Sti3Logo';

const ProductsIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M3 8.25L12 3l9 5.25-9 5.25-9-5.25z" opacity="0.85" />
    <path
      fill="currentColor"
      d="M3 10.75l9 5.25 9-5.25V18a2 2 0 01-1.113 1.8l-6 3a2 2 0 01-1.774 0l-6-3A2 2 0 013 18v-7.25z"
    />
  </Icon>
);

const UsersIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M7 6a5 5 0 1110 0 5 5 0 01-10 0zm5 7c6.075 0 11 3.134 11 7v2H1v-2c0-3.866 4.925-7 11-7z"
    />
  </Icon>
);

const OrdersIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M8 4a2 2 0 012-2h4a2 2 0 012 2v1h2.5A2.5 2.5 0 0121 7.5v11A3.5 3.5 0 0117.5 22h-11A3.5 3.5 0 013 18.5v-11A2.5 2.5 0 015.5 5H8V4zm2 1h4V4h-4v1zm2 6.25a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zm-4.25 5.5a.75.75 0 010-1.5h8.5a.75.75 0 010 1.5h-8.5z"
    />
  </Icon>
);

const NavItem = ({ to, label, icon }) => (
  <NavLink to={to} end={to === '/'}>
    {({ isActive }) => (
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        px={3}
        py={2}
        borderRadius="md"
        color={isActive ? 'brand.700' : 'gray.700'}
        bg={isActive ? 'gray.100' : 'transparent'}
        _hover={{ bg: 'gray.100' }}
        cursor="pointer"
      >
        {icon}
        <Text fontWeight={isActive ? 'semibold' : 'medium'}>{label}</Text>
      </Box>
    )}
  </NavLink>
);

const Sidebar = () => {
  const toast = useToast();
  const [mocks, setMocks] = useState(true);

  useEffect(() => {
    setMocks(isMocksEnabled());
  }, []);

  const toggleMocks = async () => {
    const next = !mocks;
    setMocks(next);
    await setMocksEnabled(next);
    toast({ status: 'info', title: `Mocks ${next ? 'ativados' : 'desativados'}`, duration: 1200 });
  };

  return (
    <Box
      as="aside"
      w={{ base: '68px', md: '240px' }}
      minH="100vh"
      bg="white"
      borderRightWidth="1px"
      position="sticky"
      top={0}
    >
      <Box
        px={4}
        py={5}
        display="flex"
        alignItems="center"
        justifyContent={{ base: 'center', md: 'flex-start' }}
      >
        <Sti3Logo width={65} />
      </Box>
      <Divider />
      <VStack align="stretch" spacing={1} px={2} py={3}>
        <NavItem to="/clientes" label="Clientes" icon={<UsersIcon />} />
        <NavItem to="/produtos" label="Produtos" icon={<ProductsIcon />} />
      </VStack>
      <Box position="absolute" bottom={0} w="100%" px={3} py={3}>
        <HStack justify="space-between" mb={2}>
          <Text fontSize="sm">Mocks API</Text>
          <HStack>
            <Badge colorScheme={mocks ? 'green' : 'red'}>{mocks ? 'ON' : 'OFF'}</Badge>
            <Switch isChecked={mocks} onChange={toggleMocks} />
          </HStack>
        </HStack>
        <AssinaturaAutor />
      </Box>
    </Box>
  );
};

export default Sidebar;
