import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import CardMedia from '@mui/material/CardMedia';
import { Button, CardActions } from '@mui/material';

export default function BasicCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" height="140" image={props.picture} alt="green iguana" />
      <CardContent className="all-tutor-card-container">
        <Typography gutterBottom variant="h5">
          {props.tutor}
        </Typography>
        <Typography gutterBottom variant="span">
          {props.profession}
        </Typography>
        <Typography gutterBottom variant="h5">
          {props.tID}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {props.time}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.createDT}
        </Typography>
      </CardContent>

      <CardActions className="tutor-card-speci">
        <Button size="small" value={props.createDT} href={props.href} component={Link} to={`/tutor?room=${props.href}`}>
          前往上課
        </Button>
      </CardActions>
    </Card>
  );
}
