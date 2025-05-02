import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Button, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';

const PingNotifications = ({ pings, onPingBack, onIgnore }) => {
  const [expanded, setExpanded] = useState(true);

  if (!pings || pings.length === 0) return null;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        maxHeight: expanded ? '300px' : '60px',
        overflow: 'auto',
        transition: 'max-height 0.3s ease-in-out'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1,
        backgroundColor: 'primary.main',
        color: 'white'
      }}>
        <NotificationsIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pings ({pings.length})
        </Typography>
        <IconButton 
          color="inherit" 
          onClick={() => setExpanded(!expanded)}
          size="small"
        >
          {expanded ? <CloseIcon /> : <NotificationsActiveIcon />}
        </IconButton>
      </Box>
      
      {expanded && (
        <List sx={{ p: 0 }}>
          {pings.map((ping, index) => (
            <React.Fragment key={ping.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={ping.sender.avatar}>
                    {ping.sender.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={ping.sender.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {ping.message || 'Pinged you!'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(ping.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => onPingBack(ping.sender.id)}
                    sx={{ mr: 1 }}
                  >
                    Ping Back
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => onIgnore(ping.id)}
                  >
                    Ignore
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              {index < pings.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default PingNotifications; 