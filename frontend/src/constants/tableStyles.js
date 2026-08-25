export const dataTableCustomStyles = {
  table: {
    style: {
      borderRadius: '0.75rem',
      overflow: 'hidden',
    },
  },
  headRow: {
    style: {
      backgroundColor: '#0F172A',
      minHeight: '44px',
      borderTopLeftRadius: '0.75rem',
      borderTopRightRadius: '0.75rem',
    },
  },
  headCells: {
    style: {
      color: '#ffffff',
      fontSize: '0.8rem',
      fontWeight: '600',
      paddingLeft: '6px',
      paddingRight: '6px',
    },
  },
  rows: {
    style: {
      minHeight: '48px',
      fontSize: '0.8rem',
      color: '#1e293b',
      '&:hover': {
        backgroundColor: '#f8fafc',
      },
    },
  },
  cells: {
    style: {
      paddingLeft: '6px',
      paddingRight: '6px',
    },
  },
  pagination: {
    style: {
      borderTop: '1px solid #e2e8f0',
      minHeight: '52px',
    },
  },
};
