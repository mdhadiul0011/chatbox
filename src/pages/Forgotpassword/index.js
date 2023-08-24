import React from 'react'
import './style.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik} from 'formik';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { forgotPass } from '../../validation/validation';
import { toast, ToastContainer } from 'react-toastify';

const Forgot = () => {
  const auth = getAuth();

  const emailValues = {
    email: ""
  }

  const formik = useFormik({
    initialValues: emailValues,
    validationSchema: forgotPass,
    onSubmit: () => {
      sendPasswordResetEmail(auth, formik.values.email)
      .then(() => {
        console.log('hoise');
      })
      .catch((error) => {
        toast.error('🦄 user-not-found', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          })
      });
    }
  })
  
  // .then(() => {
  //   // Password reset email sent!
  //   // ..
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // ..
  // });
  return (
    <>
    <ToastContainer/>
      <div className='forgot_pass'>
        <div className='forgot-mini-box'>
          <div className='forgot-header'>
            <h3>Reset Your Password</h3>
          </div>
          <div className='forgot-body'>
            <form onSubmit={formik.handleSubmit}>
            <TextField className='forgot-input' value={formik.values.email} type='email' name='email' label="Email" onChange={formik.handleChange} variant="standard" />
            {formik.errors.email && formik.touched.email ? <p className='errors'>{formik.errors.email}</p> : null}

            <Button className='forgot-btn' type='submit' variant="contained">Reset</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Forgot;
