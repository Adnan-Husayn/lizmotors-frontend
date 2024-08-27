// PrivateRoute.tsx
import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
