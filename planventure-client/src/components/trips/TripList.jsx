import { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TripCard from './TripCard';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';

const TripList = ({ WelcomeMessage, ErrorState }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const data = await tripService.getAllTrips();
        if (!data || !data.trips) {
          setError('Unexpected data format received');
          return;
        }
        setTrips(data.trips);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Loading state with skeleton cards
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((skeleton) => (
          <Grid item xs={12} sm={6} md={4} key={skeleton}>
            <TripCard loading={true} />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Error state
  if (error) {
    return <ErrorState />;
  }

  // Empty state
  if (trips.length === 0) {
    return <WelcomeMessage />;
  }

  // Loaded state with trips
  return (
    <Grid container spacing={3}>
      {trips.map((trip) => (
        <Grid item xs={12} sm={6} md={4} key={trip.id}>
          <TripCard trip={trip} />
        </Grid>
      ))}

      {/* Add New Trip Button */}
      <Grid item xs={12} sm={6} md={4}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/trips/new')}
          sx={{
            height: '100%',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: 'primary.main',
            borderRadius: 3,
            transition: 'all 0.3s',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'primary.light',
              color: 'white',
              transform: 'scale(1.03)',
            },
          }}
        >
          <AddIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Trip
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default TripList;
