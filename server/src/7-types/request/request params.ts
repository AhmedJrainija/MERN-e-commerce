import { ParamsDictionary } from 'express-serve-static-core';

export interface ProductParams extends ParamsDictionary {
  productId: string;
}

export interface orderParams extends ParamsDictionary {
  orderId: string,
  status: string
}