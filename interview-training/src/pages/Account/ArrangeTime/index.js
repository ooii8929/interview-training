import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { CardActionArea } from '@mui/material';

export default function Records(props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            預約時間 ： {props.time}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            建立時間：{props.create}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
