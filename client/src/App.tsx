import { Outlet, Route, Routes } from "react-router-dom"
import { SideBar } from "./4-components/2-sidebar/sidebar";
import { NotFound } from "./4-components/7-not found component/not found";
import { LoginPage } from "./5-pages/login page/login";
import { Register } from "./5-pages/client/register page/register";
import { Home } from "./5-pages/home page/home";
import { AuthProtection } from "./4-components/protected component";
import { AddProduct } from "./5-pages/admin/add product page/add product";
import { ProductsAdmin } from "./5-pages/admin/admin products page/products";
import { EditProduct } from "./5-pages/admin/edit product page/edit product";
import { AllOrdersPage } from "./5-pages/admin/admin orders page/all orders";
import { ProductPage } from "./5-pages/product page/product";
import { Cart } from "./5-pages/client/cart page/cart";
import { SendOrder } from "./5-pages/client/send order page/send order";
import { OrdersPage } from "./5-pages/client/client orders page/orders";
import './index.css';
import { OrderPage } from "./5-pages/admin/admin order page/admin order";
import { ClientOrderPage } from "./5-pages/client/client order page/client order page";
import { OrdersByProduct } from "./5-pages/admin/product orders page/product orders";
import { Profile } from "./5-pages/client/profile page/profile page";

function Side() {
  return (
    <>
      <SideBar />
      <main style={{marginLeft: '250px' }}>
        <Outlet />
      </main>
    </>
  )
}

function App() {
  return(
    <Routes>

      <Route element={<Side/>}>

          <Route path="/404" element={<NotFound></NotFound>}></Route>

          <Route path="/" element={<Home></Home>}></Route>

          <Route path="/admin/login" element={<LoginPage role='Admin'/>}></Route>

          <Route path="/login" element={<LoginPage role='Client'/>}></Route>

          <Route path="/register" element={<Register/>}></Route>

          <Route path="/admin/add" element={ <AuthProtection path="/admin/login" userRole="Admin"> <AddProduct/></AuthProtection> }></Route>
          <Route path="/admin/products" element={ <AuthProtection path="/admin/login" userRole="Admin"> <ProductsAdmin/></AuthProtection> }></Route>
          <Route path="/admin/product/:productId" element={ <AuthProtection path="/admin/login" userRole="Admin"> <EditProduct/></AuthProtection> }></Route>
          <Route path="/admin/orders" element={ <AuthProtection path="/admin/login" userRole="Admin"> <AllOrdersPage/></AuthProtection> }></Route>
          <Route path="/admin/product/:productId/orders" element={ <AuthProtection path="/admin/login" userRole="Admin"> <OrdersByProduct/></AuthProtection> }></Route>
          <Route path="/admin/orders/:orderId" element={ <AuthProtection path="/admin/login" userRole="Admin"> <OrderPage/></AuthProtection> }></Route>

          <Route path="/product/:productId" element={<ProductPage></ProductPage>}></Route>
          <Route path="/cart" element={<AuthProtection path="/login" userRole="Client"><Cart></Cart></AuthProtection>}></Route>
          <Route path="/cart/order" element={<AuthProtection path="/login" userRole="Client"><SendOrder></SendOrder></AuthProtection>}></Route>
          <Route path="/orders" element={<AuthProtection path="/login" userRole="Client"><OrdersPage></OrdersPage></AuthProtection>}></Route>
          <Route path="/orders/:orderId" element={<AuthProtection path="/login" userRole="Client"><ClientOrderPage/></AuthProtection>}></Route>
          <Route path="/profile" element={<AuthProtection path="/login" userRole="Client"><Profile/></AuthProtection>}></Route>

          <Route path="*" element={<NotFound/>} />

      </Route>

    </Routes>
  )
}

export default App