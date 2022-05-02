import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function BasicCard(props) {
  return (
    <Card sx={{ maxWidth: 345, mb: 5 }}>
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.createDT}
        </Typography>
        <Typography variant="h5" component="div">
          {props.tID}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.availableTime}
        </Typography>
      </CardContent>
    </Card>
  );
}
