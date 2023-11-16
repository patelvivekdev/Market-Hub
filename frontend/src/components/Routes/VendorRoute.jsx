import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VendorRoute = () => {
	const { userInfo } = useSelector((state) => state.auth);

	if (!userInfo) {
		return <Navigate to='/' replace />;
	}

	const isVendor = userInfo && userInfo.userType === 'Vendor';

	return isVendor ? <Outlet /> : <Navigate to='/login' replace />;
};
export default VendorRoute;
