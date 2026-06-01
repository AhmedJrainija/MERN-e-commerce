import { NextFunction, Request, Response } from "express";
import { editAccountReques, loginRequest, registerRequest } from "../7-types/request/request body.js";
import { ApiResponse, ApiVoidResponse } from "../7-types/response/response.api.js";
import { clientModel } from "../2-models/client.model.js";
import { AppError } from "../8-utils/custom error class.js";
import { hashPassword } from "../8-utils/hashing.js";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../8-utils/token generating.js";
import { MyJwtPayload } from "../7-types/common/jwt.interface.js";
import { env } from "../1-config/env.js";
import  jwt  from "jsonwebtoken";
import { orderParams, ProductParams } from "../7-types/request/request params.js";
import { addingToCart, removeItem, updateItem } from "../4-services/manageCart.js";
import { FindProductDTO, ProductDTO } from "../7-types/dto/productDTO.js";
import { loopCart } from "../8-utils/looping cart.js";
import mongoose from "mongoose";
import { ProductModel } from "../2-models/product.model.js";
import { FindOrderDTO, orderDTO, populatedOrderDTO } from "../7-types/dto/orderDTO.js";
import { addOrder,  cancelingOrder,  findOrder,  findOrders } from "../4-services/manageOrders.js";
import { ClientDTO } from "../7-types/dto/clientDTO.js";
import { orderModel } from "../2-models/order.model.js";


export const registerClient = async(
req: Request<{}, {}, registerRequest>, 
res: Response<ApiVoidResponse>, 
next: NextFunction)
:Promise<void>=> {

  try{
    const {email, password, firstName, lastName} = req.body;

    const isRegistered = await clientModel.findOne({ email });

    if(isRegistered) {
      throw new AppError("Email is already in use", 409);
    }

    const hashedPassword = await hashPassword(password);

    await clientModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName
    })

    res.status(200).json({
      success: true,
      message: "Client registered successfully",
    });

  } catch(error) {
    next(error);
  }
}


export const loginClient = async(
req: Request<{},{},loginRequest>, 
res: Response<ApiResponse<number>>, 
next: NextFunction)
:Promise<void>=> {

  try{
    const {email, password} = req.body;

    const registeredClient = await clientModel.findOne({email}).lean();

    if (!registeredClient) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, registeredClient.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const client:MyJwtPayload = {
      email: registeredClient.email,
      role: 'client',
      id: `${registeredClient._id}`
    }

    const clientAccessToken = generateAccessToken(client);
    const clientRefreshToken = generateRefreshToken(client);

    //res.setHeader("Authorization", `Bearer ${clientAccessToken}`);

    //console.log(`Bearer ${clientAccessToken}`);

    res.cookie("accessToken", clientAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 60 * 1000,
    });

    res.cookie("refreshToken", clientRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const cart = registeredClient.cart;

    let numberOfItems = 0;
    for (const [key, value] of Object.entries(cart)) {
      numberOfItems = numberOfItems + value;
    }

    res.status(200).json({
      success: true,
      message: `Welcome ${registeredClient.firstName} ${registeredClient.lastName}`,
      data: numberOfItems
    });

  } catch(error) {
    next(error);
  }
}


export const refreshTokenClient = async (
req: Request, 
res:Response<ApiVoidResponse>, 
next: NextFunction) => {
  try {
    const refreshToken: string = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token is missing", 401);
    }

    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

    if (typeof decoded === "string") {
      throw new AppError("Invalid or malformed refresh token", 401);
    }

    const user: MyJwtPayload = {
      email: decoded.email,
      role: decoded.role,
      id: decoded.id
    }

    // Generate new tokens
    const clientAccessToken = generateAccessToken(user);
    const clientRefreshToken = generateRefreshToken(user);

    // ACCESS TOKEN → HEADER
    //res.setHeader("Authorization", `Bearer ${adminAccessToken}`);

    res.cookie("accessToken", clientAccessToken, {
      httpOnly: true,
      secure: true,       // ← was false
      sameSite: "none",   // ← was "strict"
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", clientRefreshToken, {
      httpOnly: true,
      secure: true,       // ← was false
      sameSite: "none",   // ← was "strict"
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


export const logoutClient = async (
req:Request, 
res:Response<ApiVoidResponse>,
next: NextFunction) => {
  try {
    res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
      success: true,
      message: "Logged out",
    });

  } catch (error) {
    next(error)
  }
}


export const getAccount = async (
req:Request, 
res:Response<ApiResponse<ClientDTO>>,
next: NextFunction) => {
  try{
    const user = req.user;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const client = await clientModel.findById(user.id).select('-password -cart').lean();

    if(!client) {
      throw new AppError("Client does not exist", 404);
    }

    res.status(200).json({
      success: true,
      message: "Account Info Retrieved",
      data: client
    });

  }catch (error) {
    next(error);
  }
}


export const editAccount = async (
req:Request<{}, {}, editAccountReques>, 
res:Response<ApiVoidResponse>,
next: NextFunction) => {
  try{
    const user = req.user;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const client = await clientModel.findById(user.id).lean();

    if (!client) {
      throw new AppError("Client is not Found", 404);
    }

    const {firstName, lastName, password, newPassword, email, confirmPassword} = req.body;

    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      throw new AppError("Invalid Password", 401);
    }

    const hashedPassword = await hashPassword(password);
    
    const updateData: registerRequest = {
      firstName,
      lastName,
      email,
      password: hashedPassword
    }

    if(newPassword && confirmPassword){
      if (newPassword !== confirmPassword) {
        throw new AppError("Passwords do not match", 400);
      }

      if(password === newPassword) {
        throw new AppError("New password must be different from your current password", 400);
      }
      updateData.password = await hashPassword(newPassword);
    }

    const updatedClient = await clientModel.findByIdAndUpdate(user.id,
      updateData,
      { runValidators: true }
    ).lean();

    if(!updatedClient) throw new AppError("Unable to update account", 500);

    res.status(200).json({
      success: true,
      message: "Account Updated Successfully",
    });

  } catch(error){
    next(error);
  }
}


export const deleteAccount = async (
req:Request, 
res:Response<ApiVoidResponse>,
next: NextFunction) => {

  try{
    const user = req.user;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const client = await clientModel.findByIdAndDelete(user.id);

    if(!client) {
      throw new AppError("Client does not exist", 404);
    }

    res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
      success: true,
      message: "Account Deleted",
    });

  } catch(error) {
    next(error);
  }
}


export const findProducts = async (
  req: Request,
  res: Response<ApiResponse<FindProductDTO>>,
  next: NextFunction
): Promise<void> => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = category ? { category } : {};

    const [totalProducts, products] = await Promise.all([
      ProductModel.countDocuments(filter),
      ProductModel.find(filter).skip(skip).limit(limit).lean()
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: {
        products,
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};


export const findProduct = async (
  req: Request<ProductParams>,
  res: Response<ApiResponse<ProductDTO & {inOrders: boolean}>>,
  next: NextFunction
): Promise<void> => {

  try{

    const {productId} = req.params;

    const result = await ProductModel.findById(productId).lean();

    if(!result) {
      throw new AppError("Product not found", 404);
    }

    const orders = await orderModel.find({
      [`content.${productId}`]: { $exists: true }
    });

    const inOrders = orders.length > 0;

    const product = {...result, inOrders};

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product
    });

  } catch(error) {
    next(error)
  }
}


export const addToCart = async (
  req: Request<ProductParams>,
  res: Response<ApiResponse<ProductDTO[]>>,
  next: NextFunction) => {

  try {
    const user = req.user;
    const  productId = req.params.productId;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const fullCart = await addingToCart(user.id, productId, 1);

    res.status(200).json({
      success: true,
      message: "Item added to the cart",
      data: fullCart
    });

  } catch (error) {
    next(error);
  }
}


export const findCart = async (
req: Request<ProductParams>,
res: Response<ApiResponse<ProductDTO[]>>,
next: NextFunction) => {

  try{
    const user = req.user;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const client = await clientModel.findById(user.id);

    if (!client) {
      throw new AppError("Client does not exist", 404);
    }

    const cart = client.cart;

    const fullCart = await loopCart(cart);

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",   //Cart is empty message in frontend
      data: fullCart 
    });

  } catch (error) {
    next(error);
  }
}


export const itemUpdate = (update: number) => {
  return async (
  req: Request<ProductParams>,
  res: Response<ApiResponse<ProductDTO[]>>,
  next: NextFunction) => {

  try {
    const user = req.user;
    const  productId = req.params.productId;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const fullCart = await updateItem(user.id, productId, update);

    res.status(200).json({
      success: true,
      message: "Item updated succesfully",
      data: fullCart
    });

  } catch (error) {
    next(error);
  }
}
} 


export const deleteItem = async (
req: Request<ProductParams>,
res: Response<ApiResponse<ProductDTO[]>>,
next: NextFunction) => {

  try{

    const user = req.user;
    const  productId = req.params.productId;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const fullCart = await removeItem(user.id, productId);

    res.status(200).json({
      success: true,
      message: "Item deleted from cart succesfully",
      data: fullCart
    });

  } catch(error) {
    next(error);
  }
}


export const sendOrder = async (
req: Request<{},{}, orderDTO>,
res: Response<ApiVoidResponse>,
next: NextFunction) => {

  try{
    const user = req.user;

    const data = req.body;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const orders = await addOrder(user.id, data);

    res.status(200).json({
      success: true,
      message: "Order sent"
    });

  } catch (error) {
    next(error);
  }
}


export const showOrders = async (
req: Request,
res: Response<ApiResponse<FindOrderDTO>>,
next: NextFunction) => {
  try {

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const user = req.user;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const orders = await findOrders(user.id, skip, limit, page);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders
    });

  } catch (error) {
    next(error);
  }
}


export const showOrder = async (
req: Request<orderParams>,
res: Response<ApiResponse<populatedOrderDTO>>,
next: NextFunction) => {

  try{
    const user = req.user;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const{orderId} = req.params;

    const order = await findOrder(orderId);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });

  } catch(error){
    next(error);
  }
}


export const cancelOrder = async (
req: Request<orderParams>,
res: Response<ApiVoidResponse>,
next: NextFunction) => {

  try{
    const user = req.user;

    if (!user) {
      throw new AppError("Client is not authenticated", 401);
    }

    const{orderId} = req.params;

    const orders = await cancelingOrder(orderId, user.id)

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });

  } catch(error){
    next(error);
  }
}