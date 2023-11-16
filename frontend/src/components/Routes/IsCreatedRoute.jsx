import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetProductDetailsQuery } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';

const IsCreatedRoute = () => {

	const { id } = useParams();

	const { data: product, isLoading, isError } = useGetProductDetailsQuery(id);
	const { userInfo } = useSelector((state) => state.auth);

	if (!userInfo) {
		return <Navigate to='/' replace />;
	}

	if (isLoading) {
		return <Loader />;
	} else if (isError) {
		return <h3>{isError}</h3>;
	}

	const isCreator = product?.vendor?._id === userInfo?.profile?._id;
	return isCreator ? <Outlet /> : <Navigate to='/login' replace />;
};
export default IsCreatedRoute;
