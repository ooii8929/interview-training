import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import RegisterForm from '../RegisterForm';
import LoginForm from '../LoginForm';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
const theme = createTheme();

export default function ColorToggleButton(props) {
    const [alignment, setAlignment] = React.useState('student');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    return (
        <>
            <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleChange} className="toggle-login">
                <ToggleButton value="tutor">培訓教練</ToggleButton>
                <ToggleButton value="student">學生</ToggleButton>
            </ToggleButtonGroup>
            <div>
                <ThemeProvider theme={theme}>
                    <Grid container spacing={2} className="login-container">
                        {alignment ? (
                            <>
                                <Grid item xs={5}>
                                    <RegisterForm userID={props.userID} identity={alignment} />
                                </Grid>
                                <Grid item xs={5}>
                                    <LoginForm userID={props.userID} identity={alignment} />
                                </Grid>
                            </>
                        ) : null}
                    </Grid>
                </ThemeProvider>
            </div>
        </>
    );
}
