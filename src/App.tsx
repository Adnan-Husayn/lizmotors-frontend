import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './pages/PrivateRoute';
import ModulePage from './pages/ModulePage';
import LoginPage from './pages/LoginPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <ModulePage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
