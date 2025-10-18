import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Alert,
  Link
} from '@mui/material';
import { useAuth } from '../context/useAuth';
import { login as loginApi, register as registerApi, type LoginData, type RegisterData } from '../api/auth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await (isRegister 
        ? registerApi(formData as RegisterData)
        : loginApi(formData as LoginData));
      
      console.log('Auth response:', data);
      
      if (!data) {
        throw new Error('Empty response from server');
      }
      
      if (!data.user) {
        throw new Error('No user data in response');
      }
      
      if (!data.token) {
        throw new Error('No token in response');
      }
      
      // Use the auth context to store the user
      login({
        ...data.user,
        _id: data.user.id || data.user._id, // ensure both id fields are set
        token: data.token
      });
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(`Error: ${errorMessage}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {isRegister ? 'Create Account' : 'Login'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {isRegister && (
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          )}
          
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <Button 
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            {isRegister ? 'Register' : 'Login'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister 
                ? 'Already have an account? Login' 
                : "Don't have an account? Register"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
