import React, {useEffect, useState} from 'react'
import bannerOne from '../../assets/banner-1.webp'
import bannerTwo from '../../assets/banner-2.webp'
import bannerThree from '../../assets/banner-3.webp'
import { Button } from '@/components/ui/button';
import { BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon, Footprints, WatchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '@/store/shop/productSlice';
import ShoppingProductTile from '@/components/shopping-view/ProductTile';
import { useNavigate } from 'react-router-dom';
import ProductDetailsDialog from '@/components/shopping-view/ProductDetails';
import { getProductDetails } from '@/store/shop/productSlice';
import { addToCart,fetchCartItems } from '@/store/shop/cartSlice';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';




function ShoppingHome() {
  const slides = [bannerOne, bannerTwo, bannerThree]
  const {productList, productDetails} = useSelector(state => state.shopProducts)
  const {cartItems} = useSelector(state => state.cartProducts)
  const {user} = useSelector(state => state.auth)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [open,setOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {toast} = useToast()

  const categoriesWithIcon = [
    { id: 'men', label: "Men", icon: ShirtIcon},
    { id: 'women', label: "Women", icon: CloudLightning},
    { id: 'kids', label: "Kids", icon: BabyIcon},
    { id: 'accessories', label: "Accessories", icon: WatchIcon},
    { id: 'footwear', label: "Footwear", icon: Footprints},
  ]

  const brandsWithIcon = [
    { id: 'nike', label: "Nike" , icon: ShirtIcon},
    { id: 'adidas', label: "Adidas", icon: ShirtIcon },
    { id: 'puma', label: "Puma", icon: ShirtIcon },
    { id: 'levi', label: "Levi's", icon: ShirtIcon },
    { id: 'zara', label: "Zara", icon: ShirtIcon },
    { id: 'h&m', label: "H&M", icon: ShirtIcon },
  ]

  function handleNavigatetoListingPage(currentItemId, section) {
    sessionStorage.removeItem('filters')
    const currentFilter = {
      [section]: [currentItemId]
    }
    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate('/shop/listing')
  } 

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

  useEffect(() => {
    if(productDetails) setOpen(true)
  },[productDetails])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)
    },7000)
    return () => clearInterval(timer)
  },[])

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({filterParams:{}, sortParams:"price-lowtohigh"}))
  },[dispatch])

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='relative w-full h-[600px] overflow-hidden'>
         {
           slides.map((slide, index) => (
              <img 
                src={slide}
                key={index}
                className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
           ))
         }
         <Button variant='outline' size='icon' className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80'
          onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length)}
         >
           <ChevronLeftIcon className='w-4 h-4'/>
         </Button>

         <Button variant='outline' size='icon' className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80'
          onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)}
         >
           <ChevronRightIcon className='w-4 h-4'/>
         </Button>
      </div>

      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Shop By Category</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {
              categoriesWithIcon.map((categoryItem, index) => (
                 <Card onClick={() => handleNavigatetoListingPage(categoryItem.id,'category')} className='cursor-pointer hover:shadow-lg transition-shadow'>
                    <CardContent className='flex flex-col items-center justify-center p-6'>
                      <categoryItem.icon className='w-12 h-12 mb-4 text-primary'/>
                      <span className='font-bold'>{categoryItem.label}</span>
                    </CardContent>
                 </Card>
              ))
            }
          </div>
        </div>
      </section>

      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Shop By Brand</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {
              brandsWithIcon.map((brandItem, index) => (
                 <Card onClick={() => handleNavigatetoListingPage(brandItem.id,'brand')} className='cursor-pointer hover:shadow-lg transition-shadow'>
                    <CardContent className='flex flex-col items-center justify-center p-6'>
                      <brandItem.icon className='w-12 h-12 mb-4 text-primary'/>
                      <span className='font-bold'>{brandItem.label}</span>
                    </CardContent>
                 </Card>
              ))
            }
          </div>
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>Featured Products</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {
                 productList && productList.length > 0 ?
                   productList.map(product => 
                   <ShoppingProductTile
                     product={product}
                     handleGetProductDetails={handleGetProductDetails}
                     handleAddtoCart={handleAddtoCart}
                   /> 
                  ) 
                 : null
              }
            </div>
        </div>
      </section>
      <ProductDetailsDialog open={open} setOpen={setOpen} productDetails={productDetails}/>

    </div>
  )
}

export default ShoppingHome