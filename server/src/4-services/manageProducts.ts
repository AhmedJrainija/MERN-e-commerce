import fs from "fs/promises";
import path from "path";
import { AppError } from "../8-utils/custom error class.js";
import { ProductModel, productsDocument } from "../2-models/product.model.js";
import { ProductDTO } from "../7-types/dto/productDTO.js";


export const addingProduct = async (data: ProductDTO, file: Express.Multer.File)=> {

  const {productName, price, stock, description, category} = data;

  const deleteUploadedFile = async () => {
    const fullPath = path.join(process.cwd(), "public", "products", file.filename);
    await fs.unlink(fullPath).catch(() => {});
  };

  try{

    const existingProduct: productsDocument | null = await ProductModel.findOne({ productName });

    if(existingProduct) {
      throw new AppError("Product name is already in use", 409);
    }

    const newProduct: productsDocument = await ProductModel.create({
      productName: productName, //name of the product
      price: price,
      stock: stock,
      description: description,
      category: category,
      pictureName: `${file.filename}` //name of the pic in the folder
    })

    return newProduct;

  } catch(error) {

    await deleteUploadedFile();

    throw error;
  }
}


export const updatingProduct = async (data: ProductDTO, product: productsDocument, file?: Express.Multer.File): Promise<ProductDTO> => {

  const { productName, price, stock, description, category } = data;

  //Prepare update
  const updateData: ProductDTO = {
    productName,
    price: price,
    stock: stock,
    description,
    category,
    pictureName: product.pictureName
  };

  let oldPath: string | null = null;

  if (file) {
    oldPath = path.join(process.cwd(), "public", "products", product.pictureName); //Make the oldPath as the path of the old pic

    updateData.pictureName = file.filename;
  }

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      product._id,
      updateData,
      { runValidators: true }
    ).lean();

    if (!updatedProduct) {
      if (file) {
        const newPath = path.join(process.cwd(), "public", "products", file.filename);
        await fs.unlink(newPath).catch(() => {});
      }
      throw new AppError("Unable to update product", 500);
    }

    // 3. Delete old image ONLY after success
    if (oldPath) {
      await fs.unlink(oldPath).catch(() => {});
    }

    return updatedProduct;

  } catch (err) {
    if (file) {
      const newPath = path.join(process.cwd(), "public", "products", file.filename);
      await fs.unlink(newPath).catch(() => {});
    }
    throw err;
  }
};