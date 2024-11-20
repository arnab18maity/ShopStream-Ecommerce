import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import UserCartItemContent from './CartItemContent'
import { useNavigate } from 'react-router-dom'

function UserCartWrapper({cartItems, setOpenCartSheet}) {

   const navigate = useNavigate()

   const cartTotalAmount = cartItems && cartItems.length > 0 ? cartItems.reduce((total,item) => total + item.quantity * (item.saleprice || item.price),0) : 0;

  return (
    <SheetContent className="sm:max-w-md">
        <SheetHeader>
            <SheetTitle className="text-xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>

        <div className='mt-8 space-y-4'>
           {
             cartItems && cartItems.length > 0 ?
              cartItems.map((item) => (
                <UserCartItemContent cartItem={item}/>
              ))
             : <p className='text-center text-xl text-muted-foreground text-red-400'>Your Cart is Empty!! Let's Add Some Product</p>
           }
        </div>

        <div className={`${cartItems && cartItems.length > 0 ? '' : 'hidden'} mt-8 space-y-4`}>
            <div className='flex justify-between'>
              <span className='font-bold'>Total Amount</span>
              <span className='font-bold'>${cartTotalAmount.toFixed(2)}</span>
            </div>
        </div>

        <Button 
         className={`${cartItems && cartItems.length > 0 ? '' : 'hidden'} w-full mt-6`}
         onClick={() => {
           navigate('/shop/checkout')
           setOpenCartSheet(false)
         }}
        >
           Buy Now
        </Button>

    </SheetContent> 
  )
}

export default UserCartWrapper