import { Router } from "express";
import { addProduct, deleteProduct, loginAdmin, logoutAdmin, refreshTokenAdmin, removeOrder, showOrder, showOrders, showOrdersByProduct, updateOrder, updateProduct } from "../3-controllers/admin.controller.js";
import { isUserLoggedIn } from "../6-middlewares/authentication.js";
import { authorizedUsers } from "../6-middlewares/authorization.js";
import { upload } from "../6-middlewares/multer.js";
import { findProduct, findProducts } from "../3-controllers/client.controller.js";


const adminRouter = Router();


//Admin login:
adminRouter.post('/login', loginAdmin);

//Admin refresh token:
adminRouter.get('/refreshToken', refreshTokenAdmin);

//Admin logout:
adminRouter.get('/logout', isUserLoggedIn, authorizedUsers('admin'), logoutAdmin);

//Show products:
adminRouter.get('/products',isUserLoggedIn, authorizedUsers('admin'), findProducts);

//Show product:
adminRouter.get('/product/:productId',isUserLoggedIn, authorizedUsers('admin'), findProduct);

//Add product:
adminRouter.post('/add',isUserLoggedIn, authorizedUsers('admin'), upload.single('file'), addProduct);

//Update product:
adminRouter.patch('/product/:productId',isUserLoggedIn, authorizedUsers('admin'), upload.single('file'), updateProduct);

//Delete product:
adminRouter.delete('/product/:productId',isUserLoggedIn, authorizedUsers('admin'), deleteProduct);

//Show orders:
adminRouter.get('/orders',isUserLoggedIn, authorizedUsers('admin'), showOrders);

//Show orders by productId:
adminRouter.get('/product/:productId/orders',isUserLoggedIn, authorizedUsers('admin'), showOrdersByProduct);

//Show order:
adminRouter.get('/orders/:orderId',isUserLoggedIn, authorizedUsers('admin'), showOrder);

//Update order status:
adminRouter.patch('/orders/:orderId/status/:status',isUserLoggedIn, authorizedUsers('admin'), updateOrder);

//Delete order:
adminRouter.delete('/orders/:orderId',isUserLoggedIn, authorizedUsers('admin'), removeOrder);




export default adminRouter;