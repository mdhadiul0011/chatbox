import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import BeatLoader from "react-spinners/BeatLoader";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from "firebase/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { getDatabase, push, ref, set } from "firebase/database";
import { signUp } from '../../validation/validation';
import './style.css';
import { Link, useNavigate} from 'react-router-dom';

const Registration = () => {

  const [passShow, setPassShow] = useState("password");
  const auth = getAuth();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [error, setError] = useState("")
  const db = getDatabase();

  const handleShow = () => {
    if(passShow == "password"){
      setPassShow("text");
    }else{
      setPassShow("password")
    }
  }

  const initialValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signUp,
    onSubmit: () =>{
      setLoading(true)
      createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password)
    .then(({user}) => {
      updateProfile(auth.currentUser, {
        displayName: formik.values.fullName, 
      }).then(() => {
        sendEmailVerification(auth.currentUser)
        .then(()=>{
          set(ref(db, 'users/' + user.uid), {
            username: user.displayName,
            email: user.email
          })
          .then(()=> {
            toast.error('🦄 Please Verify Your Email and Replay Login', {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              })
          });
        })
      })

      formik.resetForm();
      setLoading(false)
      navigate('/login')
    })
    .catch((error) => {
      if(error.code.includes("auth/email-already-in-use")){
        toast.error('🦄 Email alredy exist!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          });
          setLoading(false)
        // setError("email alredy exist");
      }
    });
    }
  });


  return (
    <div className='main-reg-box'>
      <Container fixed>
      <ToastContainer/>
        <Grid className='reg-box2' container spacing={2}>
            <Grid item xs={6}>
                <div className='reg-left-part'>
                    <h3>get register and enjoy journey with chatBox</h3>
                    <span>Free register and you can enjoy it</span>
                    <form onSubmit={formik.handleSubmit}>

                    <TextField onChange={formik.handleChange} name='fullName' className='reg-input' type= 'text' label="Full Name" value={formik.values.fullName} variant="standard" />
                    {formik.errors.fullName && formik.touched.fullName ? <p className='errors'>{formik.errors.fullName}</p> : null}
                    
                    <TextField onChange={formik.handleChange} name='email' className='reg-input' type= 'email' label="Email" value={formik.values.email} variant="standard" />
                    {/* {error ? <p>{error}</p> : ''} */}
                    {formik.errors.email && formik.touched.email ? <p className='errors'>{formik.errors.email}</p> : null}

                    <div className='password-box'>
                    <TextField onChange={formik.handleChange} name='password' className='reg-input' type= {passShow} label="Password" value={formik.values.password} variant="standard" />
                    {formik.errors.password && formik.touched.password ? <p className='errors'>{formik.errors.password}</p> : null}
                      <div className='eyes' onClick={handleShow}>
                      { passShow == "password" ? <AiOutlineEye/> : <AiOutlineEyeInvisible/>}
                      </div>
                    </div>

                    <TextField onChange={formik.handleChange} name='confirmPassword' className='reg-input' type= "password" label="Confirm Password" value={formik.values.confirmPassword} variant="standard" />
                    {formik.errors.confirmPassword && formik.touched.confirmPassword ? <p className='errors'>{formik.errors.confirmPassword}</p> : null}

                    {loading ? <Button className='reg-btn' type='submit' variant="contained"><BeatLoader className='loader' color='#fff' size = '15px'/></Button> : <Button className='reg-btn' type='submit' variant="contained">Sign Up</Button>}
                    </form>

                    <div className='account'>
                      <p>Already  have an account ? <Link to='/login'>SignIn</Link> </p>
                    </div>
                </div>
            </Grid>
            <Grid item xs={6}>
                <div>
                  <picture>
                    <img className='reg-img' src='./images/register.png'></img>
                  </picture>
                </div>
            </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Registration
