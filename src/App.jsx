import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import User from './pages/User';
import AdminLogin from './pages/AdminLogin';

const routes = [
    {
        path: '/admin/login',
        component: AdminLogin,
    },
    {
        path: '/admin',
        component: Admin,
    },
    {
        path: '/',
        component: User,
    },
];
function App() {
    return (
        <Router>
            <Switch>
                {routes.map((c, i) => (
                    <Route key={i} {...c} />
                ))}
            </Switch>
        </Router>
    );
}

export default App;
