import { Router } from "express";
import { addToCart, cancelOrder, deleteAccount, deleteItem, editAccount, findCart, findProduct, findProducts, getAccount, itemUpdate, loginClient, logoutClient, refreshTokenClient, registerClient, sendOrder, showOrder, showOrders} from "../3-controllers/client.controller.js";
import { isUserLoggedIn } from "../6-middlewares/authentication.js";
import { authorizedUsers } from "../6-middlewares/authorization.js";

const clientRouter = Router();


//Client register:
clientRouter.post('/register', registerClient);

//Client login:
clientRouter.post('/login',loginClient);

//Client profile:
clientRouter.get('/profile', isUserLoggedIn, authorizedUsers('client'), getAccount);

//Client update account:
clientRouter.patch('/profile', isUserLoggedIn, authorizedUsers('client'), editAccount);

//Delete client account:
clientRouter.delete('/profile', isUserLoggedIn, authorizedUsers('client'), deleteAccount);

//Client logout:
clientRouter.get('/logout', isUserLoggedIn, authorizedUsers('client'), logoutClient);

//Client refresh token:
clientRouter.get('/refreshToken', refreshTokenClient);

//Add a product to cart from the main page:
clientRouter.post('/add/:productId', isUserLoggedIn, authorizedUsers('client'), addToCart);

//Show a product:
clientRouter.get('/product/:productId', findProduct);

//Add a product to cart from product page:
clientRouter.post('/product/:productId', isUserLoggedIn, authorizedUsers('client'), addToCart);

//Show client's cart:
clientRouter.get('/cart', isUserLoggedIn, authorizedUsers('client'), findCart);

//Add quantity of a product in the cart:
clientRouter.patch('/cart/:productId/add', isUserLoggedIn, authorizedUsers('client'), itemUpdate(1));

//Substract quantity of a product in the cart:
clientRouter.patch('/cart/:productId/substract', isUserLoggedIn, authorizedUsers('client'), itemUpdate(-1));

//Delete an item from cart:
clientRouter.delete('/cart/:productId', isUserLoggedIn, authorizedUsers('client'), deleteItem);

//Send order:
clientRouter.post('/cart/order', isUserLoggedIn, authorizedUsers('client'), sendOrder);

//Show client's orders:
clientRouter.get('/orders', isUserLoggedIn, authorizedUsers('client'), showOrders);

//Show client's order:
clientRouter.get('/orders/:orderId', isUserLoggedIn, authorizedUsers('client'), showOrder);

//Cancel an order:
clientRouter.delete('/orders/:orderId', isUserLoggedIn, authorizedUsers('client'), cancelOrder);



export default clientRouter;