import { Schema, model, HydratedDocument } from "mongoose";
import { ProductDTO } from "../7-types/dto/productDTO.js";

export type productsDocument = HydratedDocument<ProductDTO>;

const allowedCategories = ["Electronics", "Accessories", "Beauty", "Garden", "Sports", "Toys", "Books", "Gaming", "Health", "Pet Supplies", "Automotive", "Office Supplies"];


const productsSchema = new Schema<ProductDTO>({

  productName: {type: String, required: [true, 'Product name is required'], unique: [true, 'Product name is already in use'], minlength: [3, 'Product name is too short'], maxlength: [50, 'Product name is too long'], match: [/^[a-zA-Z\s]+$/, 'Product name can only contain letters']},

  category: {type: String, enum: {values: allowedCategories, message:'Invalid category'}, required: [true, 'Category is required']},

  price: {type: Number, required: [true, 'Price is required'], min:[1, 'Price cannot be negative'], set: (v: number) => Math.round(v * 100) / 100 },

  stock: {type: Number, required: [true, 'Stock is required'], min:[0, 'Stock cannot be negative'], validate: {
    validator: Number.isInteger,
    message: 'Stock must be a whole number'
  }},

  description: {type: String, required: [true, 'Description is required'], minlength: [30, 'Description is too short'], maxlength: [300, 'Description is too long']},

  pictureName: {type: String, required: [true, 'Picture Name is required']}
});

export const ProductModel = model<ProductDTO>("Product", productsSchema);