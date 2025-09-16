import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TripList from '../components/trips/TripList';
import { useAuth } from '../context/AuthContext';
import travelingSvg from '../assets/undraw_traveling_yhxq.svg';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const WelcomeMessage = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        bgcolor: 'background.default',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <img
        src={travelingSvg}
        alt="Start your journey"
        style={{
          maxWidth: '320px',
          width: '100%',
          height: 'auto',
        }}
      />
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
        Welcome to Planventure!
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 600, mb: 3, lineHeight: 1.6 }}
      >
        Ready to start planning your next adventure? Create your first trip and let us help you organize everything from destinations to activities.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        onClick={() => navigate('/trips/new')}
        sx={{
          px: 4,
          py: 1.5,
          fontWeight: 600,
          borderRadius: 2,
          transition: 'all 0.3s',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        Plan Your First Trip
      </Button>
    </Box>
  );

  const ErrorState = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <img
        src={travelingSvg}
        alt="Error loading trips"
        style={{
          maxWidth: '300px',
          width: '100%',
          height: 'auto',
          opacity: 0.7,
        }}
      />
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
        Oops! Looks like our compass is spinning! 🧭
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 600, mb: 3, lineHeight: 1.6 }}
      >
        We're having trouble loading your adventures. Don't worry, even the best travelers sometimes lose their way! Try refreshing the page or come back later.
      </Typography>
      <Button
        variant="contained"
        onClick={() => window.location.reload()}
        sx={{
          px: 4,
          py: 1.5,
          fontWeight: 600,
          borderRadius: 2,
          transition: 'all 0.3s',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        Try Again
      </Button>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
        My Trips
      </Typography>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '60vh',
          borderRadius: 3,
        }}
      >
        <TripList WelcomeMessage={WelcomeMessage} ErrorState={ErrorState} />
      </Paper>
    </Box>
  );
};

export default Dashboard;
