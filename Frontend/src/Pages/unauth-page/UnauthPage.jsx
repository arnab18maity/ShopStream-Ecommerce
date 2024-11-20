import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
function UnauthPage() {
  const navigate = useNavigate()
  return (
    <>
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
     <div className='w-screen flex justify-center items-center text-red-600 font-extrabold text-3xl'>You Don't Have Permission To Access This Page</div>
     <div className='w-screen flex justify-center items-center mt-3'>
     <Button onClick={() => navigate('/shop/home')} className='w-36 h-10 rounded-md'>Go to Home</Button>
     </div>
     </div>
    </>
  )
}

export default UnauthPage