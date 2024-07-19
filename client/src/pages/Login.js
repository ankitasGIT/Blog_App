import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {Box, Typography, TextField, Button} from '@mui/material'
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {authActions} from '../redux/store.js'

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  //state
  const [inputs, setInputs] = useState({
      email: "",
      password: "",
  });


  //handleChange
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  //form handle
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const {data} =  await axios.post('http://localhost:8080/api/v1/users/login', {
        email: inputs.email,
        password: inputs.password
      });

      if(data.success)
      {
        dispatch(authActions.login());
        alert("User login successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>

      <Box maxWidth={450} display={'flex'} flexDirection={'column'}
      alignItems={'center'} justifyContent={'center'} margin={'auto'}
      marginTop={5} boxShadow={'10px 10px 20px #ccc'} padding={3}
      borderRadius={5}>

        <Typography variant='h4' padding={3} textAlign={'center'}
        sx={{textTransform : 'uppercase'}}>
          Login
        </Typography>

        
        <TextField placeholder='email' value={inputs.email}
        onChange = {handleChange}
        name='email' margin='normal'
          type='email' required
        />
        <TextField placeholder='password' value={inputs.password} 
        onChange = {handleChange}
        name='password' margin='normal'
          type='password' required
        />
        <Button sx={{borderRadius: 3, marginTop: 3}} type='submit' color='primary'>
          Submit
        </Button>
        <Button onClick={() => navigate('/register')} sx={{borderRadius: 3, marginTop: 3}} type='submit' color='primary'>
          Not a user? Register
        </Button>

      </Box>  
    </form>

    </>
  )
}

export default Login
