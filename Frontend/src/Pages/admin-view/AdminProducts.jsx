import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import CommonForm from "@/components/common/CommonForm";
import ImageUpload from "./ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/productSlice";
import { useToast } from "@/components/ui/use-toast";
import AdminProductTile from "@/components/admin-view/ProductTile";
import { ToastAction } from '@/components/ui/toast';


const initialState = {
  image: "",
  title: "",
  description: "",
  category: "",
  brand: "",
  price: 0,
  saleprice: 0,
  totalstock: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);


  const {productList} = useSelector(state => state.adminProducts)
  const dispatch = useDispatch();
  const {toast} = useToast();

  function handleDelete(currentProductId) {
     dispatch(deleteProduct(currentProductId)).then((data) => {
       if(data?.payload?.success) {
         dispatch(fetchAllProducts())
         toast({
           title: data.payload.message
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

  function onSubmit(e) {
    e.preventDefault();

    currentEditedId !== null ?
      dispatch(editProduct({
        id: currentEditedId,
        formData
      })).then(data => {
        if(data?.payload?.success) {
          dispatch(fetchAllProducts())
          setCurrentEditedId(null)
          setFormData(initialState)
          setOpenCreateProductsDialog(false)
          toast({
            title: data.payload.message
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
    :
      dispatch(addNewProduct({
        ...formData,
        image: uploadedImageUrl
      })).then((data) => {
        if(data?.payload?.success) {
          dispatch(fetchAllProducts())
          setImageFile(null)
          setFormData(initialState)
          setOpenCreateProductsDialog(false)
          toast({
            title: data.payload.message
          })
        }
        else{
          toast({
            title: data?.payload?.message,
            variant:'destructive',
            action: <ToastAction altText="Try again">Try again</ToastAction>
          })
        }
      });
  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  },[dispatch])

  return (
    <Fragment>
      <div className="flex mb-5 justify-end w-full">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {
          productList && productList.length > 0 ? 
              productList.map(product => 
                <AdminProductTile 
                  setCurrentEditedId={setCurrentEditedId}  
                  setOpenCreateProductsDialog = {setOpenCreateProductsDialog} 
                  setFormData = {setFormData}
                  handleDelete={handleDelete}
                  product={product}
                />
              )
          :  
            null
        }
      </div>

      {/*  TODO: Experiment with onOpenChange */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false)
          setCurrentEditedId(null)
          setFormData(initialState)
        }}
      >
        <SheetContent side="right" className="overflow-auto">

          <SheetHeader className="border-b">
            <SheetTitle className="mb-2 font-extrabold">
              {
                currentEditedId !== null ? "Edit Product" : "Add New Product"
              }
            </SheetTitle>
          </SheetHeader>

          <ImageUpload 
           imageFile={imageFile} 
           setImageFile={setImageFile} 
           uploadedImageUrl={uploadedImageUrl} 
           setUploadedImageUrl={setUploadedImageUrl}
           imageLoadingState={imageLoadingState}
           setImageLoadingState={setImageLoadingState}
           isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText={currentEditedId !== null ? "Update Product" : "Add Product"}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
