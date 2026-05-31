import mongoose, { HydratedDocument, model, Schema } from "mongoose";
import { orderDTO } from "../7-types/dto/orderDTO.js";

const Status = ["Pending" , "Confirmed" , "Shipped" , "Delivered" , "Cancelled"];

const orderSchema = new Schema<orderDTO>({

  customerId: {type: mongoose.Schema.Types.ObjectId, ref: "Client", required: [true, 'Customer ID is required']},

  firstName: {type: String, required: [true, 'First name is required'], minlength:[3, 'First name is too short'] , maxlength:[50, 'First name is too long'],match: [/^[a-zA-Z\s]+$/, 'First name can only contain letters'] },

  lastName: {type: String, required: [true, 'Last name is required'], minlength:[3, 'Last name is too short'] , maxlength:[50, 'Last name is too long'], match: [/^[a-zA-Z\s]+$/, 'Last name can only contain letters'] },

  email: {type: String, required: [true, 'Email is required'], match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, 'Please enter a valid email address']},

  phoneNumber: {type: String, required: [true, 'Phone number is required'], match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']},

  city: {type: String, required: [true, 'City is required'], minlength:[3, 'City name is too short'] , maxlength:[50, 'City name is too long'], match: [/^[a-zA-Z\s]+$/, 'City can only contain letters']},

  address: {type: String, required: [true, 'Address is required'], minlength: [10, 'Address is too short']},

  date: {type: Date, default: Date.now},

  status: {type: String, enum: {values: Status, message: 'Invalid status'}, default: "Pending"},

  content: {
    type: Map,
    of: Number
  , required: true},

  total:{type: Number, required: [true, 'Cart total is required'], min:[0, 'Cart total cannot be negative']}
})

export type orderDocument = HydratedDocument<orderDTO>;

export const orderModel = model<orderDTO>("Order", orderSchema);