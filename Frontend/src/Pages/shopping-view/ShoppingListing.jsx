import ProductFilter from "@/components/shopping-view/ProductFilter";
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import { useDispatch } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/productSlice";
import { useSelector } from "react-redux";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import { useSearchParams } from "react-router-dom";
import { getProductDetails } from "@/store/shop/productSlice";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetails";
import { addToCart } from "@/store/shop/cartSlice";
import { toast, useToast } from "@/components/ui/use-toast";
import { fetchCartItems } from "@/store/shop/cartSlice";
import { ToastAction } from "@/components/ui/toast";

 

function createSearchParamHelper(filterParams) {
    const queryParams = [];

    for(const [key,value] of Object.entries(filterParams)) {
      if(Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
      }
    }

    return queryParams.join("&");
}
 
function ShoppingListing() { 
  const dispatch = useDispatch()
  const {productList, productDetails} = useSelector(state => state.shopProducts)
  const {cartItems} = useSelector(state => state.cartProducts)
  const {user} = useSelector(state => state.auth)
  const {toast} = useToast()
  

  const [filters, setFilters] = useState({});
  const [sort,setSort] = useState(null);
  const [searchParams,setSearchParams] = useSearchParams();
  const [open,setOpen] = useState(false);
  

  function handleSort(value) {
    setSort(value)
  }

  function handleFilter(getSectionId, getCurrentOption) {
     let cpyFilters = {...filters};
     
     const indexofCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId)

     if(indexofCurrentSection === -1) {
        cpyFilters = {
          ...cpyFilters,
          [getSectionId]: [getCurrentOption]
        };
      }
      else {
        const indexofCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption)

        if(indexofCurrentOption === -1) cpyFilters[getSectionId].push(getCurrentOption)
        else cpyFilters[getSectionId].splice(indexofCurrentOption,1)
      }

      setFilters(cpyFilters)
      sessionStorage.setItem("filters", JSON.stringify(cpyFilters))
  }

  function handleGetProductDetails(productId) {
    dispatch(getProductDetails(productId))
  }

  function handleAddtoCart(productid, currentTotalStock) {
    let getCartItems = cartItems.items || []
    
    if(getCartItems.length) {
      const indexofCurrentItem = getCartItems.findIndex(item => item.productid === productid)
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

    dispatch(addToCart({userid: user?.id, productid: productid, quantity: 1}))
    .then((data) => {
      if(data?.payload?.success) {
        dispatch(fetchCartItems(user?.id))
        toast({
          title: data?.payload?.message
        })
      }
    })
  }
  
  useEffect(() => {
    if(filters && Object.keys(filters).length > 0) {
       const queryString = createSearchParamHelper(filters)
       setSearchParams(new URLSearchParams(queryString))
    }
  },[filters])

  useEffect(() => {
    setSort('price-lowtohigh')
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {})
  },[searchParams])

  
  useEffect(() => {
    if(filters !== null && sort !== null) 
      dispatch(fetchAllFilteredProducts({filterParams: filters, sortParams: sort}))
  },[dispatch, sort, filters])

  useEffect(() => {
    if(productDetails) setOpen(true)
  },[productDetails])

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter}/>
      <div className="bg-background rounded-lg shadow-sm w-full">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex gap-3 items-center ">
            <span className="text-muted-foreground "> {productList?.length} Products </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className='w-[200px] '>
                   <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {
                      sortOptions.map(item => 
                         <DropdownMenuRadioItem key={item.id} value={item.id} className="cursor-pointer">
                           {item.label}
                         </DropdownMenuRadioItem>
                      )
                    }
                   </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {
            productList && productList.length > 0 ?
              productList.map((productItem) => (
                <ShoppingProductTile 
                  handleGetProductDetails={handleGetProductDetails} 
                  key={productItem.id} 
                  product={productItem} 
                  handleAddtoCart={handleAddtoCart}
                />
              )) : <div className="text-center">No Products Found</div>
          }
        </div>

      </div> 
      <ProductDetailsDialog open={open} setOpen={setOpen} productDetails={productDetails}/>
    </div>
  );
}

export default ShoppingListing;
