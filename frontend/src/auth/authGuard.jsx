import PropTypes from 'prop-types';
import loginServices from '../services/loginServices';
import { Navigate, useLocation } from 'react-router-dom'

function AuthGuard({ children }) {
    let isAuthenticated = localStorage.getItem('token');
    const location = useLocation();

    async function call() {
        isAuthenticated = await loginServices.isAuth()
        console.log(isAuthenticated)
        if (isAuthenticated) {
            return true;
        }

        return false;
    }

    const result = isAuthenticated ? true : call();
    if (result == true) {
        return children
    }
    
    // Redirect to login page with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
}

// Add PropTypes validation
AuthGuard.propTypes = {
    children: PropTypes.element,
};

export default AuthGuard;