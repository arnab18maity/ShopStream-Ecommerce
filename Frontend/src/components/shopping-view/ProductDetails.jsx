import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useSelector } from "react-redux";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { useToast } from "../ui/use-toast";
import { useDispatch } from "react-redux";
import { setProductDetails } from "@/store/shop/productSlice";
import { ToastAction } from "../ui/toast";
import { Label } from "../ui/label";
import StarRating from "../common/StarRating";
import { addProductReview, fetchAllReview } from "@/store/shop/reviewSlice";
function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState('')
  const [rating, setRating] = useState(0)
  const { user } = useSelector((state) => state.auth);
  const {cartItems} = useSelector(state => state.cartProducts)
  const {reviewList} = useSelector(state => state.shopReview)
  const { toast } = useToast();
  const dispatch = useDispatch();
  const averageRating = reviewList && reviewList.length > 0 ? reviewList.reduce((sum,reviewItem) => sum + reviewItem.reviewvalue, 0) / reviewList.length : 0;

  useEffect(() => {
    if(productDetails !== null) {
      dispatch(fetchAllReview(productDetails?._id))
    }
  }, [productDetails])

  function handleRatingChange(newRating) {
     setRating(newRating);
  }

  function handleAddReview() {
     dispatch(addProductReview({productid: productDetails?._id, userid: user?.id, username: user?.username, reviewMessage: reviewMsg, reviewvalue: rating})). then((data) => {
        if(data?.payload?.success) {
           setReviewMsg('')
           setRating(0)
           dispatch(fetchAllReview(productDetails?._id))
           toast({
              title: data?.payload?.message
           })
        }
     })
  }

  function handleAddtoCart(currentProductId, currentTotalStock) {
    let getCartItems = cartItems.items || []
    
    if(getCartItems.length) {
      const indexofCurrentItem = getCartItems.findIndex(item => item.productid === currentProductId)
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

    dispatch(addToCart({userid: user?.id, productid: currentProductId, quantity: 1}))
    .then((data) => {
      if(data?.payload?.success) {
        dispatch(fetchCartItems(user?.id))
        toast({
          title: data?.payload?.message
        })
      }
    })
  }

  function handleDialogClose() {
    setOpen(false);
    setRating(0);
    setReviewMsg('');
    dispatch(setProductDetails())
  }

  return (
    <Dialog open={ open } onOpenChange={ handleDialogClose }>
      <DialogContent className="grid grid-cols-2 overflow-autogap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-auto rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="max-h-[80vh] overflow-auto pr-10 pl-7">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`${
                productDetails?.saleprice > 0
                  ? "line-through text-muted-foreground text-3xl font-semibold"
                  : " text-3xl font-bold text-primary"
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.saleprice > 0 ? (
              <p className={`text-3xl font-bold text-primary`}>
                ${productDetails?.saleprice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRating rating={averageRating}/>     
            </div>
            <span className="text-muted-foreground">({averageRating.toFixed(1)})</span>
          </div>
          <div className="mt-5 mb-5">
            {
              productDetails?.totalstock === 0 ? 
                <Button 
                  className="w-full opacity-60 cursor-not-allowed"
                > 
                  Out of Stock
                </Button>
              :
                <Button 
                className="w-full"
                onClick={() => handleAddtoCart(productDetails._id, productDetails.totalstock)}
                > 
                  Add to Cart
                </Button>
            }
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 mt-2">Reviews</h2>
            <div className="grid gap-6">
              {
                 reviewList && reviewList.length > 0 ?
                   reviewList.map((reviewItem) => (
                    <div className="flex gap-4">
                      <Avatar className="w-10 h-10 border">
                          <AvatarFallback className="bg-black text-white font-bold">
                              {reviewItem.username[0].toUpperCase()}
                          </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                              <h3 className="font-bold text-xl">{reviewItem.username}</h3>
                          </div>
                          <div className="flex items-center gap-0.5">
                              <StarRating rating={reviewItem.reviewvalue} />
                          </div>
                          <p className="text-muted-foreground">
                              {reviewItem.reviewMessage}
                          </p>
                      </div>
                    </div>
                   ))
                  :
                  <h1>No Reviews Yet</h1>
              }
            </div>
          </div>

            <div className="mt-10 flex flex-col gap-2">
               <Label>Write a Review</Label>
               <div className="flex gap-1">
                 <StarRating rating={rating} handleRatingChange={handleRatingChange} />
               </div>
               <Input name="reviewMsg" value={reviewMsg} onChange={(e) => setReviewMsg(e.target.value)} placeholder="Write a Review..."/>
               <Button disabled={rating === 0 || reviewMsg.trim() === ''} onClick={handleAddReview}>
                 Submit
               </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
