import React, {useState} from 'react'
import image from '@/assets/account.jpg'
import Address from '@/components/shopping-view/Address'
import { useDispatch, useSelector } from 'react-redux'
import UserCartItemContent from '@/components/shopping-view/CartItemContent'
import { Button } from '@/components/ui/button'
import { createOrder } from '@/store/shop/orderSlice'
import { toast, useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast'

function ShoppingCheckout() {
  const {cartItems} = useSelector(state => state.cartProducts)
  const cartTotalAmount = cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items.reduce((total,item) => total + item.quantity * (item.saleprice || item.price),0) : 0;

  const {user} = useSelector(state => state.auth)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const [isPaymentStart, setIsPaymentStart] = useState(false)
  const {approvalURL} = useSelector(state => state.shopOrder)
  const dispatch = useDispatch()
  const {toast} = useToast()

  function handleInitiatePaypalPayment() {

    if(currentSelectedAddress === null) {
       toast({
         title:"Please Select an Address",
         variant: 'destructive',
         action: <ToastAction altText="Try again">Try Again</ToastAction>
       })

       return;
    }

    const orderData = {
      userid : user?.id, 
      cartid : cartItems?._id,
      cartitems: cartItems.items.map(item => ({
           productid: item?.productid,
           title: item?.title,
           image: item?.image,
           price: item?.saleprice || item?.price,
           quantity: item?.quantity
      })), 
      addressinfo: {
        addressid: currentSelectedAddress?._id,
        name: currentSelectedAddress?.name,
        mobile: currentSelectedAddress?.mobile,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        state: currentSelectedAddress?.state,
        pincode: currentSelectedAddress?.pincode,
        landmark: currentSelectedAddress?.landmark
      }, 
      orderstatus: 'pending',
      paymentmethod: 'paypal' , 
      paymentstatus: 'pending' , 
      totalamount: cartTotalAmount,
      orderdate: new Date(), 
      orderupdatedate: new Date(), 
      paymentid: '', 
      payerid: ''
    }

    dispatch(createOrder(orderData)).then((data) => {
      console.log(data, "CheckOut Data");
      if(data?.payload?.success) {
         setIsPaymentStart(true)
      } else {
         setIsPaymentStart(false)
      }
    })
     
  }

  if(approvalURL) {
    window.location.href = approvalURL
  }

  return (
    <div className='flex flex-col'>
     <div className='w-full h-[300px] relative overflow-hidden'> 
        <img 
         src={image} 
         alt="Image" 
         className='w-full h-full object-cover object-center'
        />
     </div>
     
     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mt-5 p-5'>
          <Address setCurrentSelectedAddress={setCurrentSelectedAddress} selectedAddress={currentSelectedAddress}/>
        
        <div className='flex flex-col gap-4'>
           {
              cartItems && cartItems.items && cartItems.items.length > 0 ?
              cartItems.items.map((singleItem) => (
                <UserCartItemContent cartItem={singleItem}/>
              ))
              : <p className='text-center text-xl text-muted-foreground text-red-400'>Your Cart is Empty!! Let's Add Some Product</p>
           }
           <div className={`${cartItems && cartItems.items && cartItems.items.length > 0 ? '' : 'hidden'} mt-8 space-y-4`}>
                <div className='flex justify-between'>
                  <span className='font-bold'>Total Amount</span>
                  <span className='font-bold'>${cartTotalAmount.toFixed(2)}</span>
                </div>
           </div> 
           <Button 
              className={`${cartItems && cartItems.items && cartItems.items.length > 0 ? '' : 'hidden'} w-full mt-6`}
              onClick={() => handleInitiatePaypalPayment()}
            >
              {
                 isPaymentStart ? 'Processing Payment ...' : 'Buy Now With PayPal'
              }
            </Button>
        </div>     
     </div>
    </div>
  )
}

export default ShoppingCheckout 