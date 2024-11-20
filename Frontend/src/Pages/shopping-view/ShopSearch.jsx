import ShoppingProductTile from '@/components/shopping-view/ProductTile'
import { Input } from '@/components/ui/input'
import { resetSearchProductList, searchProductsByKeyWord } from '@/store/shop/searchSlice'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { addToCart } from "@/store/shop/cartSlice";
import { fetchCartItems } from "@/store/shop/cartSlice";
import ProductDetailsDialog from '@/components/shopping-view/ProductDetails'
import { getProductDetails } from "@/store/shop/productSlice";

function ShopSearch() {
  const {user} = useSelector(state => state.auth)
  const [keyWord, setKeyWord] = useState("")
  const [open, setOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const {cartItems} = useSelector(state => state.cartProducts)
  const {productDetails} = useSelector(state => state.shopProducts)
  const dispatch = useDispatch()
  const { searchProductList } = useSelector(state => state.shopSearch)
  const { toast } = useToast()

  useEffect(() => {
    if(keyWord && keyWord.trim !== '' && keyWord.length >= 3) {
        const timer = setTimeout(() => {
          setSearchParams(new URLSearchParams(`?keyword=${keyWord}`)) 
          dispatch(searchProductsByKeyWord(keyWord))  
        },1000)
        return () => clearTimeout(timer)
    }
    else {
        setSearchParams({}) 
        dispatch(resetSearchProductList());
        return;
    }
  },[keyWord,setSearchParams,dispatch])

  useEffect(() => {
    if(productDetails) setOpen(true)
  },[productDetails])

  function handleGetProductDetails(productId) {
    dispatch(getProductDetails(productId))
  }

  function handleAddtoCart(productid, currentTotalStock) {
    let getCartItems = cartItems.items || []
    
    if(getCartItems.length) {
      const indexofCurrentItem = getCartItems.findIndex(item => item.productid === productid)
      if(indexofCurrentItem !== -1) {
        const getQuantity = getCartItems[indexofCurrentItem].quantity
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

    dispatch(addToCart({userid: user?.id, productid: productid, quantity: 1}))
    .then((data) => {
      if(data?.payload?.success) {
        dispatch(fetchCartItems(user?.id))
        toast({
          title: data?.payload?.message
        })
      }
    })
  }

  return (
    <div className='container mx-auto md:px-6 px-4 py-8'>
        <div className='flex justify-center mb-8'>
           <div className='w-full flex items-center border border-black rounded-lg'>
              <Input
                name='keyword'
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
                className='py-6'
                placeholder='Search Products...'
              />
           </div>
        </div>
        {
            !searchProductList.length ? <h1 className='text-5xl font-extrabold'>No Product Found</h1> : null
        }
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {
                searchProductList.map(product => (
                    <ShoppingProductTile 
                      product={product} 
                      handleAddtoCart={handleAddtoCart}
                      handleGetProductDetails={handleGetProductDetails}
                    />
                )) 
            }
        </div>
        <ProductDetailsDialog open={open} setOpen={setOpen} productDetails={productDetails}/>

    </div>
  )
}

export default ShopSearch