const numericStyles = {
  '&[data-is-numeric=true]': {
    textAlign: 'end',
  },
};

const filledVariant = ({ colorScheme }) => ({
  th: { fontWeight: 'normal' },
  thead: {
    tr: {
      th: {
        px: 2,
        py: 3.5,
        color: 'black',
        bgColor: `${colorScheme}.100`,
        '&:first-of-type': {
          pl: { base: 8, md: 9, xl: 10 },
          borderTopLeftRadius: 'md',
        },
        '&:last-of-type': {
          pr: { base: 8, md: 9, xl: 10 },
          borderTopRightRadius: 'md',
        },
        ...numericStyles,
      },
    },
  },
  td: {
    whiteSpace: 'nowrap',
    px: 2,
    py: 2.5,
    position: 'relative',
    _after: {
      content: '" "',
      position: 'absolute',
      w: 'full',
      left: 0,
      bottom: 0,
      borderBottom: '1px',
      borderColor: `${colorScheme}.100`,
    },
    '&:first-of-type': {
      pl: { base: 8, md: 9, xl: 10 },
      _after: {
        w: {
          base: 'calc(100% - 1.25rem)', // "5" size
          md: 'calc(100% -  1.5rem)', // "6" size
          xl: 'calc(100% -  1.75rem)', // "7" size
        },
        ml: { base: 7, md: 6, xl: 7 },
      },
    },
    '&:last-of-type': {
      pr: { base: 8, md: 9, xl: 10 },
      _after: {
        w: {
          base: 'calc(100% - 1.25rem)', // "5" size
          md: 'calc(100% -  1.5rem)', // "6" size
          xl: 'calc(100% -  1.75rem)', // "7" size
        },
        mr: { base: 7, md: 6, xl: 7 },
      },
    },
    ...numericStyles,
  },
  tr: {
    '&:last-of-type > td': {
      _after: {
        display: 'none',
      },
    },
  },
  tfoot: {
    tr: {
      th: {
        px: { base: 6, md: 7, xl: 8 },
        position: 'relative',
        _after: {
          content: '" "',
          position: 'absolute',
          left: 0,
          top: 0,
          w: {
            base: 'calc(100% - 2 * 1.5rem)', // "6" size
            md: 'calc(100% - 2 * 1.75rem)', // "7" size
            xl: 'calc(100% - 2 * 2.5rem)', // "8" size
          },
          ml: { base: 6, md: 7, xl: 8 },
          borderTop: '1px',
          borderColor: `${colorScheme}.100`,
        },

        '&:first-of-type': {
          borderBottomLeftRadius: 'md',
        },
        '&:last-of-type': {
          borderBottomRightRadius: 'md',
        },
        ...numericStyles,
      },
    },
  },
});

const Table = {
  baseStyle: {
    th: {
      textTransform: 'none',
      color: 'gray.400',
    },
  },

  sizes: {
    sm: {
      th: {
        fontSize: '2xs',
        fontWeight: 'light',
      },
      td: {
        fontSize: 'xs',
      },
    },
  },

  variants: {
    filled: filledVariant,
  },
};

export default Table;
