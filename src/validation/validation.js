import * as Yup from "yup";


export const signUp = Yup.object({
    fullName: Yup.string().min(3).max(25, "must be charecter or less").required("Please enter your First Name"),
    email: Yup.string().email().required("Please enter your Email"),
    password: Yup.string().min(8).required("Please enter your Password"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "password must matchted").required("Confirm password must be required")
});

export const signIn = Yup.object({
    email: Yup.string().email().required('Please enter your email'),
    password: Yup.string().min(8).required('Please enter your password')
})

export const forgotPass = Yup.object({
    email: Yup.string().email().required('Please Enter Your Email')
})