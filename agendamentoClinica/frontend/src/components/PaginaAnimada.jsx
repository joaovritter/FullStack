// ============================================================================
//  PaginaAnimada.jsx  —  Wrapper de animação de entrada de página (framer-motion)
// ============================================================================
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

export default function PaginaAnimada({ titulo, subtitulo, acao, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5">{titulo}</Typography>
          {subtitulo && (
            <Typography variant="body2" color="text.secondary">
              {subtitulo}
            </Typography>
          )}
        </Box>
        {acao}
      </Box>
      {children}
    </motion.div>
  );
}
