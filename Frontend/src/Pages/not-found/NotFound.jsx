import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'

function NotFound() {
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth.user)
  return (
    <>
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
     <div className='w-screen flex justify-center items-center text-red-600 font-extrabold text-3xl'>
      Page Not Found
      </div>
     <div className='w-screen flex justify-center items-center mt-3'>
     <Button 
       onClick={() => user?.role === 'admin' ? navigate('/admin/dashboard') : navigate('/shop/home')} 
       className='w-36 h-10 rounded-md'  
     >
      {
        user?.role === 'admin' ? 'Go to Dashboard' : 'Go to Home'
      }
     </Button>
     </div>
     </div>
    </>
  )
}

export default NotFound