import { Schema, model, HydratedDocument } from "mongoose";
import { ClientDTO } from "../7-types/dto/clientDTO.js";

const clientSchema = new Schema<ClientDTO>({

  email: { type: String, required: [true, 'Email is required'], unique: [true, 'Email address is already in use'] , match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, 'Please enter a valid email address']},

  password: { type: String, required: [true, 'Password is required'], minlength:[8, 'Password is too short']},

  firstName: {type: String, required: [true, 'First name is required'], minlength:[3, 'First name is too short'] , maxlength:[50, 'First name is too long'], match: [/^[a-zA-Z\s]+$/, 'First name can only contain letters']},

  lastName: {type: String, required: [true, 'Last name is required'], minlength:[3, 'Last name is too short'] , maxlength:[50, 'Last name is too long'],match: [/^[a-zA-Z\s]+$/, 'Last name can only contain letters']},

  cart: {
    type: Map,
    of: Number,
    default: {}
  }
})
export type clientDocument = HydratedDocument<ClientDTO>;

export const clientModel = model<ClientDTO>("Client", clientSchema);