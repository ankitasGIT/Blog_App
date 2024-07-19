import React , {useState} from 'react';
import {Box, AppBar,Toolbar,  Button, Typography, Tabs, Tab } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../redux/store.js';


const Header = () => {
    const isLogin = useSelector(state => state.isLogin)
    const dispatch = useDispatch();
    const [value, setValue] = useState();
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            dispatch(authActions.logout());
            alert('Logout successfully');
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <>
        <AppBar position='sticky'>
            <Toolbar>
                <Typography color={'black'}>
                    DAILY BLOGS
                </Typography>
                {isLogin && (
                    <Box display={'flex'} marginLeft={'auto'}>
                    <Tabs textColor='inherit' value={value} onChange={(e, val) => setValue(val)}>
                        <Tab label="Blogs" LinkComponent={Link} to="/blogs"/>
                        <Tab label="My Blogs" LinkComponent={Link} to="/my-blogs"/>
                    </Tabs>
                </Box>
                )}
                <Box display={'flex'} marginLeft="auto">
                    {!isLogin && (<>
                        <Button sx={{margin: 1, color: 'black'}} LinkComponent={Link} to="/login">Login</Button>
                        <Button sx={{margin: 1, color: 'black'}} LinkComponent={Link} to="/register">Register</Button>
                    </>)}
                    {isLogin && (
                        <Button onClick={handleLogout} sx={{margin: 1, color: 'black'}}>Logout</Button>
                    )}

                </Box>
            </Toolbar>
        </AppBar>
    </>
  )
}

export default Header
