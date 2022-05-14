import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function BasicCard(props) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia component="img" height="140" image={props.picture} alt="green iguana" />
            <CardContent className="all-tutor-card-container">
                <Typography gutterBottom variant="h5" component="div">
                    {props.teacher}
                </Typography>
                <Typography gutterBottom variant="p" component="div">
                    {props.profession}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                    {props.tID}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.availableTime}
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
