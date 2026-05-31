import mongoose from "mongoose";
import { FindOrderDTO, orderDTO, populatedOrderDTO } from "../7-types/dto/orderDTO.js";
import { clientModel } from "../2-models/client.model.js";
import { AppError } from "../8-utils/custom error class.js";
import { orderModel } from "../2-models/order.model.js";
import { ProductModel } from "../2-models/product.model.js";
import { loopCart } from "../8-utils/looping cart.js";
import { calculateTotal } from "../8-utils/total cart.js";


export const addOrder = async (clientId: string, data: orderDTO): Promise<void> => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { firstName, lastName, email, phoneNumber, city, address } = data;

    const client = await clientModel.findById(clientId).session(session);

    if (!client) {
      throw new AppError("Client does not exist", 404);
    }

    const cart = client.cart;

    const populatedCart = await loopCart(cart);

    populatedCart.forEach(item => {
      if (!item.quantity || item.quantity < 1) {
        throw new AppError(`Invalid quantity for ${item.productName}`, 400);
      }
      if (item.quantity > item.stock) {
        throw new AppError(
          `${item.productName}: only ${item.stock} left in stock`,
          400
        );
      }
    });

    for (const [key, value] of cart.entries()) {
      await ProductModel.findByIdAndUpdate(
        key,
        { $inc: { stock: -value }},
        { session }
      );
    }

    const total = calculateTotal(populatedCart);

    await orderModel.create([{
      customerId: client._id,
      firstName,
      lastName,
      email,
      phoneNumber,
      city,
      address,
      content: cart,
      total,
    }], { session });

    await clientModel.findByIdAndUpdate(clientId, { $set: { cart: [] } }, { session });

    await session.commitTransaction();

  } catch (error) {
    await session.abortTransaction();
    throw error;

  } finally {
    session.endSession();
  }
};


export const findAllOrders = async(statusQuery: string | undefined, page: number, limit: number, skip: number): Promise<FindOrderDTO> => {
  try{

    const filter = statusQuery ? { status: statusQuery } : {};

    const [totalOrders, orders] = await Promise.all([
      orderModel.countDocuments(filter),
      orderModel.find(filter).skip(skip).limit(limit)
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    const populatedOrders = await Promise.all(
      orders.map(async (order) => ({
        ...order.toObject(),
        content: await loopCart(order.content)
      })) 
    )
    return {
      populatedOrders,
      page,
      limit,
      totalOrders,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  } catch(error) {
    throw error;
  }
}


export const findOrdersByProduct = async(productId: string, statusQuery: string | undefined, page: number, limit: number, skip: number): Promise<FindOrderDTO> => {
  try{

    const filter = {
      ...(statusQuery && { status: statusQuery }),
      [`content.${productId}`]: { $exists: true },
    };

    const [totalOrders, orders] = await Promise.all([
      orderModel.countDocuments(filter),
      orderModel.find(filter).skip(skip).limit(limit)
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    const populatedOrders = await Promise.all(
      orders.map(async (order) => ({
        ...order.toObject(),
        content: await loopCart(order.content)
      })) 
    )
    return {
      populatedOrders,
      page,
      limit,
      totalOrders,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }

  } catch(error) {
    throw error;
  }
}


export const findOrders = async(clientId: string, skip: number, limit: number, page: number): Promise<FindOrderDTO> => {
  try{
    const [totalOrders, orders] = await Promise.all([
      orderModel.countDocuments(),
      orderModel.find({customerId: clientId, status: {$ne: 'Cancelled'}}).skip(skip).limit(limit)
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    const populatedOrders = await Promise.all(
      orders.map(async (order) => ({
        ...order.toObject(),
        content: await loopCart(order.content)
      })) 
    )

    return {
      populatedOrders,
      page,
      limit,
      totalOrders,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }

  } catch(error) {
    throw error
  }
}


export const findOrder = async(orderId: string): Promise<populatedOrderDTO> => {
  try{
    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new AppError("Order does not exist", 404);
    }

    const populatedOrder = {...order.toObject() , content: await loopCart(order.content)};

    return populatedOrder;

  } catch(error) {
    throw error
  }
}


export const cancelingOrder = async (orderId: string, clientId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await orderModel.findByIdAndUpdate(orderId, {$set: {status: "Cancelled"}});

    if (!order) {
      throw new AppError("Order does not exist", 404);
    }

    const content = order.content;

    for (const [key, value] of content.entries()) {
      await ProductModel.findByIdAndUpdate(key, { $inc: { stock: +value } }, { session });
    }

    await session.commitTransaction();

  } catch(error) {
    await session.abortTransaction();
    throw error;

  } finally {
    session.endSession();
  }
}


export const changeOrder = async(orderId: string, statusUpdate: string, statusQuery: string| undefined): Promise<void>=> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    const order = await orderModel.findByIdAndUpdate(orderId, {$set: {status: statusUpdate}});

    if (!order) {
      throw new AppError("Order does not exist", 404);
    }

    await session.commitTransaction();

  } catch(error) {
    await session.abortTransaction();
    throw error

  } finally {
    session.endSession();
  }
}


export const deleteOrder = async (orderId: string, statusQuery: string | undefined): Promise<void> => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await orderModel.findByIdAndDelete(orderId).session(session);

    if (!order) {
      throw new AppError("Order does not exist", 404);
    }

    if (order.status !== 'Cancelled' && order.status !== 'Delivered') {
      throw new AppError("Can't delete an order that isn't cancelled or delivered", 400);
    }

    await session.commitTransaction();

  } catch (error) {
    await session.abortTransaction();
    throw error;

  } finally {
    session.endSession();
  }
};