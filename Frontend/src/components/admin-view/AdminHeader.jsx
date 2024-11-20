import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/authSlice';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '../ui/toast';



function AdminHeader({setOpen}) {
   
   const dispatch = useDispatch();
   const {toast} = useToast();

   function handleLogOut() {
      dispatch(logoutUser()).then((data) => {
         if(data?.payload?.success) {
            toast({
               title: data?.payload?.message
            })
         }
         else{
          toast({
            title: data?.payload?.message,
            variant:'destructive',
            action: <ToastAction altText="Try again">Try again</ToastAction>
          })
         }
      })
   }

  return ( 
    <header className='flex items-center justify-between px-4 py-3 bg-background border-b'>
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
       <AlignJustify/>
       <span className='sr-only'>Toggle Menu</span>
      </Button>
      <div className='flex flex-1 justify-end'>
        <Button onClick={handleLogOut} className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow">
          <LogOut />
          Log Out
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader