import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  IconButton,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const InviteDialog = ({ open, onClose, friends, bars }) => {
  const [selectedBar, setSelectedBar] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allowPlusOnes, setAllowPlusOnes] = useState(false);
  const [plusOneLimit, setPlusOneLimit] = useState(1);
  const [plusOneLimits, setPlusOneLimits] = useState({}); // friendId: limit

  const handleInvite = () => {
    console.log('Invite details:', {
      bar: selectedBar,
      friends: selectedFriends,
      date,
      time,
      plusOneLimits
    });
    onClose();
  };

  const handleFriendSelect = (friend) => {
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f.id === friend.id);
      if (isSelected) {
        return prev.filter(f => f.id !== friend.id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handlePlusOneLimitChange = (friendId, limit) => {
    setPlusOneLimits(prev => ({
      ...prev,
      [friendId]: limit
    }));
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Create Invite</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Bar Selection */}
          <Autocomplete
            options={bars}
            getOptionLabel={(option) => option.name}
            value={selectedBar}
            onChange={(event, newValue) => setSelectedBar(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Bar"
                required
              />
            )}
          />

          {/* Date and Time */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Box>

          {/* Plus One Settings */}
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={allowPlusOnes}
                  onChange={(e) => setAllowPlusOnes(e.target.checked)}
                />
              }
              label="Allow Plus Ones"
            />
            {allowPlusOnes && (
              <Box sx={{ mt: 2, ml: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Default Plus One Limit
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={plusOneLimit}
                    onChange={(e) => setPlusOneLimit(e.target.value)}
                    size="small"
                  >
                    <MenuItem value={1}>1 Guest</MenuItem>
                    <MenuItem value={2}>2 Guests</MenuItem>
                    <MenuItem value={3}>3 Guests</MenuItem>
                    <MenuItem value={4}>4 Guests</MenuItem>
                    <MenuItem value={5}>5 Guests</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Friend Search and Selection */}
          <TextField
            label="Search Friends"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />

          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {filteredFriends.map((friend) => (
              <ListItem
                key={friend.id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    checked={selectedFriends.some(f => f.id === friend.id)}
                    onChange={() => handleFriendSelect(friend)}
                  />
                }
              >
                <ListItemAvatar>
                  <Avatar src={friend.avatar} alt={friend.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={friend.name}
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {friend.mutualFriends} mutual friends
                      </Typography>
                      {allowPlusOnes && selectedFriends.some(f => f.id === friend.id) && (
                        <FormControl size="small" sx={{ mt: 1 }}>
                          <Select
                            value={plusOneLimits[friend.id] || plusOneLimit}
                            onChange={(e) => handlePlusOneLimitChange(friend.id, e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value={0}>No Plus Ones</MenuItem>
                            <MenuItem value={1}>1 Guest</MenuItem>
                            <MenuItem value={2}>2 Guests</MenuItem>
                            <MenuItem value={3}>3 Guests</MenuItem>
                            <MenuItem value={4}>4 Guests</MenuItem>
                            <MenuItem value={5}>5 Guests</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleInvite} 
          variant="contained"
          disabled={!selectedBar || !date || !time || selectedFriends.length === 0}
        >
          Send Invite
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteDialog; 