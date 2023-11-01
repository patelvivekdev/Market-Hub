import 'bootstrap/dist/css/bootstrap.min.css';
import AdminRoute from './components/AdminRoute';
import App from './App';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProductListScreen from './screens/Admin/ProductListScreen';
import ProductScreen from './screens/ProductScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProfileScreen from './screens/ProfileScreen';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RegisterScreen from './screens/RegisterScreen';
import UserListScreen from './screens/Admin/UserListScreen';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { Provider } from 'react-redux';

import AboutUs from './screens/AboutScreen';

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

			<Route path='/:userType/profile' element={<ProfileScreen />} />

			{/* VENDOR ROUTES */}
			<Route path='/vendor/products' element={<ProductsScreen />} />

			{/* PRODUCT ROUTES */}
			<Route path='/products/:id' element={<ProductScreen />} />

			{/* CART ROUTES */}
			<Route path='/cart' element={<CartScreen />} />

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
			</Route>

			{/* <Route path='/products/:id/edit' element={<ProductScreen />} /> */}

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

reportWebVitals();
