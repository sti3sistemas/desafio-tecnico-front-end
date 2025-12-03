import { extendTheme } from '@chakra-ui/react';
import Table from './components/table';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: 'Lexend, sans-serif',
    body: 'Lexend, sans-serif',
  },
  components: {
    Table,
  },
});

export default theme;
