import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  if (currentUser === null) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  if (currentUser === undefined) {
    // Still checking authentication status
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // User is authenticated, render the protected route
  return children;
}

export default PrivateRoute; 