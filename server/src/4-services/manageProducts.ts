import { v2 as cloudinary } from 'cloudinary';
import { AppError } from "../8-utils/custom error class.js";
import { ProductModel, productsDocument } from "../2-models/product.model.js";
import { ProductDTO } from "../7-types/dto/productDTO.js";

export const addingProduct = async (data: ProductDTO, file: Express.Multer.File) => {
  const { productName, price, stock, description, category } = data;

  try {
    const existingProduct: productsDocument | null = await ProductModel.findOne({ productName });

    if (existingProduct) {
      await cloudinary.uploader.destroy(file.filename);
      throw new AppError("Product name is already in use", 409);
    }

    const newProduct: productsDocument = await ProductModel.create({
      productName,
      price,
      stock,
      description,
      category,
      pictureName: file.path // Cloudinary URL
    });

    return newProduct;

  } catch (error) {
    throw error;
  }
};

export const updatingProduct = async (data: ProductDTO, product: productsDocument, file?: Express.Multer.File): Promise<ProductDTO> => {
  const { productName, price, stock, description, category } = data;

  const updateData: ProductDTO = {
    productName,
    price,
    stock,
    description,
    category,
    pictureName: product.pictureName
  };

  if (file) {
    updateData.pictureName = file.path; // Cloudinary URL
  }

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      product._id,
      updateData,
      { runValidators: true }
    ).lean();

    if (!updatedProduct) {
      if (file) {
        await cloudinary.uploader.destroy(file.filename);
      }
      throw new AppError("Unable to update product", 500);
    }

    // Delete old image from Cloudinary after successful update
    if (file && product.pictureName) {
      const publicId = product.pictureName.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(`harmony/products/${publicId}`).catch(() => {});
    }

    return updatedProduct;

  } catch (err) {
    if (file) {
      await cloudinary.uploader.destroy(file.filename).catch(() => {});
    }
    throw err;
  }
};