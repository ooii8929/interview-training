import React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
// tutor Option form
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';

import Swal from 'sweetalert2';

export default function RegisterForm(props) {
    // default setting
    const [name, setName] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');

    // tutor option setting
    const professions = ['Backend', 'Frontend', 'SRE', 'Full-Stack', 'DevOps', 'Architect'];
    const [personName, setPersonName] = React.useState([]);
    const [count, setCount] = React.useState('');
    const countStyle = React.useRef(null);

    const handleMultiSelectChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    // submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        try {
            let updateResult = await axios({
                withCredentials: true,
                credentials: 'same-origin',
                method: 'POST',
                url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/signup`,
                data: {
                    identity: props.identity,
                    name: data.get('name'),
                    email: data.get('registerEmail'),
                    password: data.get('registerPassword'),
                    provider: 'native',
                    experience1: data.get('experience1'),
                    experience2: data.get('experience2'),
                    experience3: data.get('experience3'),
                    introduce: data.get('introduce'),
                    profession: data.get('profession'),
                },
                headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
            });

            console.log('updateResult', updateResult);
            localStorage.setItem('userID', updateResult.data.id);
            localStorage.setItem('username', updateResult.data.name);
            localStorage.setItem('useremail', updateResult.data.email);
            localStorage.setItem('identity', props.identity);
            await Swal.fire({
                title: 'Success Register!',
                text: '歡迎回來',
                icon: 'success',
                confirmButtonText: 'Cool',
            });
            if (localStorage.getItem('returnPage')) {
                let returnPageURL = localStorage.getItem('returnPage');
                localStorage.removeItem('returnPage');
                window.location.href = returnPageURL;
            } else {
                window.location.href = '/account';
            }
        } catch (error) {
            console.log(error.response);
            await Swal.fire({
                title: '發生問題!',
                text: `${error.response.data.error}`,
                icon: 'error',
                confirmButtonText: '再試一次',
            });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    註冊
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="姓名"
                                name="name"
                                value={name}
                                autoComplete="name"
                                onInput={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="registerEmail"
                                label="信箱"
                                name="registerEmail"
                                value={registerEmail}
                                autoComplete="registerEmail"
                                onInput={(e) => {
                                    setRegisterEmail(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="registerPassword"
                                label="密碼"
                                type="password"
                                value={registerPassword}
                                id="registerPassword"
                                autoComplete="registerPassword"
                                onInput={(e) => {
                                    setRegisterPassword(e.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    {props.identity === 'tutor' ? (
                        <>
                            <FormControl sx={{ width: '100%', marginTop: '16px' }}>
                                <InputLabel id="demo-multiple-checkbox-label">專業</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    name="profession"
                                    multiple
                                    value={personName}
                                    onChange={handleMultiSelectChange}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {professions.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={personName.indexOf(name) > -1} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Grid item xs={12} sx={{ width: '100%', marginTop: '16px' }}>
                                以下請列舉三點你的工作經驗
                            </Grid>
                            <Grid item xs={12} sx={{ width: '100%', marginTop: '16px' }}>
                                <TextField required fullWidth id="experience1" label="經驗一" name="experience1" autoComplete="experience1" />
                            </Grid>
                            <Grid item xs={12} sx={{ width: '100%', marginTop: '16px' }}>
                                <TextField required fullWidth id="experience2" label="經驗二" name="experience2" autoComplete="experience2" />
                            </Grid>
                            <Grid item xs={12} sx={{ width: '100%', marginTop: '16px' }}>
                                <TextField required fullWidth id="experience3" label="經驗三" name="experience3" autoComplete="experience3" />
                            </Grid>
                            <Grid item xs={12} sx={{ width: '100%', marginTop: '16px' }}>
                                請自我介紹
                                <br />
                                (限縮在40字內。根據研究，好的介紹大大影響排課率)
                                <textarea type="text" rows={5} className="full_height_Width" onChange={(e) => setCount(e.target.value.length)} name="introduce" />
                                <p ref={countStyle}>{count}</p>
                            </Grid>
                        </>
                    ) : null}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        註冊
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
