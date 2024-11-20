import React,{useState,useEffect} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import ShopOrderDetailsDialog from './ShopOrderDetailsDialog'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrderByUser } from '@/store/shop/orderSlice'
import { Badge } from '../ui/badge'
import { getOrderDetails } from '@/store/shop/orderSlice'
import { resetOrderDetails } from '@/store/shop/orderSlice'

const orderStatusMap = {
  'pending': 'Pending',
  'processing': 'Processing',
  'shipped': 'Shipped',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled',
  'rejected': 'Rejected',
  'confirmed': 'Confirmed'
}

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.auth)
  const {orderList, orderDetails} = useSelector(state => state.shopOrder)

  useEffect(() => {
    dispatch(getAllOrderByUser(user?.id))
  },[dispatch])

  function handleFetchOrderDetails(currentOrderId) {
      dispatch(getOrderDetails(currentOrderId))
  }

  useEffect(() => {
    if(orderDetails !== null) {
      setOpenDetailsDialog(true)
    }
  },[orderDetails])

  return (
    <Card>
      <CardHeader>
        <CardTitle> Order History </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Amount</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              orderList && orderList.length > 0 ?
                orderList.map((order) => (
                  <TableRow>
                    <TableCell>{order?._id}</TableCell>
                    <TableCell>{order?.orderdate.split('T')[0].split("-").reverse().join("-")}</TableCell>
                    <TableCell>
                      <Badge className={`${order?.orderstatus === 'confirmed' ? 'bg-green-500' :'bg-black'} py-1 px-3`}>
                        {orderStatusMap[order?.orderstatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">${order?.totalamount}</TableCell>
                    <TableCell>
                      <Dialog open={openDetailsDialog} onOpenChange={() => {
                         setOpenDetailsDialog(false)
                         dispatch(resetOrderDetails())
                        }}
                      >
                        <Button onClick={() => handleFetchOrderDetails(order?._id)}>
                          View Details
                        </Button>

                        <ShopOrderDetailsDialog orderDetails={orderDetails}/>

                      </Dialog>
                    </TableCell>
                  </TableRow> 
                ))     
              : 
              null
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders