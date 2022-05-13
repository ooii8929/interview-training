import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

export default function IconLabelButtons(props) {
    return (
        <Stack direction="row" spacing={2} className="home-btn-div">
            <Button variant="contained" endIcon={<SendIcon />} href={props.href} className="home-btn" disabled={props.clicked}>
                立刻體驗
            </Button>
        </Stack>
    );
}
