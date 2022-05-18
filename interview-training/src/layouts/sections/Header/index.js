import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from './logo2.png';
import Fade from '@mui/material/Fade';

import './index.scss';
import Button from '@mui/material/Button';

const settings = { 個人資料: '/account', 登出: '/logout' };

const Header = (props) => {
    const location = useLocation();
    const checkedMenu = React.useRef('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [getChecked, setGetChecked] = React.useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e) => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        if (props.title) document.title = props.title;
    }, []);

    React.useEffect(
        (e) => {
            if (getChecked) {
                console.log('232');
                console.log(checkedMenu.current);
            }
        },
        [getChecked]
    );

    const anchorRef = React.useRef(null);

    let pages;
    // const [pages, setPages] = React.useState(null);
    // console.log('props.identity', props.identity);
    if (localStorage.getItem('identity') === 'student') {
        pages = {
            模擬面試: '/',
            真人面試: '/reserve',
            面試社群: '/social',
        };
    } else if (props.identity === 'teacher' || localStorage.getItem('identity')) {
        pages = {
            幫人面試: '/arrange',
            面試社群: '/social',
        };
    } else {
        pages = {
            模擬面試: '/',
            真人面試: '/reserve',
            面試社群: '/social',
        };
    }

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
                            <a href="/">
                                <img src={logo} className="logo" />
                            </a>
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <img src={logo} className="logo" />
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages
                                ? Object.keys(pages).map((page) => (
                                      <MenuItem
                                          key={page}
                                          // ref={location.pathname === pages[page] ? checkedMenu : null}
                                          component={Link}
                                          to={pages[page]}
                                          sx={{ my: 2, color: 'white', display: 'block', backgroundColor: location.pathname === pages[page] ? '#0f5090' : 'none' }}
                                          className="header-menu"
                                      >
                                          {page}
                                      </MenuItem>
                                  ))
                                : null}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            {props.email ? (
                                <>
                                    <Button
                                        id="fade-button"
                                        aria-controls={open ? 'fade-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={props.avator || 'https://truth.bahamut.com.tw/s01/201207/28a8513919088d3328aaa40284c6b13e.PNG'}
                                            className="header-avator"
                                        />
                                    </Button>
                                    <Menu
                                        id="fade-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'fade-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        TransitionComponent={Fade}
                                    >
                                        {Object.keys(settings).map((setting) => (
                                            <MenuItem
                                                key={setting}
                                                value={settings[setting]}
                                                onClick={() => {
                                                    window.location.href = `${settings[setting]}`;
                                                }}
                                            >
                                                {setting}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </>
                            ) : (
                                <MenuItem component={Link} to={'./login'} sx={{ my: 2, color: 'white', display: 'block' }} className="header-menu">
                                    註冊/登入
                                </MenuItem>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Outlet />
        </>
    );
};
export default Header;
