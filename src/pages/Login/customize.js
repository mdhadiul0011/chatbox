import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './style.css'
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { signIn } from '../../validation/validation';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import BeatLoader from "react-spinners/BeatLoader";
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Loginuser } from '../../features/slice/UsersSlice';
import { getDatabase, ref, set, } from 'firebase/database';

const Login = () => {
  const users = useSelector((user) => user.loggedinSlice.login);
  const [showPass, setShowPass] = useState('password');
  const auth =getAuth()
  const [loading, setLoading] = useState(false)
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const db = getDatabase();

  const handleShow = () => {
    if(showPass == 'password'){
      setShowPass('text');
    }else{
      setShowPass('password')
    };
  };

  const primaryValues = {
    email: "",
    password: "",
  }

  const formik = useFormik({
    initialValues: primaryValues,
    validationSchema: signIn,
    onSubmit: () => {
      setLoading(true);
      signInWithEmailAndPassword(auth, formik.values.email, formik.values.password)
      .then(({user}) => {
        if(auth.currentUser.emailVerified == true){
          setLoading(false)
          navigate('/')
          dispatch(Loginuser(user))
          localStorage.setItem('users', JSON.stringify(user))
        }
        else{
          // toast.error('🦄 Please Verify Your Email and Replay Login', {
          //   position: "bottom-center",
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: false,
          //   })
        }
      })
      .catch((error) => {
        if(error.code.includes('auth/user-not-found')){
          toast.error('🦄 Email Does Not Match', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            })
        }
        if(error.code.includes('auth/wrong-password')){
          toast.error('🦄 Password Not Match', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            })
        }
          // setError("email alredy exist");error.code.includes("auth/user-not-found")
          setLoading(false)
      })
    }
  });

  const handlegoogleclick = ( ()=> {
    signInWithPopup(auth, googleProvider)
    .then(({user})=> {
      set(ref(db, 'users/' + users.uid), {
        username: users.displayName,
        email: users.email
      })
      dispatch(Loginuser(user))
      localStorage.setItem('users', JSON.stringify(user))
      navigate('/')

    });
  });

  const handlefacebookclick = (() => {
    signInWithPopup(auth, facebookProvider)
    .then(() => {
      navigate('/')
    })
  })


  return (
    <div>
      <Container>
      <ToastContainer/>
        <Grid className='log-box' spacing={2} container>
          <Grid item xs={6}>
            <div className='log-left-part'>
              <picture>
                <img className='log-img' src='./images/login.png'/>
              </picture>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className='log-right-part'>
              <div className='login-img'>
                <picture>
                  <img src='./images/avatar.png' alt="avatar"/>
                </picture>
              </div>
              <div className='log-headline'>
                <h3>Login to Your Account</h3>
             </div>
             <div className='login-google' onClick={handlegoogleclick}>
                <div className='google-logo' >
                  <picture>
                    <img src='./images/google.png' alt='google'/>
                  </picture>
                </div>
                <div className='google-text'>
                    <p>Login with Google</p>
                </div>
             </div>
             <div className='login-facebook' onClick={handlefacebookclick}>
                <div className='facebook-logo'>
                  <picture>
                    <img src='./images/facebook.png' alt='facebook'/>
                  </picture>
                </div>
                <div className='facebook-text'>
                    <p>Login with Facebook</p>
                </div>
             </div>

              <form onSubmit={formik.handleSubmit}>
                <TextField className='log-input' name='email' value={formik.values.email} type='email' label="Email" variant="standard" onChange={formik.handleChange} />
                {formik.errors.email && formik.touched.email ? <p className='errors'>{formik.errors.email}</p> : null}
                <div className='log-pass'>
                  <TextField className='log-input' name='password' value={formik.values.password} type={showPass} label="Password" variant="standard" onChange={formik.handleChange} />
                  {formik.errors.password && formik.touched.password ? <p className='errors'>{formik.errors.password}</p> : null}
                  <div onClick={handleShow} className='log-eye'>
                  {showPass == "password" ? <AiOutlineEye/> : <AiOutlineEyeInvisible/>}
                  </div>
                </div>
                {loading ? <Button disabled className='reg-btn' type='submit' variant="contained"><BeatLoader className='loader' color='#fff' size = '15px'/></Button> : <Button className='reg-btn' type='submit' variant="contained">Sign In</Button>}
                <div className='account'>
                  <div className='fpass'>
                    <Link to="/forgotpassword">Forgot Password</Link>
                  </div>
                  <p>Don't have an account? <Link to="/registration">SignUp</Link></p>
                </div>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
      
    </div>
  )
}

export default Login;
