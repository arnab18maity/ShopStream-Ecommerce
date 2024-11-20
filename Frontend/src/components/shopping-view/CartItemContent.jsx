import React,{useEffect} from 'react'
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash } from 'lucide-react';
import { useSelector } from 'react-redux'
import { updateCartItemQuantity, deleteCartItem, fetchCartItems } from '@/store/shop/cartSlice';
import { useDispatch } from 'react-redux';
import { useToast } from '../ui/use-toast';
import { ToastAction } from "../ui/toast";
import { fetchAllFilteredProducts } from '@/store/shop/productSlice';



function UserCartItemContent({cartItem}) {
  const {user} = useSelector((state) => state.auth) 
  const {cartItems} = useSelector(state => state.cartProducts)
  const { productList } = useSelector(state => state.shopProducts)
  const dispatch = useDispatch()
  const {toast} = useToast()

  useEffect(() => {
    if (productList.length === 0) {
      dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
    }
  }, [dispatch, productList]);

  function handleItemDelete({productid,userid}) {
   dispatch(deleteCartItem({userid,productid}))
   .then((data) => {
     if(data?.payload?.success) {
       dispatch(fetchCartItems(userid));
       toast({
         title: data?.payload?.message
       })
     }
   })
}

  function handleUpdateQuantity(currentItem,typeOfAction) {
    if(typeOfAction == 'plus') {
      let getCartItems = cartItems.items || []

      if(getCartItems.length) {
        const indexofCurrentCartItem = getCartItems.findIndex(item => item.productid === currentItem?.productid)

        if(indexofCurrentCartItem !== -1) {
          const getQuantity = getCartItems[indexofCurrentCartItem].quantity
          const getCurrentProductIndex = productList.findIndex(product => product._id === currentItem?.productid)  
          const currentTotalStock = productList[getCurrentProductIndex]?.totalstock
          
          if(getQuantity + 1 > currentTotalStock) { 
            toast({
              title: `You can't add more than ${currentTotalStock} items`,
              variant: "destructive",
              action: <ToastAction altText="Try Again">Try Again</ToastAction>
            })
            return; 
          }
        }
      }
    }

    dispatch(updateCartItemQuantity({userid: user?.id, productid: currentItem?.productid, quantity:typeOfAction === 'plus' ? currentItem?.quantity + 1 : currentItem?.quantity - 1}))
    .then((data) => {
      if(data?.payload?.success) {
         toast({
            title: data?.payload?.message
         })
      }
    })
  }

  return (
    <div className='flex items-center space-x-4'>
        <img 
         src={cartItem?.image}
         alt={cartItem?.title}
         className='w-20 h-20 object-cover rounded'
        />
        <div className='flex-1'>
           <h3 className='font-extrabold'>{cartItem?.title}</h3>
           <div className='flex items-center mt-1 gap-2'>
             <Button 
              variant='outline' 
              size='icon' 
              className="h-8 w-8 rounded-full" 
              disabled = {cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem,'minus')}
            >
               <Minus className='w-4 h-4'/>
               <span className='sr-only'>Decrease</span>
            </Button>
            <span className='font-semibold'>{cartItem?.quantity}</span>
            <Button 
              variant='outline' 
              size='icon' 
              className="h-8 w-8 rounded-full"
              onClick={() => handleUpdateQuantity(cartItem,'plus')}
            >
               <Plus className='w-4 h-4'/>
               <span className='sr-only'>Increase</span>
            </Button>
           </div>
        </div>
        <div className='flex flex-col items-end'>
            <p className='font-semibold'>
               ${((cartItem?.saleprice > 0 ? cartItem?.saleprice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
            </p>
            <Trash 
              className='cursor-pointer mt-1' 
              size={20} 
              onClick={() => handleItemDelete({productid: cartItem?.productid, userid: user?.id})}
            />

        </div>
    </div>
  )
}

export default UserCartItemContent