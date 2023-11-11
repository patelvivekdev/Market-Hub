import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VendorRoute = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const isVendor = userInfo && userInfo.userType === 'Vendor';

	return isVendor ? <Outlet /> : <Navigate to='/login' replace />;
};
export default VendorRoute;
