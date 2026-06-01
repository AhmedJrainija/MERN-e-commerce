import {Request, Response, NextFunction} from 'express';
import { ApiResponse, ApiVoidResponse } from "../7-types/response/response.api.js";
import { env } from "../1-config/env.js";
import { generateAccessToken, generateRefreshToken } from '../8-utils/token generating.js';
import { AppError } from '../8-utils/custom error class.js';
import { ProductModel} from '../2-models/product.model.js';
import { loginRequest } from '../7-types/request/request body.js';
import  jwt from 'jsonwebtoken';
import { MyJwtPayload } from '../7-types/common/jwt.interface.js';
import { orderParams, ProductParams } from '../7-types/request/request params.js';
import fs from "fs/promises";
import path from "path";
import { ProductDTO } from '../7-types/dto/productDTO.js';
import { addingProduct, updatingProduct } from '../4-services/manageProducts.js';
import { clientModel } from '../2-models/client.model.js';
import mongoose from 'mongoose';
import { FindOrderDTO, populatedOrderDTO } from '../7-types/dto/orderDTO.js';
import { changeOrder, deleteOrder, findAllOrders, findOrder, findOrdersByProduct } from '../4-services/manageOrders.js';
import { orderModel } from '../2-models/order.model.js';
import { v2 as cloudinary } from 'cloudinary';


export const loginAdmin = async (
  req: Request<{}, {},loginRequest>,
  res: Response<ApiVoidResponse>,
  next: NextFunction
): Promise<void> => {

  try {

    const { email, password } = req.body;

    if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
      throw new AppError("Invalid email or password", 401);
    }

    const admin:MyJwtPayload = {
      email: email,
      role: 'admin',
      id:'1'
    };

    const adminAccessToken = generateAccessToken(admin);
    const adminRefreshToken = generateRefreshToken(admin);

    //res.setHeader("Authorization", `Bearer ${adminAccessToken}`);

    //console.log(`Bearer ${adminAccessToken}`);

    res.cookie("accessToken", adminAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    }); 

    res.cookie("refreshToken", adminRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });

  } catch (error) {
    next(error)
  }
}


export const logoutAdmin = async (
req: Request, 
res:Response<ApiVoidResponse>,
  next: NextFunction) => {
  try {
    res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    next(error)
  }
}


export const refreshTokenAdmin = async (
req: Request, 
res:Response<ApiVoidResponse>, 
next: NextFunction) => {
  try {
    const refreshToken:string = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token is missing", 401);
    }

    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

    if (typeof decoded === "string") {
      throw new AppError("Invalid refresh token", 401);
    }

    const user = {
      email: decoded.email,
      role: decoded.role,
      id:'1'
    }

    // Generate new tokens
    const adminAccessToken = generateAccessToken(user);
    const adminRefreshToken = generateRefreshToken(user);

    // ACCESS TOKEN → HEADER
    //res.setHeader("Authorization", `Bearer ${adminAccessToken}`);

    res.cookie("accessToken", adminAccessToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    // REFRESH TOKEN → COOKIE
    res.cookie("refreshToken", adminRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });

  } catch (error) {
    next(error)
  }
}


export const addProduct = async (
  req: Request<{},{},ProductDTO>,
  res: Response<ApiVoidResponse>,
  next: NextFunction
): Promise<void> => {

 try{

  const file =  req.file;

  const data = req.body;

  if(!file) {
    throw new AppError("Image file is required", 400);
  }

  await addingProduct(data, file);

  res.status(201).json({
    success: true,
    message: "Product Added"
  });

 } catch(error){
  next(error)
 }
}


export const deleteProduct = async (
  req: Request<ProductParams>,
  res: Response<ApiVoidResponse>,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { productId } = req.params;

    await clientModel.updateMany(
      { [`cart.${productId}`]: { $exists: true } },
      { $unset: { [`cart.${productId}`]: "" } },
      { session }
    );

    const orders = await orderModel.find(
      { [`content.${productId}`]: { $exists: true } },
      null,
      { session }
    );

    if (orders.length > 0) throw new AppError('Product is in orders', 400);

    const productDeleted: ProductDTO | null = await ProductModel.findByIdAndDelete(productId, { session }).lean();

    if (!productDeleted) {
      throw new AppError("Product not found", 404);
    }

    // Delete image from Cloudinary
    if (productDeleted.pictureName) {
      const publicId = productDeleted.pictureName.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(`harmony/products/${publicId}`).catch(() => {});
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Product deleted"
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
}


export const updateProduct = async (
  req: Request<ProductParams, {}, ProductDTO>,
  res: Response<ApiResponse<ProductDTO>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const data = req.body;
    const file = req.file;

    const product = await ProductModel.findById(productId);

    if (!product) {
      if (file) {
        await cloudinary.uploader.destroy(file.filename).catch(() => {});
      }
      throw new AppError("Product not found", 404);
    }

    const updatedProduct = await updatingProduct(data, product, file);

    res.status(200).json({
      success: true,
      message: "Product updated",
      data: updatedProduct
    });

  } catch (error) {
    next(error);
  }
}


export const showOrders = async (
  req: Request,
  res: Response<ApiResponse<FindOrderDTO>>,
  next: NextFunction
): Promise<void> => {

  try{

  const statusQuery = typeof req.query.status === 'string' ? req.query.status : undefined;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const orders = await findAllOrders(statusQuery, page, limit, skip);

  res.status(200).json({
    success: true,
    message: "Orders retrieved",
    data: orders
  });

  } catch(error) {
    next(error);
  }
}


export const showOrdersByProduct = async (
  req: Request<ProductParams>,
  res: Response<ApiResponse<FindOrderDTO>>,
  next: NextFunction
): Promise<void> => {
  try{
    const statusQuery = typeof req.query.status === 'string' ? req.query.status : undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const {productId} = req.params;

    const orders = await findOrdersByProduct(productId, statusQuery, page , limit, skip);

    res.status(200).json({
      success: true,
      message: "Orders retrieved",
      data: orders
    });

  }catch(error) {
    next(error);
  }
}


export const showOrder = async (
  req: Request<orderParams>,
  res: Response<ApiResponse<populatedOrderDTO>>,
  next: NextFunction
): Promise<void> => {
  try{
    const{orderId} = req.params;

    const order = await findOrder(orderId);

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order
    });
  } catch(error) {
    next(error);
  }
}


export const updateOrder = async (
  req: Request<orderParams>,
  res: Response<ApiVoidResponse>,
  next: NextFunction
): Promise<void> => {

  try{
  const user = req.user;

  const statusQuery = typeof req.query.status === 'string' ? req.query.status : undefined;


  if (!user) {
    throw new AppError("User is not authenticated", 401);
  }

  const{orderId, status} = req.params;

  await changeOrder(orderId, status, statusQuery);

  res.status(200).json({
    success: true,
    message: "Order's status updated successfully"
  });

  } catch(error) {
    next(error);
  }
}


export const removeOrder = async (
  req: Request<orderParams>,
  res: Response<ApiVoidResponse>,
  next: NextFunction
): Promise<void> => {

  try{

  const statusQuery = typeof req.query.status === 'string' ? req.query.status : undefined;

  const{orderId} = req.params;

  await deleteOrder(orderId, statusQuery);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully"
  });

  } catch(error) {
    next(error);
  }
}