import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginFormControl } from './../../config/index';
import CommonForm from '@/components/common/CommonForm';
import { useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { loginUser } from './../../store/authSlice/index';
import { ToastAction } from '@/components/ui/toast';


const intialState = {
  email: '',
  password: ''
}

function Login() {
  const [formData, setFormData] = useState(intialState);
  const dispatch = useDispatch();
  const {toast} = useToast();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
       if(data?.payload?.success) {
         toast({
           title: data?.payload?.message
         })
       }
       else{
         toast({
           title: data?.payload?.message,
           variant:'destructive',
           action: <ToastAction altText="Try again">Try again</ToastAction>
         })
       }
    })
  }

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
       <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Sign In to Your Account</h1>
        <p className='mt-2'>Don't Have an Account?
         <Link to='/auth/register' className='ml-2 font-medium text-primary hover:underline  text-blue-700'>Register</Link>
        </p>
       </div>
       <CommonForm 
        formControls={loginFormControl}
        formData={formData}
        setFormData={setFormData}
        buttonText={'Sign In'}
        onSubmit={onSubmit}
       />
    </div>
  )
}

export default Login