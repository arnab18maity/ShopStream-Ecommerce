import AuthLayout from "./components/auth/AuthLayout"
import Login from "./Pages/auth/Login"
import Register from "./Pages/auth/Register"
import AdminLayout from "./components/admin-view/AdminLayout"
import { Navigate, Route, Routes } from "react-router-dom"
import AdminDashboard from "./Pages/admin-view/AdminDashboard"
import AdminOrders from "./Pages/admin-view/AdminOrders"
import AdminProducts from "./Pages/admin-view/AdminProducts"
import ShoppingLayout from "./components/shopping-view/ShoppingLayout"
import NotFound from "./Pages/not-found/NotFound"
import ShoppingAccount from "./Pages/shopping-view/ShoppingAccount"
import ShoppingCheckout from "./Pages/shopping-view/ShoppingCheckout"
import ShoppingHome from "./Pages/shopping-view/ShoppingHome"
import ShoppingListing from "./Pages/shopping-view/ShoppingListing"
import CheckAuth from "./components/common/CheckAuth"
import UnauthPage from "./Pages/unauth-page/UnauthPage"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { checkAuth } from "./store/authSlice/index"
import { Skeleton } from "./components/ui/skeleton"
import PaypalReturn from "./Pages/shopping-view/PaypalReturn"
import PaymentSuccess from "./Pages/shopping-view/PaymentSuccess"
import ShopSearch from "./Pages/shopping-view/ShopSearch"

function App() {  
  
  const {user, isAuthenticated, isLoading} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])

  if(isLoading) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" /> 
  }
  

  return (
    <>
     <div className="flex flex-col overflow-hidden bg-white ">
       <Routes>
         <Route path="/auth" element={
           <CheckAuth isAuthenticated={isAuthenticated} user={user}>
             <AuthLayout />
           </CheckAuth>
         }>
           <Route path="login" element={<Login />}/>
           <Route path="register" element={<Register />}/>
         </Route>

         <Route path="/admin" element={
           <CheckAuth isAuthenticated={isAuthenticated} user={user}>
             <AdminLayout />
           </CheckAuth>
         }>
            <Route path="dashboard" element={<AdminDashboard />}/>
            <Route path="orders" element={<AdminOrders />}/>
            <Route path="products" element={<AdminProducts />}/>
         </Route> 

         <Route path="/shop" element={
           <CheckAuth isAuthenticated={isAuthenticated} user={user}>
             <ShoppingLayout />
           </CheckAuth>
         }>
            <Route path="account" element={<ShoppingAccount />}/>
            <Route path="checkout" element={<ShoppingCheckout />}/>
            <Route path="home" element={<ShoppingHome />}/>
            <Route path="listing" element={<ShoppingListing />}/>
            <Route path="paypal-return" element={<PaypalReturn />}/>
            <Route path="payment-success" element={<PaymentSuccess />}/>
            <Route path="search" element={<ShopSearch />}/>
         </Route>

         <Route path="/" element={<Navigate to="/shop/home" />}/>
         <Route path="*" element={<NotFound />}/>
         <Route path="/unauth-page" element={<UnauthPage />}/>

       </Routes>
     </div> 
    </>
  )
}

export default App
