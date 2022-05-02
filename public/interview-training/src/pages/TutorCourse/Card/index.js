import * as React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function BasicCard(props) {
  return (
    <Card sx={{ minWidth: 275 }} className="social-card">
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.id}
        </Typography>
        <Typography variant="h5" component="div">
          {props.tID}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.availableTime}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          value={props.id}
          onClick={() => props.sendAppointment(props.id)}
        >
          立刻預約
        </Button>
      </CardActions>
    </Card>
  );
}
