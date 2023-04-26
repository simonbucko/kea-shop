<script>
  import { Route, Router } from "svelte-navigator";
  import Navbar from "../common/Navbar.svelte";
  import AddProduct from "../pages/addProduct/AddProduct.svelte";
  import Chatrooms from "../pages/chatrooms/Chatrooms.svelte";
  import Chatroom from "../pages/chatroom/Chatroom.svelte";
  import Checkout from "../pages/checkout/Checkout.svelte";
  import Home from "../pages/home/Home.svelte";
  import Login from "../pages/login/Login.svelte";
  import MyOrders from "../pages/myOrders/MyOrders.svelte";
  import Product from "../pages/product/Product.svelte";
  import Signup from "../pages/signup/Signup.svelte";
  import AdminRoute from "./AdminRoute.svelte";
  import * as ROUTES from "./constants";
  import PrivateRoute from "./PrivateRoute.svelte";
  import SupportWindow from "../common/SupportWindow.svelte";
  import OrderConfirmation from "../pages/orderConfirmation/OrderConfirmation.svelte";
</script>

<Router primary={false}>
  <Navbar />
  <Route path={ROUTES.HOME}>
    <Home />
  </Route>
  <Route path={ROUTES.LOGIN}>
    <Login />
  </Route>
  <Route path={ROUTES.ORDER_CONFIRMATION}>
    <OrderConfirmation />
  </Route>
  <AdminRoute path={ROUTES.CHAT_ROOMS} let:location>
    <Chatrooms />
  </AdminRoute>
  <AdminRoute path="{ROUTES.CHAT_ROOM}/:socketId" let:location>
    <Chatroom />
  </AdminRoute>
  <AdminRoute path={ROUTES.ADD_PRODUCT} let:location>
    <AddProduct />
  </AdminRoute>
  <Route path={ROUTES.CHECKOUT}>
    <Checkout />
  </Route>
  <Route path="{ROUTES.PRODUCT}/:id">
    <Product />
  </Route>
  <Route path={ROUTES.SIGNUP}>
    <Signup />
  </Route>
  <PrivateRoute path={ROUTES.MY_ORDERS} let:location>
    <MyOrders />
  </PrivateRoute>
</Router>
<SupportWindow />
