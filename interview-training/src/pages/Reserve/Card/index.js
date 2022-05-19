import React from 'react';

import Card from '@mui/material/Card';
import { CardMedia } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function BasicCard(props) {
  console.log('props avator', props.avator);
  return (
    <Card sx={{ width: 275 }} className="social-card">
      <CardContent className="tutor-self-container">
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.profession}
        </Typography>
        <CardMedia component="img" image={props.avator} alt="Paella dish" className="tutor-avator" />
        <Typography variant="h5" component="div" className="tutor-title">
          {props.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.introduce}
        </Typography>

        <Typography sx={{ mb: 1.5 }} color="text.secondary" className="tutor-time">
          {props.tutorContent.map((e, index) => {
            return (
              <Button className="tutor-btn-time" size="small" key={index} value={e.id} onClick={() => props.sendAppointment(e.id)}>
                {e['available_time'].replace('T', ' ').replace('Z', ' ').split('.', 1)}
              </Button>
            );
          })}
        </Typography>
      </CardContent>
    </Card>
  );
}
