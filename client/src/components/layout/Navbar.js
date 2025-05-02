import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Menu, MenuItem,
  useMediaQuery, useTheme
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { LocalBar, Map, People, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    handleMobileMenuClose();
    navigate('/auth');
  };

  const handleProfile = () => {
    navigate(`/profile/${user.id}`);
    handleClose();
    handleMobileMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <LocalBar sx={{ mr: 1 }} />
          Vibez
        </Typography>
        <Box>
          {user ? (
            <>
              {isMobile ? (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleMobileMenu}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    anchorEl={mobileMenuAnchorEl}
                    open={Boolean(mobileMenuAnchorEl)}
                    onClose={handleMobileMenuClose}
                  >
                    <MenuItem onClick={() => handleNavigation('/map')}>
                      <Map sx={{ mr: 1 }} /> Map
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/friends')}>
                      <People sx={{ mr: 1 }} /> Friends
                    </MenuItem>
                    <MenuItem onClick={handleProfile}>
                      <AccountCircle sx={{ mr: 1 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/map"
                    startIcon={<Map />}
                  >
                    Map
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/friends"
                    startIcon={<People />}
                  >
                    Friends
                  </Button>
                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ ml: 2 }}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <AccountCircle />
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/auth">
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 