import * as React from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function BasicCard(props) {
    return (
        <Card sx={{ minWidth: 275 }} className="social-card">
            <CardContent>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {props.profession}
                </Typography>
                <Typography variant="h5" component="div">
                    {props.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {props.introduce}
                </Typography>

                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {props.tutorContent.map((e, index) => {
                        return (
                            <Button size="small" key={index} value={e.id} onClick={() => props.sendAppointment(e.id)}>
                                {e['available_time']}
                            </Button>
                        );
                    })}
                </Typography>
            </CardContent>
        </Card>
    );
}
