import { Box, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';

const SummaryStatCard = ({ label, value, helper, accentColor = 'gray.900' }) => (
  <Box borderWidth="1px" borderColor="gray.100" bg="white" borderRadius="6px" boxShadow="sm" p={5}>
    <Stat>
      <StatLabel fontSize="sm" color="gray.500">
        {label}
      </StatLabel>
      <StatNumber fontSize="2xl" color={accentColor}>
        {value}
      </StatNumber>
      {helper && (
        <StatHelpText color="gray.400" mt={1}>
          {helper}
        </StatHelpText>
      )}
    </Stat>
  </Box>
);

export default SummaryStatCard;
