import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Grid, Rating, Chip, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemIcon, ListItemText as MuiListItemText, Divider, Collapse, IconButton, Tooltip, Fade, Grow, Snackbar, Alert, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { LocalBar, Search, Star, LocationOn, FilterList, AccessTime, People, ExpandMore, ExpandLess, Notifications, Person, Group, Public, Edit, Sort, Map as MapIcon } from '@mui/icons-material';

const Map = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBar, setSelectedBar] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [showFriends, setShowFriends] = useState(true);
  const [pingedFriends, setPingedFriends] = useState(new Set());
  const [showPingAlert, setShowPingAlert] = useState(false);
  const [pingedFriendName, setPingedFriendName] = useState('');
  const [ratingTab, setRatingTab] = useState(0);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(null);
  const [ratingComment, setRatingComment] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const [sortBy, setSortBy] = useState('none');
  const [ratingType, setRatingType] = useState('community');
  const [showRatingSort, setShowRatingSort] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const mapStyles = {
    height: '60vh',
    width: '100%',
  };

  const defaultCenter = {
    lat: 40.7128, // New York City coordinates
    lng: -74.0060,
  };

  // Available tags
  const availableTags = ['Live Music', 'Cheap Drinks', 'DJ', 'Dancing', 'Food', 'Cover', 'Special Event'];

  // Mock data for bars with enhanced rating information
  const bars = [
    {
      id: 1,
      name: 'The Local Pub',
      location: { lat: 40.7128, lng: -74.0060 },
      personalRating: 4.5,
      friendsRating: 4.3,
      communityRating: 4.2,
      address: '123 Main St, New York, NY',
      image: 'https://source.unsplash.com/random/100x100/?bar',
      isPopular: true,
      tags: ['Live Music', 'Cheap Drinks', 'Food'],
      friendReviews: [
        { name: 'John Doe', rating: 4.5, comment: 'Great atmosphere!' },
        { name: 'Jane Smith', rating: 4.0, comment: 'Love the live music' }
      ]
    },
    {
      id: 2,
      name: 'City Bar',
      location: { lat: 40.7148, lng: -74.0080 },
      personalRating: 4.2,
      friendsRating: 4.0,
      communityRating: 4.1,
      address: '456 Broadway, New York, NY',
      image: 'https://source.unsplash.com/random/100x100/?pub',
      isPopular: false,
      tags: ['DJ', 'Dancing', 'Cover'],
      friendReviews: [
        { name: 'Mike Johnson', rating: 4.0, comment: 'Great place for dancing' }
      ]
    },
    {
      id: 3,
      name: 'Downtown Lounge',
      location: { lat: 40.7108, lng: -74.0040 },
      personalRating: 4.7,
      friendsRating: 4.5,
      communityRating: 4.6,
      address: '789 Wall St, New York, NY',
      image: 'https://source.unsplash.com/random/100x100/?lounge',
      isPopular: true,
      tags: ['Special Event', 'Food', 'Live Music'],
      friendReviews: [
        { name: 'Jane Smith', rating: 4.5, comment: 'Amazing live music' },
        { name: 'Mike Johnson', rating: 4.5, comment: 'Great place for special events' }
      ]
    },
  ];

  // Mock data for friends' recent check-ins
  const recentCheckIns = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bar: 'The Local Pub',
      time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      location: { lat: 40.7128, lng: -74.0060 },
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bar: 'City Bar',
      time: new Date(Date.now() - 90 * 60 * 1000), // 90 minutes ago
      location: { lat: 40.7148, lng: -74.0080 },
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bar: 'Downtown Lounge',
      time: new Date(Date.now() - 120 * 60 * 1000), // 120 minutes ago
      location: { lat: 40.7108, lng: -74.0040 },
    },
  ];

  // Filter friends who checked in within the last 2 hours
  const recentFriends = recentCheckIns.filter(friend => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const matchesSearch = friend.name.toLowerCase().includes(friendSearchQuery.toLowerCase());
    return friend.time > twoHoursAgo && matchesSearch;
  });

  const getBarRating = (bar) => {
    switch (ratingType) {
      case 'personal':
        return userRatings[bar.id]?.rating || 0;
      case 'friends':
        return bar.friendsRating;
      case 'community':
        return bar.communityRating;
      default:
        return 0;
    }
  };

  const sortBars = (bars) => {
    if (sortBy === 'none') return bars;
    
    return [...bars].sort((a, b) => {
      const ratingA = getBarRating(a);
      const ratingB = getBarRating(b);
      return ratingB - ratingA;
    });
  };

  const filteredBars = sortBars(bars.filter(bar => {
    const matchesSearch = bar.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => bar.tags.includes(tag));
    const matchesPopular = !showPopularOnly || bar.isPopular;
    return matchesSearch && matchesTags && matchesPopular;
  }));

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

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

  const handleRatingTabChange = (event, newValue) => {
    setRatingTab(newValue);
  };

  const handleRatingSubmit = (barId) => {
    setUserRatings(prev => ({
      ...prev,
      [barId]: {
        rating: currentRating,
        comment: ratingComment,
        timestamp: new Date().toISOString()
      }
    }));
    setRatingDialogOpen(false);
    setCurrentRating(null);
    setRatingComment('');
  };

  const handleRatingEdit = (barId) => {
    const existingRating = userRatings[barId];
    if (existingRating) {
      setCurrentRating(existingRating.rating);
      setRatingComment(existingRating.comment);
      setRatingDialogOpen(true);
    }
  };

  const renderRatingSection = (bar) => {
    const userRating = userRatings[bar.id];
    
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Tabs value={ratingTab} onChange={handleRatingTabChange} centered>
          <Tab icon={<Person />} label="Your Rating" />
          <Tab icon={<Group />} label="Friends" />
          <Tab icon={<Public />} label="Community" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {ratingTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Your Rating
                </Typography>
                {userRating ? (
                  <IconButton 
                    size="small" 
                    onClick={() => handleRatingEdit(bar.id)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                ) : (
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setRatingDialogOpen(true)}
                  >
                    Add Rating
                  </Button>
                )}
              </Box>
              {userRating ? (
                <Box>
                  <Rating value={userRating.rating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {userRating.rating} stars
                  </Typography>
                  {userRating.comment && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      "{userRating.comment}"
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block">
                    Rated on {new Date(userRating.timestamp).toLocaleDateString()}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  You haven't rated this bar yet
                </Typography>
              )}
            </Box>
          )}
          {ratingTab === 1 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Friends' Rating
              </Typography>
              <Rating value={bar.friendsRating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                {bar.friendsRating} stars ({bar.friendReviews.length} reviews)
              </Typography>
              <List dense>
                {bar.friendReviews.map((review, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={review.name}
                      secondary={
                        <Box>
                          <Rating value={review.rating} size="small" readOnly />
                          <Typography variant="body2">{review.comment}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {ratingTab === 2 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Community Rating
              </Typography>
              <Rating value={bar.communityRating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                {bar.communityRating} stars (based on 100+ reviews)
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Find Bars Near You
        </Typography>

        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={showSearch ? <MapIcon /> : <Search />}
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? 'Show Map' : 'Show Search'}
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Search and List Section */}
          <Grid item xs={12} md={4} sx={{ display: { xs: showSearch ? 'block' : 'none', md: 'block' } }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              {/* Friends Search Section */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" gutterBottom>
                    <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Friends at Bars
                  </Typography>
                  <IconButton onClick={() => setShowFriends(!showFriends)} size="small">
                    {showFriends ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={showFriends}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Search sx={{ mr: 1 }} />
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Search friends..."
                      value={friendSearchQuery}
                      onChange={(e) => setFriendSearchQuery(e.target.value)}
                    />
                  </Box>
                  <List>
                    {recentFriends.map((friend) => (
                      <ListItem
                        key={friend.id}
                        button
                        onClick={() => setSelectedBar(bars.find(bar => bar.name === friend.bar))}
                        secondaryAction={
                          <Tooltip title="Ping your friend">
                            <Box sx={{ position: 'relative', ml: 2 }}>
                              <IconButton 
                                edge="end" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePingFriend(friend.id, friend.name);
                                }}
                                color={pingedFriends.has(friend.id) ? "primary" : "default"}
                              >
                                <Notifications />
                              </IconButton>
                              {pingedFriends.has(friend.id) && (
                                <Fade in={true}>
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: -8,
                                      right: -8,
                                      width: 16,
                                      height: 16,
                                      borderRadius: '50%',
                                      bgcolor: 'primary.main',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Grow in={true}>
                                      <Box
                                        sx={{
                                          width: 8,
                                          height: 8,
                                          borderRadius: '50%',
                                          bgcolor: 'white',
                                        }}
                                      />
                                    </Grow>
                                  </Box>
                                </Fade>
                              )}
                            </Box>
                          </Tooltip>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar src={friend.avatar} alt={friend.name} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={friend.name}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                              <LocalBar sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                                {friend.bar}
                              </Typography>
                              <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2" component="span">
                                {Math.round((Date.now() - friend.time) / (60 * 1000))} minutes ago
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Existing Bar Search Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Search sx={{ mr: 1 }} />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search bars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>
              
              {/* Popular Filter */}
              <Box sx={{ mb: 3 }}>
                <ListItem button onClick={() => setShowPopularOnly(!showPopularOnly)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={showPopularOnly}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <MuiListItemText primary="Show Popular Bars Only" />
                </ListItem>
              </Box>

              {/* Tag Filters */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Filter by Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => handleTagToggle(tag)}
                      color={selectedTags.includes(tag) ? 'primary' : 'default'}
                      variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>

              {/* Rating Sort Section */}
              <Box sx={{ mb: 3 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    p: 1,
                    borderRadius: 1
                  }}
                  onClick={() => setShowRatingSort(!showRatingSort)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Sort sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      Sort by Rating
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    {showRatingSort ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={showRatingSort}>
                  <Box sx={{ mt: 2, pl: 1 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="none">No Sorting</MenuItem>
                        <MenuItem value="highest">Highest Rated</MenuItem>
                      </Select>
                    </FormControl>
                    {sortBy === 'highest' && (
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={ratingType}
                          onChange={(e) => setRatingType(e.target.value)}
                        >
                          <FormControlLabel 
                            value="community" 
                            control={<Radio size="small" />} 
                            label="Community Rating" 
                          />
                          <FormControlLabel 
                            value="friends" 
                            control={<Radio size="small" />} 
                            label="Friends' Rating" 
                          />
                          <FormControlLabel 
                            value="personal" 
                            control={<Radio size="small" />} 
                            label="Your Rating" 
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  </Box>
                </Collapse>
              </Box>

              <List>
                {filteredBars.map((bar) => (
                  <ListItem
                    key={bar.id}
                    button
                    onClick={() => setSelectedBar(bar)}
                    sx={{ mb: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar src={bar.image} alt={bar.name}>
                        <LocalBar />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {bar.name}
                          {bar.isPopular && (
                            <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                              🔥
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={bar.personalRating} precision={0.5} size="small" readOnly />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {bar.personalRating}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {bar.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Map Section */}
          <Grid item xs={12} md={8} sx={{ display: { xs: showSearch ? 'none' : 'block', md: 'block' } }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={13}
                  center={defaultCenter}
                >
                  {filteredBars.map((bar) => (
                    <Marker
                      key={bar.id}
                      position={bar.location}
                      onClick={() => setSelectedBar(bar)}
                    />
                  ))}
                  {selectedBar && (
                    <InfoWindow
                      position={selectedBar.location}
                      onCloseClick={() => setSelectedBar(null)}
                    >
                      <Box sx={{ p: 1, minWidth: 250 }}>
                        <Typography variant="h6" gutterBottom>
                          {selectedBar.name}
                          {selectedBar.isPopular && (
                            <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                              🔥
                            </Typography>
                          )}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {selectedBar.address}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          {selectedBar.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                        {renderRatingSection(selectedBar)}
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          startIcon={<LocalBar />}
                          sx={{ mt: 2 }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </Paper>
          </Grid>
        </Grid>
      </Box>

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

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)}>
        <DialogTitle>
          {userRatings[selectedBar?.id] ? 'Edit Your Rating' : 'Rate This Bar'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Your Rating</Typography>
            <Rating
              value={currentRating}
              precision={0.5}
              onChange={(event, newValue) => setCurrentRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your Review"
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleRatingSubmit(selectedBar.id)} 
            variant="contained"
            disabled={!currentRating}
          >
            {userRatings[selectedBar?.id] ? 'Update Rating' : 'Submit Rating'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Map; 