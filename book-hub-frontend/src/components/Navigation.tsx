import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            Book Hub
          </Typography>
          
          <Box>
            {user ? (
              <>
                <Typography 
                  variant="body1" 
                  component="span"
                  sx={{ mr: 2 }}
                >
                  {user.username}
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}