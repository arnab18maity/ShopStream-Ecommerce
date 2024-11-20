import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate,createSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, resetTokenAndCredentials } from "@/store/authSlice";
import { useToast, } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import UserCartWrapper from "./CartWrapper";
import { fetchCartItems } from "@/store/shop/cartSlice";
import { Label } from "../ui/label";



function MenuItems() {
  const navigate = useNavigate()

  function handleNavigate(currentMenuItem) {
    sessionStorage.removeItem('filters')

    const currentFilter = currentMenuItem.id !== 'home' && currentMenuItem.id !== 'products' && currentMenuItem.id !== 'search'  ?
    {
      category: [currentMenuItem.id]
    } : null;

    if(currentFilter) sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    
    const params = currentFilter ? createSearchParams({ category: currentMenuItem.id }) : '';

    navigate(`${currentMenuItem.path}?${params}`);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((item) => (
        <Label 
         key={item.id} 
         className="text-sm font-medium cursor-pointer"
         onClick={() => handleNavigate(item)}
        >
          {item.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {toast} = useToast()
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const {cartItems} = useSelector(state => state.cartProducts)
  
  useEffect(() => {
     dispatch(fetchCartItems(user?.id))
  },[dispatch])

  function handleLogOut() {
    dispatch(resetTokenAndCredentials()).then(
        toast({
            title: "Logged Out Successfully!"
        })
    )
    navigate('/auth/login')
 }

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setOpenCartSheet(true)}
            className='relative'
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-[-5px] right-[2px] text-sm font-bold text-red-600">{cartItems?.items?.length || 0}</span>
            <span className="sr-only">User Cart</span>
          </Button>
          <UserCartWrapper 
            cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} 
            setOpenCartSheet={setOpenCartSheet}
          />
      </Sheet>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged In As <span className="font-bold">{user.username}</span></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/shop/account')}>
            <UserCog className="mr-2 h-4 w-4"/>
            <div className="w-full font-semibold cursor-pointer">Account</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogOut}>
            <LogOut className="mr-2 h-4 w-4"/>
            <div className="w-full text-red-600 font-extrabold cursor-pointer">Log Out</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
      <Link className="flex items-center gap-2" to={"/shop/home"}>
        <HousePlug className="h-6 w-6" />
        <span className="font-bold">ShopStream</span>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="lg:hidden sm:block" variant="outline" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Header Menu</span>
          </Button>     
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-xs">
          <div className="mb-5"><HeaderRightContent/></div>
          <div><MenuItems /></div>
        </SheetContent>
      </Sheet>
      <div className="hidden lg:block">
        <MenuItems />
      </div>
      <div className="hidden lg:block">
       <HeaderRightContent />
      </div>

     </div>
    </header>
  );
}

export default ShoppingHeader;
