import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Footer from './components/Footer';
import Header from './components/Header';

import './App.css';

function App() {
	return (
		<>
			<ToastContainer
				position='bottom-center'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover={false}
				theme='dark'
			/>
			<Header />
			<main className='py-3 '>
				<Container>
					<Outlet />
				</Container>
			</main>
			<Footer />
		</>
	);
}

export default App;
