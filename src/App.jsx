import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import AuthProvider from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
