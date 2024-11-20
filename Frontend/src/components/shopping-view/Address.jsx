import React,{useEffect, useState} from 'react'
import { addressFormControls } from '@/config';
import { useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import CommonForm from '../common/CommonForm';
import { addAddress, editAddress, deleteAddress, fetchAllAddress } from '@/store/shop/addressSlice';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ToastAction } from '../ui/toast';
import AddressCard from './AddressCard';


const intialAddressFormData = {
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
}

function Address({setCurrentSelectedAddress, selectedAddress}) {
  const [formData, setFormData] = useState(intialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch()

  const {user} = useSelector(state => state.auth)
  const {addressList} = useSelector(state => state.shopAddress)
  const {toast} = useToast() 


   useEffect(() => {
     dispatch(fetchAllAddress(user?.id))
   },[dispatch])


    function handleManageAddress(e) {
        e.preventDefault();

        if(currentEditedId === null && addressList.length >= 3 ) {
            toast({
              title: "Maximum 3 Addresses Allowed",
              variant:'destructive',
              action: <ToastAction altText="Try again">Error</ToastAction>
            })

            setFormData(intialAddressFormData)
            return;
        }

        currentEditedId !== null ?
         dispatch(editAddress({formData, userid: user?.id, addressid: currentEditedId}))
         .then((data) => {
            console.log(data);
            
           if(data?.payload?.success) {
             dispatch(fetchAllAddress(user?.id))
             setCurrentEditedId(null)
             setFormData(intialAddressFormData)
             toast({
               title: data?.payload?.message
             })
            }
            else{
              toast({
                title: "Something Went Wrong!!",
                variant:'destructive',
                action: <ToastAction altText="Try again">Try again</ToastAction>
              })
            }
         })
        :
        dispatch(addAddress({...formData, userid: user?.id})).then((data) => {
            if(data?.payload?.success) {
                dispatch(fetchAllAddress(user?.id))
                setFormData(intialAddressFormData)
                toast({
                title: data?.payload?.message
                })
                }
            else{
                toast({
                title: "Please Provide All the Required Fields!!",
                variant:'destructive',
                action: <ToastAction altText="Try again">Try again</ToastAction>
                })
            }
        })
    }

    function handleDeleteAddress(currentAddress) {
       dispatch(deleteAddress({userid: user?.id, addressid: currentAddress?._id})).then((data) => {
         if(data?.payload?.success) {
           dispatch(fetchAllAddress(user?.id))
           toast({
             title: data?.payload?.message
           })
         }
       })
    }

    function handleEditAddress(currentAddress) {
      setCurrentEditedId(currentAddress?._id)
      setFormData({
        ...formData,
        name: currentAddress?.name,
        mobile: currentAddress?.mobile,
        address: currentAddress?.address,
        city: currentAddress?.city,
        state: currentAddress?.state,
        pincode: currentAddress?.pincode,
        landmark: currentAddress?.landmark
      })
    }

  return (
    <>
     <Card>
        <div className='mb-5 p-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
            {
                addressList && addressList.length > 0 ?
                  addressList.map((singleAddress) => (
                    <AddressCard 
                     addressInfo={singleAddress}
                     handleDeleteAddress={handleDeleteAddress}
                     handleEditAddress={handleEditAddress}
                     setCurrentSelectedAddress={setCurrentSelectedAddress}
                     selectedAddress={selectedAddress}
                    />
                  ))
                : <p className='mt-5 text-center text-muted-foreground'>No Saved Address</p>
            }
        </div>
        <CardHeader>
            <CardTitle className="font-extrabold">
                {currentEditedId !== null ? "Edit Address" : "Add New Address"}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <CommonForm 
                formControls={addressFormControls}
                formData={formData}
                setFormData={setFormData}
                buttonText={currentEditedId !== null ? "Update Address" : "Add Address"}
                onSubmit={handleManageAddress}
            />    
        </CardContent>
     </Card>
    </>
  )
}

export default Address