import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { CardFooter } from '@/components/ui/card';
import { Button } from "../ui/button";
import { brandOptionMap, categoryOptionMap } from "@/config";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  return (
    <Card className="w-full max-w-sm mx-auto hover:cursor-pointer">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {
            product?.totalstock === 0 ?
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                Out of Stock
              </Badge>
            : product?.totalstock <= 10 && product?.totalstock > 0 ? 
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                 {`Only ${product?.totalstock} items left`}
              </Badge> 
            :
            null
          }
          {
            product?.saleprice > 0 ? 
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
            : null
          }
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.saleprice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.saleprice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.saleprice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {
          product?.totalstock === 0 ?
          <Button className="w-full opacity-60 cursor-not-allowed">Out of Stock</Button>
          : 
          <Button className="w-full" onClick={() => handleAddtoCart(product._id, product?.totalstock)}>Add to Cart</Button>
        }
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
