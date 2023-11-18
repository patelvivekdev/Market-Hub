import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import {
	useGetOrderDetailsQuery,
} from '../../slices/orderSlice';

const IsOrderedRoute = () => {

	const { id } = useParams();

	const { data: order, isLoading, isError } = useGetOrderDetailsQuery(id);
	const { userInfo } = useSelector((state) => state.auth);

	if (!userInfo) {
		return <Navigate to='/' replace />;
	}

	if (isLoading) {
		return <Loader />;
	} else if (isError) {
		return <h3>{isError}</h3>;
	}

	const isOrderedOrAdmin = userInfo.userType === "Admin" || order.user._id === userInfo._id;
	return isOrderedOrAdmin ? <Outlet /> : <Navigate to='/' replace />;
};
export default IsOrderedRoute;
