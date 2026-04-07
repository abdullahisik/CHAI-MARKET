export type ProductVariant = {
  size: string;
  unitPrice: string;
  discountPrice?: string;
  boxQty: number;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  variants: ProductVariant[];
};

export const products: Product[] = [
  {
    slug: "red-lentil-split",
    name: "Red Lentil Split",
    category: "Bakliyat",
    subCategory: "Pulses",
    description: "High quality red lentil split for wholesale and retail customers.",
    variants: [
      {
        size: "1kg",
        unitPrice: "2.99",
        discountPrice: "",
        boxQty: 8,
        image: "/products/RED LENTIL SPLIT 1KG.jpg",
      },
      {
        size: "2kg",
        unitPrice: "5.49",
        discountPrice: "",
        boxQty: 8,
        image: "/products/RED LENTIL SPLIT 2KG.jpg",
      },
      {
        size: "4kg",
        unitPrice: "10.49",
        discountPrice: "",
        boxQty: 4,
        image: "/products/RED LENTIL SPLIT 4KG.jpg",
      },
    ],
  },
  {
    slug: "red-lentil-whole",
    name: "Red Lentil Whole",
    category: "Bakliyat",
    subCategory: "Pulses",
    description: "Premium whole red lentils with fast UK delivery.",
    variants: [
      {
        size: "1kg",
        unitPrice: "2.99",
        discountPrice: "",
        boxQty: 8,
        image: "/products/RED LENTIL WHOLE.jpg",
      },
      {
        size: "2kg",
        unitPrice: "5.59",
        discountPrice: "",
        boxQty: 8,
        image: "/products/RED LENTIL WHOLE 2KG.jpg",
      },
      {
        size: "4kg",
        unitPrice: "10.99",
        discountPrice: "",
        boxQty: 4,
        image: "/products/RED LENTIL WHOLE 4KG.jpg",
      },
    ],
  },
  {
    slug: "chickpeas-jumbo",
    name: "Chickpeas Jumbo",
    category: "Bakliyat",
    subCategory: "Pulses",
    description: "Large jumbo chickpeas suitable for retail and wholesale.",
    variants: [
      {
        size: "1kg",
        unitPrice: "3.49",
        discountPrice: "",
        boxQty: 8,
        image: "/products/JUMBO CHICKPEA.jpg",
      },
      {
        size: "2kg",
        unitPrice: "6.69",
        discountPrice: "",
        boxQty: 8,
        image: "/products/CHICKPEAS JUMBO 2KG.jpg",
      },
      {
        size: "4kg",
        unitPrice: "12.99",
        discountPrice: "",
        boxQty: 4,
        image: "/products/JUMBO CHICKPEA 4KG.jpg",
      },
    ],
  },
  {
    slug: "basmati-rice",
    name: "Basmati Rice",
    category: "Bakliyat",
    subCategory: "Rice",
    description: "Quality basmati rice in multiple size options.",
    variants: [
      {
        size: "1kg",
        unitPrice: "3.99",
        discountPrice: "",
        boxQty: 8,
        image: "/products/BASMATI RICE 1KG.jpg",
      },
      {
        size: "2kg",
        unitPrice: "7.59",
        discountPrice: "",
        boxQty: 8,
        image: "/products/BASMATI RICE 2KG.jpg",
      },
    ],
  },
];