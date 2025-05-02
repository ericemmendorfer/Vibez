import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Select, MenuItem, FormControl, InputLabel, IconButton, Chip, Avatar, AvatarGroup, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemAvatar, ListItemText, Divider, Badge } from '@mui/material';
import { Star, Event, People, AccessTime, LocationOn, Visibility, VisibilityOff, MusicNote, LocalBar, Restaurant, EventNote, AttachMoney, Check, Close, Help, KeyboardArrowDown, Add, Remove, Message, Favorite, FavoriteBorder } from '@mui/icons-material';
import InviteDialog from '../components/InviteDialog';

const Home = () => {
  const [radius, setRadius] = useState('1');
  const [showMeetings, setShowMeetings] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(null);
  const [meetingDetailsOpen, setMeetingDetailsOpen] = useState(null);
  const [meetingResponses, setMeetingResponses] = useState({
    1: 'pending',
    2: 'pending'
  });
  const [expandedResponses, setExpandedResponses] = useState({});
  const [showDeclined, setShowDeclined] = useState(false);
  const [guestCounts, setGuestCounts] = useState({
    1: 0, // meetingId: number of guests
    2: 0
  });
  const [unreadMessages, setUnreadMessages] = useState({
    1: true, // eventId: hasUnreadMessages
    2: false
  });
  const [likedMessages, setLikedMessages] = useState({
    1: false, // eventId: isLiked
    2: false
  });

  const handleRadiusChange = (event) => {
    setRadius(event.target.value);
  };

  const toggleMeetingsVisibility = () => {
    setShowMeetings(!showMeetings);
  };

  const handleResponse = (meetingId, response) => {
    setMeetingResponses(prev => ({
      ...prev,
      [meetingId]: response
    }));
    setExpandedResponses(prev => ({
      ...prev,
      [meetingId]: false
    }));
  };

  const toggleResponseOptions = (meetingId) => {
    setExpandedResponses(prev => ({
      ...prev,
      [meetingId]: !prev[meetingId]
    }));
  };

  const handleGuestCountChange = (meetingId, change) => {
    const meeting = upcomingMeetings.find(m => m.id === meetingId);
    const currentCount = guestCounts[meetingId] || 0;
    const newCount = Math.max(0, Math.min(meeting.maxGuests, currentCount + change));
    
    setGuestCounts(prev => ({
      ...prev,
      [meetingId]: newCount
    }));

    // Update the response based on guest count
    if (newCount > 0) {
      handleResponse(meetingId, 'plus1');
    } else if (meetingResponses[meetingId] === 'plus1') {
      handleResponse(meetingId, 'yes');
    }
  };

  const handleEventDetailsOpen = (eventId) => {
    setEventDetailsOpen(eventId);
    // Mark message as read when opening details
    setUnreadMessages(prev => ({
      ...prev,
      [eventId]: false
    }));
  };

  const handleEventDetailsClose = () => {
    setEventDetailsOpen(null);
  };

  const handleMeetingDetailsOpen = (meetingId) => {
    setMeetingDetailsOpen(meetingId);
    // Mark message as read when opening details
    setUnreadMessages(prev => ({
      ...prev,
      [meetingId]: false
    }));
  };

  const handleMeetingDetailsClose = () => {
    setMeetingDetailsOpen(null);
  };

  const handleLikeMessage = (eventId) => {
    setLikedMessages(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  // Tag icons mapping
  const tagIcons = {
    'Live Music': <MusicNote />,
    'Cheap Drinks': <AttachMoney />,
    'DJ': <MusicNote />,
    'Dancing': <EventNote />,
    'Food': <Restaurant />,
    'Cover': <AttachMoney />,
    'Special Event': <EventNote />
  };

  // Mock data for upcoming meetings
  const upcomingMeetings = [
    {
      id: 1,
      name: 'Team Happy Hour',
      date: '2024-03-15',
      time: '18:00',
      location: 'The Local Pub',
      hostMessage: {
        text: 'Don\'t forget to bring your ID! We\'ll be checking at the door.',
        timestamp: '2024-03-14T10:15:00',
        likes: 5
      },
      attendees: [
        { id: 1, name: 'John', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 2, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 3, name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=3' },
        { id: 4, name: 'Emily', avatar: 'https://i.pravatar.cc/150?img=4' },
        { id: 5, name: 'David', avatar: 'https://i.pravatar.cc/150?img=5' }
      ],
      isInvite: true,
      maxGuests: 2
    },
    {
      id: 2,
      name: 'Birthday Celebration',
      date: '2024-03-20',
      time: '20:00',
      location: 'City Bar',
      hostMessage: null,
      attendees: [
        { id: 6, name: 'Jane', avatar: 'https://i.pravatar.cc/150?img=6' },
        { id: 7, name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=7' },
        { id: 8, name: 'Emily', avatar: 'https://i.pravatar.cc/150?img=8' }
      ],
      isInvite: false,
      maxGuests: 0
    },
  ];

  // Mock data for popular bars
  const popularBars = [
    {
      id: 1,
      name: 'The Local Pub',
      rating: 4.5,
      distance: '0.3 miles',
      isPopular: true,
      tags: ['Live Music', 'Cheap Drinks', 'Food']
    },
    {
      id: 2,
      name: 'City Bar',
      rating: 4.2,
      distance: '0.5 miles',
      isPopular: false,
      tags: ['DJ', 'Dancing', 'Cover']
    },
    {
      id: 3,
      name: 'Downtown Lounge',
      rating: 4.7,
      distance: '0.8 miles',
      isPopular: true,
      tags: ['Special Event', 'Food', 'Live Music']
    },
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      name: 'Live Music Night',
      date: 'Friday, 8:00 PM',
      location: 'The Local Pub',
      description: 'Join us for an evening of live music featuring local bands and great drinks!',
      hostMessage: {
        text: 'Hey everyone! Just a reminder that we have a special guest DJ tonight. See you there!',
        timestamp: '2024-03-14T15:30:00',
        likes: 12
      },
      attendees: [
        { id: 1, name: 'John', avatar: 'https://i.pravatar.cc/150?img=1', mutualFriends: 5, plusOnes: 1 },
        { id: 2, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=2', mutualFriends: 3, plusOnes: 0 },
        { id: 3, name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=3', mutualFriends: 2, plusOnes: 2 },
        { id: 4, name: 'Emily', avatar: 'https://i.pravatar.cc/150?img=4', mutualFriends: 4, plusOnes: 0 },
        { id: 5, name: 'David', avatar: 'https://i.pravatar.cc/150?img=5', mutualFriends: 1, plusOnes: 1 }
      ],
      isInvite: true,
      maxGuests: 2
    },
    {
      id: 2,
      name: 'Happy Hour',
      date: 'Today, 5:00 PM',
      location: 'City Bar',
      description: 'Half-price drinks and appetizers during our daily happy hour!',
      hostMessage: null,
      attendees: [
        { id: 6, name: 'Jane', avatar: 'https://i.pravatar.cc/150?img=6', mutualFriends: 3, plusOnes: 0 },
        { id: 7, name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=7', mutualFriends: 2, plusOnes: 1 },
        { id: 8, name: 'Emily', avatar: 'https://i.pravatar.cc/150?img=8', mutualFriends: 4, plusOnes: 0 }
      ],
      isInvite: false,
      maxGuests: 0
    },
  ];

  // Mock data for friends
  const friends = [
    { id: 1, name: 'John Doe', status: 'Online', location: 'The Local Pub', mutualFriends: 5, avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Jane Smith', status: 'At Bar', location: 'City Bar', mutualFriends: 3, avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Mike Johnson', status: 'Offline', mutualFriends: 2, avatar: 'https://i.pravatar.cc/150?img=3' },
  ];

  const renderAttendees = (meeting) => {
    const directFriends = meeting.attendees;
    const plusOneCount = meetingResponses[meeting.id] === 'plus1' ? guestCounts[meeting.id] || 0 : 0;
    const totalAttendees = directFriends.length + plusOneCount;
    const visibleFriends = directFriends.slice(0, 3);
    const remainingCount = totalAttendees - visibleFriends.length;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AvatarGroup max={3}>
          {visibleFriends.map((attendee, index) => (
            <Tooltip key={attendee.id} title={index === 0 ? `${attendee.name} (Host)` : attendee.name}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={attendee.avatar} 
                  alt={attendee.name}
                  sx={index === 0 ? { border: '2px solid', borderColor: 'primary.main' } : {}}
                />
                {index === 0 && (
                  <Star
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      fontSize: '1.2rem',
                      color: 'primary.main',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      padding: '2px'
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          ))}
        </AvatarGroup>
        {remainingCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            +{remainingCount} {remainingCount === 1 ? 'person' : 'people'}
          </Typography>
        )}
      </Box>
    );
  };

  const renderResponseButtons = (meetingId) => {
    const currentResponse = meetingResponses[meetingId];
    const isExpanded = expandedResponses[meetingId];
    const meeting = upcomingMeetings.find(m => m.id === meetingId);
    const maxGuests = meeting?.maxGuests || 0;
    const guestCount = guestCounts[meetingId] || 0;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          color={currentResponse === 'no' ? 'error' : 'primary'}
          size="small"
          endIcon={<KeyboardArrowDown />}
          onClick={() => toggleResponseOptions(meetingId)}
          sx={{ 
            mb: isExpanded ? 1 : 0,
            width: '100%',
            justifyContent: 'space-between',
            textTransform: 'none'
          }}
        >
          {currentResponse === 'pending' ? 'Respond' : 
           currentResponse === 'plus1' ? `Response: Yes +${guestCount}` :
           `Response: ${currentResponse.charAt(0).toUpperCase() + currentResponse.slice(1)}`}
        </Button>
        {isExpanded && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            flexWrap: 'wrap',
            animation: 'fadeIn 0.2s ease-in-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(-10px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}>
            <Button
              variant={currentResponse === 'yes' ? 'contained' : 'outlined'}
              color="success"
              size="small"
              startIcon={<Check />}
              onClick={() => handleResponse(meetingId, 'yes')}
              sx={{ flex: 1, minWidth: '100px' }}
            >
              Yes
            </Button>
            <Button
              variant={currentResponse === 'maybe' ? 'contained' : 'outlined'}
              color="warning"
              size="small"
              startIcon={<Help />}
              onClick={() => handleResponse(meetingId, 'maybe')}
              sx={{ flex: 1, minWidth: '100px' }}
            >
              Maybe
            </Button>
            <Button
              variant={currentResponse === 'no' ? 'contained' : 'outlined'}
              color="error"
              size="small"
              startIcon={<Close />}
              onClick={() => handleResponse(meetingId, 'no')}
              sx={{ flex: 1, minWidth: '100px' }}
            >
              No
            </Button>
            {maxGuests > 0 && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flex: 1,
                minWidth: '100px',
                border: '1px solid',
                borderColor: currentResponse === 'plus1' ? 'primary.main' : 'divider',
                borderRadius: 1,
                p: 0.5,
                backgroundColor: currentResponse === 'plus1' ? 'primary.light' : 'background.paper'
              }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleGuestCountChange(meetingId, -1)}
                  disabled={guestCount === 0}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography variant="body2" sx={{ flex: 1, textAlign: 'center' }}>
                  Yes +{guestCount}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleGuestCountChange(meetingId, 1)}
                  disabled={guestCount >= maxGuests}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };

  const renderMessageBox = (message, eventId) => {
    if (!message) return null;
    
    const formattedTime = new Date(message.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const formattedDate = new Date(message.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return (
      <Box sx={{ 
        mt: 2, 
        p: 2, 
        bgcolor: 'primary.light', 
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'primary.main',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Message color="primary" />
          <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
            Host Message
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {message.text}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 1,
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'primary.main',
          opacity: 0.7
        }}>
          <Typography variant="caption" color="text.secondary">
            {formattedDate} at {formattedTime}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={() => handleLikeMessage(eventId)}
              sx={{ p: 0.5 }}
            >
              {likedMessages[eventId] ? (
                <Favorite fontSize="small" color="primary" />
              ) : (
                <FavoriteBorder fontSize="small" color="primary" />
              )}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {message.likes + (likedMessages[eventId] ? 1 : 0)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // Filter meetings based on showDeclined state
  const filteredMeetings = upcomingMeetings.filter(meeting => 
    showDeclined || meetingResponses[meeting.id] !== 'no'
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box>
            <Typography variant="h1" component="h1" gutterBottom>
              Welcome to Vibez
            </Typography>
            <Typography variant="h5" component="h2" color="text.secondary">
              Your social nightlife companion
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Event />}
            onClick={() => setInviteDialogOpen(true)}
          >
            Invite
          </Button>
        </Box>

        {/* Upcoming Meetings Section */}
        {upcomingMeetings.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h2" component="h2">
                Upcoming
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowDeclined(!showDeclined)}
                  startIcon={showDeclined ? <Visibility /> : <VisibilityOff />}
                >
                  {showDeclined ? 'Hide Declined' : 'Show Declined'}
                </Button>
                <IconButton onClick={toggleMeetingsVisibility} color="primary">
                  {showMeetings ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
            </Box>
            {showMeetings && (
              <Grid container spacing={4} sx={{ mb: 6 }}>
                {filteredMeetings.map((meeting) => (
                  <Grid item xs={12} sm={6} key={meeting.id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      opacity: meetingResponses[meeting.id] === 'no' ? 0.7 : 1
                    }}>
                      <CardContent sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        pb: 0
                      }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h5" component="h3">
                              {meeting.name}
                            </Typography>
                            {meeting.hostMessage && (
                              <Badge 
                                color="primary" 
                                variant="dot" 
                                invisible={!unreadMessages[meeting.id]}
                                sx={{ mt: 1 }}
                              >
                                <Message color="action" />
                              </Badge>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Event sx={{ mr: 1 }} />
                            <Typography variant="body1" sx={{ mr: 2 }}>
                              {new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </Typography>
                            <AccessTime sx={{ mr: 1 }} />
                            <Typography variant="body1">
                              {meeting.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocationOn sx={{ mr: 1 }} />
                            <Typography variant="body1">
                              {meeting.location}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Going:
                            </Typography>
                            {renderAttendees(meeting)}
                          </Box>
                          {renderResponseButtons(meeting.id)}
                        </Box>
                        <Box sx={{ 
                          mt: 'auto', 
                          pt: 2,
                          borderTop: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Button 
                            variant="contained" 
                            fullWidth
                            onClick={() => handleMeetingDetailsOpen(meeting.id)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Meeting Details Dialog */}
        {meetingDetailsOpen && (
          <Dialog
            open={!!meetingDetailsOpen}
            onClose={handleMeetingDetailsClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {upcomingMeetings.find(m => m.id === meetingDetailsOpen)?.name}
              {upcomingMeetings.find(m => m.id === meetingDetailsOpen)?.isInvite && (
                <Chip 
                  label="Invite" 
                  color="primary" 
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Event sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {new Date(upcomingMeetings.find(m => m.id === meetingDetailsOpen)?.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {upcomingMeetings.find(m => m.id === meetingDetailsOpen)?.time}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {upcomingMeetings.find(m => m.id === meetingDetailsOpen)?.location}
                  </Typography>
                </Box>
                {renderMessageBox(upcomingMeetings.find(m => m.id === meetingDetailsOpen)?.hostMessage, meetingDetailsOpen)}
              </Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Going ({upcomingMeetings.find(m => m.id === meetingDetailsOpen)?.attendees.length})
              </Typography>
              <List>
                {upcomingMeetings.find(m => m.id === meetingDetailsOpen)?.attendees.map((attendee, index) => (
                  <React.Fragment key={attendee.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar src={attendee.avatar} alt={attendee.name} />
                          {index === 0 && (
                            <Star
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                fontSize: '1.2rem',
                                color: 'primary.main',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                padding: '2px'
                              }}
                            />
                          )}
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>{attendee.name}</Typography>
                            {index === 0 && (
                              <Typography variant="caption" color="primary">
                                (Host)
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              {attendee.mutualFriends} mutual friends
                            </Typography>
                            {attendee.plusOnes > 0 && (
                              <Typography variant="body2" color="text.secondary">
                                +{attendee.plusOnes} guest{attendee.plusOnes > 1 ? 's' : ''}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingMeetings.find(m => m.id === meetingDetailsOpen)?.attendees.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleMeetingDetailsClose}>Close</Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Popular Bars Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h2" component="h2">
            Popular Bars Near You
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Radius</InputLabel>
            <Select
              value={radius}
              label="Radius"
              onChange={handleRadiusChange}
            >
              <MenuItem value="1">1 mile</MenuItem>
              <MenuItem value="3">3 miles</MenuItem>
              <MenuItem value="5">5 miles</MenuItem>
              <MenuItem value="10">10 miles</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {popularBars.map((bar) => (
            <Grid item xs={12} sm={6} md={4} key={bar.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 0 }}>
                        {bar.name}
                      </Typography>
                      {bar.isPopular && (
                        <Typography variant="h5" component="span" sx={{ ml: 1 }}>
                          🔥
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Star color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" sx={{ mr: 2 }}>
                        {bar.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {bar.distance} away
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {bar.tags.map((tag) => (
                        <Chip
                          key={tag}
                          icon={tagIcons[tag]}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ mt: 'auto' }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Events Near You Section */}
        <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
          Events Near You
        </Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {upcomingEvents.map((event) => {
            const totalAttendees = event.attendees.reduce((total, attendee) => 
              total + 1 + (attendee.plusOnes || 0), 0
            );
            return (
              <Grid item xs={12} sm={6} key={event.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {event.name}
                      </Typography>
                      {event.hostMessage && (
                        <Badge 
                          color="primary" 
                          variant="dot" 
                          invisible={!unreadMessages[event.id]}
                          sx={{ mt: 1 }}
                        >
                          <Message color="action" />
                        </Badge>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Event sx={{ mr: 1 }} />
                      <Typography variant="body1" sx={{ mr: 2 }}>
                        {event.date}
                      </Typography>
                      <LocationOn sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <People sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {totalAttendees} going
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => handleEventDetailsOpen(event.id)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Event Details Dialog */}
        {eventDetailsOpen && (
          <Dialog
            open={!!eventDetailsOpen}
            onClose={handleEventDetailsClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {upcomingEvents.find(e => e.id === eventDetailsOpen)?.name}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Event sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {upcomingEvents.find(e => e.id === eventDetailsOpen)?.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {upcomingEvents.find(e => e.id === eventDetailsOpen)?.location}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {upcomingEvents.find(e => e.id === eventDetailsOpen)?.description}
                </Typography>
                {renderMessageBox(upcomingEvents.find(e => e.id === eventDetailsOpen)?.hostMessage, eventDetailsOpen)}
              </Box>
              {(() => {
                const event = upcomingEvents.find(e => e.id === eventDetailsOpen);
                const friendAttendees = event?.attendees.filter(attendee => attendee.mutualFriends > 0) || [];
                const nonFriendCount = (event?.attendees.length || 0) - friendAttendees.length;
                const totalAttendees = event?.attendees.reduce((total, attendee) => 
                  total + 1 + (attendee.plusOnes || 0), 0
                ) || 0;
                
                return (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Going ({totalAttendees})
                    </Typography>
                    {friendAttendees.length > 0 && (
                      <List>
                        {friendAttendees.map((attendee, index) => (
                          <React.Fragment key={attendee.id}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar src={attendee.avatar} alt={attendee.name} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={attendee.name}
                                secondary={
                                  <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      {attendee.mutualFriends} mutual friends
                                    </Typography>
                                    {attendee.plusOnes > 0 && (
                                      <Typography variant="body2" color="text.secondary">
                                        +{attendee.plusOnes} guest{attendee.plusOnes > 1 ? 's' : ''}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < friendAttendees.length - 1 && (
                              <Divider variant="inset" component="li" />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                    {nonFriendCount > 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        +{nonFriendCount} other {nonFriendCount === 1 ? 'person' : 'people'} going
                      </Typography>
                    )}
                  </>
                );
              })()}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEventDetailsClose}>Close</Button>
              <Button variant="contained" color="primary">
                Join Event
              </Button>
            </DialogActions>
          </Dialog>
        )}

        <InviteDialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          friends={friends}
          bars={popularBars}
        />
      </Box>
    </Container>
  );
};

export default Home; 