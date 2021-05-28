import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './routes/Routes';
import PrivateRoute from './routes/PrivateRoute';

function App() {
    return (
        <Router>
            <Switch>
                {routes.map((c, i) =>
                    c?.private ? (
                        <PrivateRoute key={i} {...c} />
                    ) : (
                        <Route key={i} {...c} />
                    )
                )}
            </Switch>
        </Router>
    );
}

export default App;
