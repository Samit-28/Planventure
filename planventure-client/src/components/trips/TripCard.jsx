import { 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Button,
  Box,
  Skeleton
} from '@mui/material';
import { 
  LocationOn, 
  DateRange,
  ArrowForward 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card 
        sx={{ 
          width: '100%', 
          borderRadius: 2, 
          boxShadow: 3, 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        {/* Top square skeleton */}
        <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '1 / 1' }} />
        
        <CardContent>
          <Skeleton variant="text" height={32} width="80%" />
          <Skeleton variant="text" height={24} width="60%" />
          <Skeleton variant="text" height={24} width="40%" />
        </CardContent>

        <CardActions>
          <Skeleton variant="rectangular" width="100%" height={36} />
        </CardActions>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        width: '100%', 
        borderRadius: 2, 
        boxShadow: 3, 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}
    >
      {/* Top square area */}
      <Box 
        sx={{ 
          width: '100%', 
          aspectRatio: '1 / 1', // always square
          backgroundColor: '#f0f0f0',
          mb: 1,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5rem',
          color: 'text.secondary'
        }}
      >
        {trip.image ? (
          <Box
            component="img"
            src={trip.image}
            alt={trip.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          'No Image'
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2"
          sx={{ 
            wordBreak: 'break-word', 
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
            mb: 1,
            fontWeight: 600
          }}
        >
          {trip.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 0.5 }}>
          <LocationOn fontSize="small" color="primary" />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              ml: 0.5, 
              wordBreak: 'break-word',
              fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' } 
            }}
          >
            {trip.destination}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <DateRange fontSize="small" color="primary" />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              ml: 0.5, 
              fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' } 
            }}
          >
            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 1, pb: 1 }}>
        <Button 
          size="small" 
          fullWidth
          endIcon={<ArrowForward />}
          onClick={() => navigate(`/trips/${trip.id}`)}
          sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' }, fontWeight: 600 }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripCard;
