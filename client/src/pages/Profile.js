import React, { useState, useRef } from 'react';
import { Container, Typography, Box, Paper, Avatar, Button, Grid, List, ListItem, ListItemText, ListItemIcon, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Input, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  LocalBar as BarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Check as CheckIcon,
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';

const Profile = () => {
  const { userId } = useParams();
  const fileInputRef = useRef(null);

  // Mock user data
  const [user, setUser] = useState({
    id: userId || '',
    name: 'John Doe',
    username: 'johndoe',
    location: 'New York, NY',
    favoriteBars: ['The Local Pub', 'City Bar', 'Downtown Lounge', 'The Corner Tavern', 'The Speakeasy'],
    homeBar: 'Love exploring new bars and meeting new people!',
    profilePicture: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBars, setIsEditingBars] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newBarName, setNewBarName] = useState('');

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(user.favoriteBars);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setUser(prevUser => ({
      ...prevUser,
      favoriteBars: items
    }));
  };

  const handleEditBars = async () => {
    if (isEditingBars) {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        console.log('Updating user bars:', user.favoriteBars);
        setSuccess('Bars updated successfully!');
      } catch (err) {
        setError('Failed to update bars. Please try again.');
        console.error('Error updating bars:', err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditingBars(!isEditingBars);
  };

  const handleMoveBar = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === user.favoriteBars.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const items = [...user.favoriteBars];
    [items[index], items[newIndex]] = [items[newIndex], items[index]];

    setUser(prevUser => ({
      ...prevUser,
      favoriteBars: items
    }));
  };

  const handleDeleteBar = (index) => {
    setUser(prevUser => ({
      ...prevUser,
      favoriteBars: prevUser.favoriteBars.filter((_, i) => i !== index)
    }));
  };

  const handleEditBar = () => {
    // TODO: Implement bar editing functionality
    console.log('Edit bar');
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        console.log('Updating user profile:', user);
        setSuccess('Profile updated successfully!');
      } catch (err) {
        setError('Failed to update profile. Please try again.');
        console.error('Error updating profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddBar = () => {
    const name = prompt('Enter bar name:');
    if (name && name.trim() && user.favoriteBars.length < 5) {
      setUser(prevUser => ({
        ...prevUser,
        favoriteBars: [...prevUser.favoriteBars, name.trim()]
      }));
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prevUser => ({
          ...prevUser,
          profilePicture: reader.result
        }));
        setSuccess('Profile picture updated successfully!');
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  if (!userId) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" color="error">
            Error: User ID is missing or invalid.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar
                    src={user.profilePicture}
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      mx: 'auto', 
                      cursor: isEditing ? 'pointer' : 'default'
                    }}
                    onClick={() => isEditing && fileInputRef.current?.click()}
                  >
                    <PersonIcon sx={{ fontSize: 80 }} />
                  </Avatar>
                  {isEditing && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '50%',
                        p: 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PhotoCameraIcon sx={{ color: 'white' }} />
                    </Box>
                  )}
                  <Input
                    type="file"
                    inputRef={fileInputRef}
                    onChange={handleProfilePictureChange}
                    sx={{ display: 'none' }}
                    accept="image/*"
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
                  onClick={handleEditToggle}
                  disabled={isLoading}
                >
                  {isEditing ? 'Save' : 'Edit Profile'}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={user.username}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Home Bar"
                    name="homeBar"
                    value={user.homeBar}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={user.location}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {user.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'purple', mb: 2, fontWeight: 'bold' }}>
                    @{user.username}
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <HomeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Home Bar" secondary={user.homeBar} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon />
                      </ListItemIcon>
                      <ListItemText primary="Location" secondary={user.location} />
                    </ListItem>
                  </List>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" component="h2">
                {user.favoriteBars.length === 5 ? 'Top 5 Bars' : 
                 user.favoriteBars.length === 1 ? 'Top Bar' : 
                 `Top ${user.favoriteBars.length} Bars`}
              </Typography>
              <IconButton onClick={handleEditBars}>
                {isEditingBars ? <CheckIcon /> : <EditIcon />}
              </IconButton>
              {isEditingBars && user.favoriteBars.length < 5 && (
                <IconButton onClick={handleAddBar}>
                  <AddIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="bars">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {user.favoriteBars.map((bar, index) => (
                    <Draggable key={index} draggableId={`bar-${index}`} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            backgroundColor: 'background.paper',
                            mb: 1,
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                          secondaryAction={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {isEditingBars && (
                                <>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleMoveBar(index, 'up')}
                                    disabled={index === 0}
                                  >
                                    <Typography variant="h6">↑</Typography>
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleMoveBar(index, 'down')}
                                    disabled={index === user.favoriteBars.length - 1}
                                  >
                                    <Typography variant="h6">↓</Typography>
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeleteBar(index)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </>
                              )}
                              <Typography variant="h6" color="primary">
                                #{index + 1}
                              </Typography>
                            </Box>
                          }
                        >
                          <ListItemIcon>
                            <BarIcon />
                          </ListItemIcon>
                          <ListItemText primary={bar} />
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {user.favoriteBars.length === 0 && (
                    <Typography variant="body2" sx={{ pl: 9, color: 'text.secondary' }}>
                      No bars added yet
                    </Typography>
                  )}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      </Box>
      <Snackbar 
        open={!!error || !!success} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;