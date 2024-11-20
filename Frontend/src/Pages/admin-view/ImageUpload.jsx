import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import React, { useRef,useEffect } from 'react'
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';



function ImageUpload({imageFile, setImageFile, uploadedImageUrl, setUploadedImageUrl, imageLoadingState, setImageLoadingState, isEditMode}) {

  const inputRef = useRef(null);

   function handleImageFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if(selectedFile) setImageFile(selectedFile)
   }

   function handleDragOver(e) {
     e.preventDefault()
   }

   function handleDrop(e) {
     e.preventDefault()
     const droppedFile = e.dataTransfer.files?.[0]
     if(droppedFile) setImageFile(droppedFile)
   }

    function handleRemoveImage() {
      setImageFile(null)
      if(inputRef.current) inputRef.current.value = "";
    }

    async function uploadImagetoCloudinary() {
      setImageLoadingState(true)
      const data = new FormData();
      data.append("my_file",imageFile)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,data)
      if(response?.data?.success) {
        setUploadedImageUrl(response.data.result.url)
        setImageLoadingState(false)
      }
    }
    
    useEffect(() => {
      if(imageFile !== null) uploadImagetoCloudinary()
    }, [imageFile])
    

  return (
    <div className='w-full max-w-md mx-auto mt-3'>
        <Label className="text-lg font_semibold mb-2 block">
            Upload Image
        </Label>
        <div 
         onDragOver={handleDragOver} 
         onDrop={handleDrop} 
         className={`${isEditMode ? 'opacity-60' : ''} border border-dashed border-black rounded-md`}
        >
            <Input 
             id="image-upload" 
             type="file" 
             className="hidden" 
             ref={inputRef} 
             onChange={handleImageFileChange}
             disabled={isEditMode}
            />
            {
                !imageFile ?
                (
                  <Label 
                    htmlFor="image-upload" 
                    className={`${isEditMode ? 'cursor-not-allowed' : 'cursor-pointer'} flex flex-col items-center justify-center h-32`}
                  >
                    <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2'/>
                    <span>Drag & Drop / Click to Upload Image</span>
                  </Label> 
                )
                : 
                (
                  imageLoadingState ? 
                    <Skeleton className="h-10 bg-gray-100"/>
                  : 
                    <div className="flex items-center justify-between">
                        <div className='flex items-center'>
                          <FileIcon className='w-8 h-8 text-primary mr-2'/>
                        </div>
                        <p className='text-sm font-medium'>{imageFile.name}</p>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleRemoveImage}>
                            <XIcon className='w-4 h-4'/>
                            <span className='sr-only'>Remove File</span>
                        </Button>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default ImageUpload