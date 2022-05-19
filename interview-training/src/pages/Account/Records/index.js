import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function Records(props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia component="img" height="140" image={props.picture} alt="green iguana" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {props.availableTime.replace('T', ' ').replace('Z', ' ').split('.', 1)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" value={props.createDT} href={props.href} component={Link} to={`/tutor?room=${props.href}`}>
          前往上課
        </Button>
      </CardActions>
    </Card>
  );
}
