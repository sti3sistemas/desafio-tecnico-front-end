import { Flex, Text } from '@chakra-ui/react';

const AssinaturaAutor = ({ authorName = 'Seu nome' }) => (
  <Flex align="center" px={{ base: 4, md: 8 }} py={{ base: 3, md: 6 }} gap={4}>
    <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600" color="black">
      Feito por <Text as="span" fontWeight="extrabold">{`${authorName}`}</Text>
    </Text>
  </Flex>
);

export default AssinaturaAutor;
