import React,{useState} from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/CommonForm'
import {adminOrderStatus} from '@/config'
import { Badge } from '../ui/badge'
import { useDispatch } from 'react-redux'
import { getOrderDetailsForAdmin, updateOrderStatus, getAllOrdersForAdmin, resetOrderDetails } from '@/store/admin/orderSlice'
import { useToast } from '../ui/use-toast'

const initialFormData = {
    status: ''
}

const orderMap = {
    'pending': 'Pending',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'rejected': 'Rejected',
    'confirmed': 'Confirmed',
    'paypal' : 'Paypal',
    'paid' : 'Paid',
}

function AdminOrderDetailsDialog({orderDetails, setOpenDetailsDialog}) {
    const [formData, setFormData] = useState(initialFormData)
    const dispatch = useDispatch()
    const {toast} = useToast()

    function handleUpdateStatus(e) {
      e.preventDefault();
      const {status} = formData;
      dispatch(updateOrderStatus({id: orderDetails._id, orderStatus: status})).then(data => {
        console.log(data, "Arnab")
        if(data?.payload?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails._id))
          dispatch(getAllOrdersForAdmin())
          setOpenDetailsDialog(false)
          setFormData(initialFormData)
          toast({
            title: data?.payload?.message
          })
        }
      })
    }

    return (
      <DialogContent className="sm:max-w-[600px]">
        <div className='grid gap-6 overflow-auto h-screen max-h-[95vh] pr-4 -mr-4 px-2'>
        <div className='grid gap-2'>
                <div className='flex mt-6 items-center justify-between '>
                    <p className='font-medium'>Order ID</p>
                    <Label>{orderDetails?._id}</Label>
                </div>
                <div className='flex mt-2 items-center justify-between '>
                    <p className='font-medium'>Order Date</p>
                    <Label>{orderDetails?.orderdate.split('T')[0].split("-").reverse().join("-")}</Label>
                </div>
                <div className='flex mt-2 items-center justify-between '>
                    <p className='font-medium'>Order Amount</p>
                    <Label>${orderDetails?.totalamount}</Label>
                </div>
                <div className='flex mt-2 items-center justify-between '>
                    <p className='font-medium'>Payment Method</p>
                    <Label>{orderMap[orderDetails?.paymentmethod]}</Label>
                </div>
                <div className='flex mt-2 items-center justify-between '>
                    <p className='font-medium'>Payment Status</p>
                    <Label>{orderMap[orderDetails?.paymentstatus]}</Label>
                </div>
                <div className='flex mt-2 items-center justify-between '>
                    <p className='font-medium'>Order Status</p>
                    <Label>
                      <Badge 
                        className={`${orderDetails?.orderstatus === 'confirmed' ? 'bg-green-500' :'bg-black'} py-1 px-3`}
                      >
                        {orderMap[orderDetails?.orderstatus]}
                      </Badge>
                    </Label>
                </div>
            </div>
            <Separator /> 
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                     <div className='font-medium'>Order Details</div>
                     <ul className='grid gap-3 '>
                        {
                            orderDetails && orderDetails.cartitems && orderDetails.cartitems.length > 0 ?
                             orderDetails.cartitems.map((orderItem) => (
                                <li className='flex items-center justify-between'>
                                    <img 
                                      src={orderItem.image} 
                                      alt="Product Image" 
                                      className='h-10 w-10 object-cover rounded-md'
                                    />
                                    <span>{orderItem.title}</span>
                                    <span>${orderItem.price}</span>
                                    <span>x{orderItem.quantity}</span>
                                </li>
                             ))
                            
                            : null
                        }
                     </ul>
                </div>
            </div>
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                     <div className='font-medium'>Shipping Info</div>
                     <div className='grid gap-0.5 text-muted-foreground'>
                        <span>{orderDetails?.addressinfo?.name}</span>
                        <span>{orderDetails?.addressinfo?.mobile}</span>
                        <span>{orderDetails?.addressinfo?.address}</span>
                        <span>{orderDetails?.addressinfo?.city}</span>
                        <span>{orderDetails?.addressinfo?.state}</span>
                        <span>{orderDetails?.addressinfo?.pincode}</span>
                        <span>{orderDetails?.addressinfo?.landmark}</span>
                     </div>
                </div>
            </div>

            <div>
                <CommonForm 
                  formControls={adminOrderStatus}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleUpdateStatus}
                  buttonText='Update Order Status'
                />
            </div>
        </div>
      </DialogContent>
  )
}

export default AdminOrderDetailsDialog