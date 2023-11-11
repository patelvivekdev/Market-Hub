import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

// SCREENS
import HomeScreen from './screens/Auth/HomeScreen';
import AboutUs from './screens/AboutScreen';

// AUTH SCREENS
import RegisterScreen from './screens/Auth/RegisterScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

// CLIENT SCREENS
import CartScreen from './screens/Client/CartScreen';
import ShippingScreen from './screens/Client/ShippingScreen';
import ProductScreen from './screens/Client/ProductScreen';

// VENDOR SCREENS
import ProductsScreen from './screens/Vendor/ProductsScreen';
import AddProductScreen from './screens/Vendor/AddProductScreen';
import EditProductScreen from './screens/Vendor/EditProductScreen';

// ADMIN SCREENS
import UserListScreen from './screens/Admin/Users/UserListScreen';
import ProductListScreen from './screens/Admin/Products/ProductListScreen';

import CategoryListScreen from './screens/Admin/Categories/CategoryListScreen';
import AddCategoryScreen from './screens/Admin/Categories/AddCategoryScreen';

// PRIVATE ROUTES

import AdminRoute from './components/Routes/AdminRoute';
import PrivateRoute from './components/Routes/PrivateRoute';
import ClientRoute from './components/Routes/ClientRoute';
import VendorRoute from './components/Routes/VendorRoute';
import IsCreatedRoute from './components/Routes/IsCreatedRoute';

import store from './store';

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';

const routes = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<App />}>
			<Route index={true} path='/' element={<HomeScreen />} />

			<Route path='/about' element={<AboutUs />} />

			{/* AUTH ROUTES */}
			<Route path='/login' element={<LoginScreen />} />
			<Route path='/:userType/register' element={<RegisterScreen />} />

			{/* PRODUCT ROUTES */}
			<Route path='/products/:id' element={<ProductScreen />} />

			{/* PRIVATE ROUTE */}
			<Route path='' element={<PrivateRoute />}>
				<Route
					path='/:userType/profile'
					element={<ProfileScreen />}
				/>
			</Route>

			{/* CLIENT ROUTES */}
			<Route path='' element={<ClientRoute />}>
				{/* CART ROUTES */}
				<Route path='/cart' element={<CartScreen />} />
				{/* SHIPPING ROUTES */}
				<Route path='/shipping' element={<ShippingScreen />} />
			</Route>

			{/* VENDOR ROUTES */}
			<Route path='' element={<VendorRoute />}>
				<Route
					path='/Vendor/products'
					element={<ProductsScreen />}
				/>
				<Route
					path='/Vendor/products/add'
					element={<AddProductScreen />}
				/>

				<Route
					path='/Vendor/products/:id'
					element={<ProductScreen />}
				/>

				<Route path='' element={<IsCreatedRoute />}>
					<Route
						path='/Vendor/products/:id/edit'
						element={<EditProductScreen />}
					/>
				</Route>
			</Route>

			{/* ADMIN ROUTES */}
			<Route path='' element={<AdminRoute />}>
				<Route
					path='/Admin/productlist'
					element={<ProductListScreen />}
				/>
				<Route
					path='/Admin/userlist'
					element={<UserListScreen />}
				/>
				<Route
					path='/Admin/orderlist'
					element={<UserListScreen />}
				/>
				<Route
					path='/Admin/categories'
					element={<CategoryListScreen />}
				/>
				<Route
					path='/Admin/categories/add'
					element={<AddCategoryScreen />}
				/>
			</Route>

			{/* Not Found */}
			<Route path='*' element={<h1>Not Found</h1>} />
		</Route>
	)
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={routes} />
		</Provider>
	</React.StrictMode>
);
