import React, {useState,useEffect} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import AdminOrderDetailsDialog from './AdminOrderDetailsDialog'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {getAllOrdersForAdmin, getOrderDetailsForAdmin} from '@/store/admin/orderSlice'
import { resetOrderDetails } from '@/store/admin/orderSlice'
import { Badge } from '../ui/badge'

const orderStatusMap = {
  'pending': 'Pending',
  'processing': 'Processing',
  'shipped': 'Shipped',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled',
  'rejected': 'Rejected',
  'confirmed': 'Confirmed'
}

function   AdminOrdersComp() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const {orderList, orderDetails} = useSelector(state => state.adminOrders)
  const dispatch = useDispatch()

  function handleFetchOrderDetails(currentOrderId) {
    dispatch(getOrderDetailsForAdmin(currentOrderId))
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  },[dispatch])

  // useEffect(() => {
  //   if(orderDetails !== null) {
  //     setOpenDetailsDialog(true)
  //   }
  // },[orderDetails])

  return (
    <Card>
      <CardHeader>
        <CardTitle> All Orders </CardTitle>
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
                         dispatch(resetOrderDetails())
                         setOpenDetailsDialog(false)
                        }}
                      >
                        <Button 
                          onClick={() => {
                            handleFetchOrderDetails(order?._id)
                            setOpenDetailsDialog(true)
                          }}
                        >
                          View Details
                        </Button>
                        <AdminOrderDetailsDialog orderDetails={orderDetails} setOpenDetailsDialog={setOpenDetailsDialog}/>
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

export default AdminOrdersComp