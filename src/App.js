// Mui
import { createTheme, ThemeProvider } from '@mui/material/styles';

// react-router-dom
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'

// Jwt-decode
import { jwtDecode } from "jwt-decode";

// ract-tostify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// google-login
import { GoogleOAuthProvider } from '@react-oauth/google';

// Components and css
import './App.css';
import { privateRoutes, publicRoutes } from './routing/route';
import SideBar from './layout/sidebar';

const theme = createTheme({
  palette: {
    primary: {
      main: "#508aa8"
    }
  },
});

function App() {

  const RequireAuth = () => {
    const token = localStorage.getItem('accessToken');
    const location = useLocation();
    if (!token) {
      return <Navigate to='/login' replace />;
    } else {
      const decoded = jwtDecode(token);
      const isExpire = Date.now() / 1000
      if (decoded.exp < isExpire) {
        localStorage.removeItem('accessToken')
        return <Navigate to='/login' replace />
      } else if (token && (location.pathname === '/login' || location.pathname === '/')) {
        const decoded = jwtDecode(token);
        if (decoded.role === "Admin") {
          return <Navigate to='/taskList' replace />;
        } else {
          return <Navigate to='/myTask' replace />;
        }
      } else {
        return <Outlet />
      }
    }
  };

  const CheckIsLoggedIn = ({ element }) => {
    const token = localStorage.getItem('accessToken');
    const location = useLocation();
    if (!token) {
      return element;
    } if (token && (publicRoutes.filter((e) => e.to.includes(location.pathname.split('/')?.[1])) || location.pathname === '/')) {
      const decoded = jwtDecode(token);
      if (decoded.role === "Admin") {
        return <Navigate to='/taskList' replace />;
      } else {
        return <Navigate to='/myTask' replace />;
      }
    } return <Outlet />
  };

  const CheckRole = ({ element, role }) => {
    const token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token);
    if (role.includes(decoded.role)) {
      return element
    } else {
      console.log("error");
    }
  }

  return (
    <GoogleOAuthProvider clientId="49403508532-u24feh8dkv5r8nb64abut0mb1s17592i.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            {
              publicRoutes.map((routes) => {
                return (
                  <Route
                    key={routes.to}
                    element={<CheckIsLoggedIn element={routes.element} />}
                    path={routes.to}
                  />
                );
              })
            }
            <Route element={<RequireAuth />} path='/'>
              {
                privateRoutes.map((route) => {
                  return (
                    <Route
                      key={route.to}
                      element={<CheckRole element={<SideBar>{route.element}</SideBar>} role={route.role} />}
                      path={route.to}
                    />
                  );
                })
              }
            </Route>
          </Routes >
        </BrowserRouter >
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
