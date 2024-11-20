import CommonForm from '@/components/common/CommonForm';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerFormControl } from './../../config/index';
import { useDispatch } from 'react-redux';
import { registerUser } from './../../store/authSlice/index';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

const intialState = {
    username: '',
    email: '',
    password: ''
}

function Register() {

  const [formData, setFormData] = useState(intialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast} = useToast();  

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      console.log(data);
       if(data?.payload?.success) {
         toast({
           title: data?.payload?.message,
         })
         navigate('/auth/login');
       }
       else{
         toast({
           title: data?.payload?.message,
           variant:'destructive',
           action: <ToastAction altText="Try again">Try again</ToastAction>
         })
       }
    });
  }

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
       <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Create Your Account</h1>
        <p className='mt-2'>Already Have an Account?
         <Link to='/auth/login' className='ml-2 font-medium text-primary hover:underline text-blue-700'>Login</Link>
        </p>
       </div>
       <CommonForm 
        formControls={registerFormControl}
        formData={formData}
        setFormData={setFormData}
        buttonText={'Create Account'}
        onSubmit={onSubmit}
       />
    </div>
  )
}

export default Register