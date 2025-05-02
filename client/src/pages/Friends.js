import React, { useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Paper, Divider, TextField, Tabs, Tab, Grid, Chip, IconButton, Snackbar, Alert } from '@mui/material';
import { Person as PersonIcon, Search, Add as AddIcon, MoreVert as MoreVertIcon, Event, Notifications, LocalBar, AccessTime, Star } from '@mui/icons-material';
import InviteDialog from '../components/InviteDialog';

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [pingedFriends, setPingedFriends] = useState(new Set());
  const [showPingAlert, setShowPingAlert] = useState(false);
  const [pingedFriendName, setPingedFriendName] = useState('');

  // Mock data for friends with recent activity
  const friends = [
    { 
      id: 1, 
      name: 'John Doe', 
      status: 'Online', 
      location: 'The Local Pub', 
      mutualFriends: 5, 
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastBarLog: {
        bar: 'The Local Pub',
        time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        rating: 4.5
      }
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      status: 'At Bar', 
      location: 'City Bar', 
      mutualFriends: 3, 
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastBarLog: {
        bar: 'City Bar',
        time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        rating: 4.0
      }
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      status: 'Offline', 
      mutualFriends: 2, 
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastBarLog: null
    },
  ];

  // Sort friends by most recent bar log
  const sortedFriends = [...friends].sort((a, b) => {
    if (!a.lastBarLog) return 1;
    if (!b.lastBarLog) return -1;
    return b.lastBarLog.time - a.lastBarLog.time;
  });

  // Filter friends with recent bar logs (within last 2 hours)
  const recentBarFriends = sortedFriends.filter(friend => 
    friend.lastBarLog && 
    (Date.now() - friend.lastBarLog.time) < (2 * 60 * 60 * 1000)
  );

  // Mock data for bars
  const bars = [
    { id: 1, name: 'The Local Pub' },
    { id: 2, name: 'City Bar' },
    { id: 3, name: 'Downtown Lounge' },
  ];

  // Mock data for friend requests
  const friendRequests = [
    { id: 4, name: 'Sarah Wilson', mutualFriends: 2 },
    { id: 5, name: 'Tom Brown', mutualFriends: 1 },
  ];

  // Mock data for suggested friends
  const suggestedFriends = [
    { id: 6, name: 'Emily Davis', mutualFriends: 4, commonInterests: ['Live Music', 'Craft Beer'] },
    { id: 7, name: 'Alex Wilson', mutualFriends: 3, commonInterests: ['Sports', 'Cocktails'] },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePingFriend = (friendId, friendName) => {
    setPingedFriends(prev => {
      const newSet = new Set(prev);
      newSet.add(friendId);
      return newSet;
    });
    setPingedFriendName(friendName);
    setShowPingAlert(true);
    // Here you would typically make an API call to send the ping notification
    console.log(`Pinged friend ${friendId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ 
      minWidth: '300px',
      width: '100%',
      px: { xs: 1, sm: 2, md: 3 },
      '& .MuiPaper-root': {
        width: '100%',
        minWidth: '300px'
      }
    }}>
      <Box sx={{ my: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
          Friends
        </Typography>

        {/* Search and Add Friend */}
        <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 }, mb: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Search sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AddIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                size="small"
              >
                Add Friend
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Event sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                onClick={() => setInviteDialogOpen(true)}
                size="small"
              >
                Invite
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper elevation={3} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                minWidth: '100px',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 }
              }
            }}
          >
            <Tab label="All Friends" />
            <Tab label="Requests" />
            <Tab label="Suggested" />
          </Tabs>
        </Paper>

        {/* All Friends Section */}
        {tabValue === 0 && (
          <>
            {/* Recent Bar Activity Section */}
            {recentBarFriends.length > 0 && (
              <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 }, mb: { xs: 2, sm: 3, md: 4 } }}>
                <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' } }}>
                  Recently at Bars
                </Typography>
                <List>
                  {recentBarFriends.map((friend) => (
                    <React.Fragment key={friend.id}>
                      <ListItem
                        sx={{ px: { xs: 1, sm: 2 } }}
                        secondaryAction={
                          <Box>
                            <IconButton 
                              edge="end" 
                              aria-label="ping"
                              onClick={() => handlePingFriend(friend.id, friend.name)}
                              color={pingedFriends.has(friend.id) ? "primary" : "default"}
                              size="small"
                            >
                              <Notifications sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                            </IconButton>
                            <IconButton edge="end" aria-label="more" size="small">
                              <MoreVertIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar 
                            src={friend.avatar} 
                            alt={friend.name}
                            sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                          >
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              {friend.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <LocalBar sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, mr: 0.5 }} />
                                <Typography variant="body2" component="span" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mr: 2 }}>
                                  {friend.lastBarLog.bar}
                                </Typography>
                                <AccessTime sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, mr: 0.5 }} />
                                <Typography variant="body2" component="span" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                  {Math.round((Date.now() - friend.lastBarLog.time) / (60 * 1000))} minutes ago
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Star sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, mr: 0.5, color: 'warning.main' }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                  Rated {friend.lastBarLog.rating} stars
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}

            {/* All Friends List */}
            <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' } }}>
                All Friends
              </Typography>
              <List>
                {sortedFriends.map((friend) => (
                  <React.Fragment key={friend.id}>
                    <ListItem
                      sx={{ px: { xs: 1, sm: 2 } }}
                      secondaryAction={
                        <Box>
                          <IconButton 
                            edge="end" 
                            aria-label="ping"
                            onClick={() => handlePingFriend(friend.id, friend.name)}
                            color={pingedFriends.has(friend.id) ? "primary" : "default"}
                            size="small"
                          >
                            <Notifications sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                          </IconButton>
                          <IconButton edge="end" aria-label="more" size="small">
                            <MoreVertIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={friend.avatar} 
                          alt={friend.name}
                          sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                        >
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {friend.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {friend.status}
                              {friend.location && ` at ${friend.location}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {friend.mutualFriends} mutual friends
                            </Typography>
                            {friend.lastBarLog && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <LocalBar sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, mr: 0.5 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                  Last at {friend.lastBarLog.bar} ({Math.round((Date.now() - friend.lastBarLog.time) / (60 * 60 * 1000))} hours ago)
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </>
        )}

        {/* Friend Requests Section */}
        {tabValue === 1 && (
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' } }}>
              Friend Requests
            </Typography>
            <List>
              {friendRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <ListItem
                    sx={{ px: { xs: 1, sm: 2 } }}
                    secondaryAction={
                      <Box>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          sx={{ mr: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Decline
                        </Button>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {request.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {request.mutualFriends} mutual friends
                          </Typography>
                          {request.commonInterests && (
                            <Box sx={{ mt: 1 }}>
                              {request.commonInterests.map((interest, index) => (
                                <Chip
                                  key={index}
                                  label={interest}
                                  size="small"
                                  sx={{ 
                                    mr: 1, 
                                    mb: 1,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    height: { xs: 24, sm: 28 }
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        {/* Suggested Friends Section */}
        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' } }}>
              Suggested Friends
            </Typography>
            <List>
              {suggestedFriends.map((friend) => (
                <React.Fragment key={friend.id}>
                  <ListItem
                    sx={{ px: { xs: 1, sm: 2 } }}
                    secondaryAction={
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Add Friend
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {friend.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {friend.mutualFriends} mutual friends
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {friend.commonInterests.map((interest, index) => (
                              <Chip
                                key={index}
                                label={interest}
                                size="small"
                                sx={{ 
                                  mr: 1, 
                                  mb: 1,
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  height: { xs: 24, sm: 28 }
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        <Snackbar
          open={showPingAlert}
          autoHideDuration={3000}
          onClose={() => setShowPingAlert(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <Alert onClose={() => setShowPingAlert(false)} severity="success" sx={{ width: '100%' }}>
            Ping sent to {pingedFriendName}!
          </Alert>
        </Snackbar>

        <InviteDialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          friends={friends}
          bars={bars}
        />
      </Box>
    </Container>
  );
};

export default Friends; 