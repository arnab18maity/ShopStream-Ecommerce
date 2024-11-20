import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { capturePayment } from '@/store/shop/orderSlice'


function PaypalReturn() {
  const dispatch = useDispatch()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const paymentId = params.get('paymentId')
  const payerId = params.get('PayerID')

  useEffect(() => {
    if(paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'))
      dispatch(capturePayment({paymentid: paymentId, payerid: payerId, orderid: orderId})).then((data) => {
        if(data?.payload?.success) {
          sessionStorage.removeItem('currentOrderId')
          window.location.href = '/shop/payment-success'
        }
      })
    }
   
  },[paymentId, payerId,dispatch])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please Wait!!</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default PaypalReturn