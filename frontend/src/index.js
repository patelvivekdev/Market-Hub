import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import reportWebVitals from './reportWebVitals';

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProductScreen from './screens/ProductScreen';

const routes = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<App />}>
			<Route index={true} path='/' element={<HomeScreen />} />
			{/* AUTH ROUTES */}
			<Route path='/login' element={<LoginScreen />} />
			<Route path='/:userType/register' element={<RegisterScreen />} />

			{/* PRODUCT ROUTES */}
			<Route path='/products' element={<ProductsScreen />} />
			<Route path='/products/:id' element={<ProductScreen />} />

			{/* ADMIN ROUTES */}
			<Route path='Admin' element={<RegisterScreen />} />

			{/* Not Found */}
			<Route path='*' element={<h1>Not Found</h1>} />
		</Route>
	)
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={routes} />
	</React.StrictMode>
);

reportWebVitals();
