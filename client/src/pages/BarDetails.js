import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const BarDetails = () => {
  const { barId } = useParams();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Bar Details
        </Typography>
        <Typography variant="body1">
          Bar ID: {barId}
        </Typography>
      </Box>
    </Container>
  );
};

export default BarDetails; 