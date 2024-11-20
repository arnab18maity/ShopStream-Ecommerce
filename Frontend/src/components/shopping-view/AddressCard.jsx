import React from 'react'
import { Card, CardContent, CardFooter} from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

function AddressCard({addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress, selectedAddress}) {
  return (
    <Card 
      className={`bg-slate-200 cursor-pointer ${selectedAddress?._id === addressInfo?._id ? "border-black border-[2px]" : ''} `} 
      onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : null}
    >
        <CardContent className={`grid gap-4 p-4 cursor-pointer`}>
           <Label>Name: {addressInfo?.name}</Label>
           <Label>Mobile: +91 {addressInfo?.mobile}</Label>
           <Label>Address: {addressInfo?.address}</Label>
           <Label>City: {addressInfo?.city}</Label> 
           <Label>State: {addressInfo?.state}</Label>
           <Label>Pin Code: {addressInfo?.pincode}</Label>
           <Label>{addressInfo.landmark ? `Landmark: ${addressInfo?.landmark}` : null}</Label>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
            <Button className="bg-red-500" onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
        </CardFooter>
    </Card>
  )
}

export default AddressCard