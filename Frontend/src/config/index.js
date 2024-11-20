
export const registerFormControl = [
  {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter Your Username',
    type: 'text',
    componentType: 'input'
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter Your Email',
    type: 'email',
    componentType: 'input'
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter Your Password',
    type: 'password',
    componentType: 'input'
  }
]

export const loginFormControl = [
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter Your Email',
    type: 'email',
    componentType: 'input'
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter Your Password',
    type: 'password',
    componentType: 'input'
  }
]

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter Product Title"
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter Product Description"
  },
  {
    label: "Category",
    name: 'category',
    componentType: 'select',
    options: [
      { id: 'men', label: "Men" },
      { id: 'women', label: "Women" },
      { id: 'kids', label: "Kids" },
      { id: 'accessories', label: "Accessories" },
      { id: 'footwear', label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: 'nike', label: "Nike" },
      { id: 'adidas', label: "Adidas" },
      { id: 'puma', label: "Puma" },
      { id: 'levi', label: "Levi's" },
      { id: 'zara', label: "Zara" },
      { id: 'h&m', label: "H&M" },
    ]
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter Product Price"
  },
  {
    label: "Sale Price",
    name: "saleprice",
    componentType: "input",
    type: "number",
    placeholder: "Enter Sale Price (Optional)"
  },
  {
    label: "Total Stock",
    name: "totalstock",
    componentType: "input",
    type: "number",
    placeholder: "Enter Total Stock"
  },
]

export const shoppingViewHeaderMenuItems = [
  {
    id: 'home',
    label: "Home",
    path: "/shop/home"
  },
  {
    id: 'products',
    label: "Products",
    path: "/shop/listing"
  },
  {
    id: 'men',
    label: "Men",
    path: "/shop/listing"
  },
  {
    id: 'women',
    label: "Women",
    path: "/shop/listing"
  },
  {
    id: 'kids',
    label: "Kids",
    path: "/shop/listing"
  },
  {
    id: 'footwear',
    label: "Footwear",
    path: "/shop/listing"
  },
  {
    id: 'accessories',
    label: "Accessories",
    path: "/shop/listing"
  },
  {
    id: 'search',
    label: "Search",
    path: "/shop/search"
  }
]

export const filterOptions = {
   category : [
     { id: 'men', label: "Men" },
     { id: 'women', label: "Women" },
     { id: 'kids', label: "Kids" },
     { id: 'accessories', label: "Accessories" },
     { id: 'footwear', label: "Footwear" },
   ],
   brand : [
     { id: 'nike', label: "Nike" },
     { id: 'adidas', label: "Adidas" },
     { id: 'puma', label: "Puma" },
     { id: 'levi', label: "Levi's" },
     { id: 'zara', label: "Zara" },
     { id: 'h&m', label: "H&M" },
   ]
}

export const filterOptionsMap = {
  'category' : 'Category',
  'brand' : 'Brand'
}

export const sortOptions = [
   {id: 'price-lowtohigh', label: "Price: Low to High"},
   {id: 'price-hightolow', label: "Price: High to Low"},
   {id: 'title-atoz', label: "Title: A to Z"},
   {id: 'title-ztoa', label: "Title: Z to A"},
]

export const brandOptionMap = {
  'nike' : 'Nike',
  'adidas' : 'Adidas',
  'puma' : 'Puma',
  'levi' : 'Levi\'s',
  'zara' : 'Zara',
  'h&m' : 'H&M'
}

export const categoryOptionMap = {
  'men' : 'Men',
  'women' : 'Women',
  'kids' : 'Kids',
  'accessories' : 'Accessories',
  'footwear' : 'Footwear'
}

export const addressFormControls = [
  {
    label: "Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter Your Name",
  },
  {
    label: "Mobile Number",
    name: "mobile",
    componentType: "input",
    type: "number",
    placeholder: "Enter Your Mobile Number",
  },
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter Your Address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter Your City",
  },
  {
    label: "State",
    name: "state",
    componentType: "input",
    type: "text",
    placeholder: "Enter Your State",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "number",
    placeholder: "Enter Your Pincode",
  },
  {
    label: "Landmark (Optional)",
    name: "landmark",
    componentType: "textarea",
    placeholder: "Enter Any Landmark (Optional)",
  },
]

export const adminOrderStatus = [
  {
    label: "Update Order Status",
    name: 'status',
    componentType: 'select',
    options: [
      { id: 'pending', label: "Pending" },
      { id: 'confirmed', label: "Confirmed"},
      { id: 'processing', label: "Processing" },
      { id: 'shipped', label: "Shipped" },
      { id: 'rejected', label: "Rejected" },
      { id: 'delivered', label: "Delivered" },
      { id: 'cancelled', label: "Cancelled" },
    ],
  }
]