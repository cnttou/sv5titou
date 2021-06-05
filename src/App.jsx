import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import pages from './routes/Routes';
import PrivateRoute from './routes/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import { Suspense } from 'react';
import Loading from './components/Loading';

function App() {
    const showPage = (pages) => {
        var result = null;
        if (pages.length > 0) {
            result = pages.map((page, i) =>
                page?.private ? (
                    <PrivateRoute key={i} {...page} />
                ) : (
                    <Route key={i} {...page} />
                )
            );
        }
        return result;
    };
    return (
        <>
            <Router>
                <ToastContainer />
                <Suspense fallback={<Loading />}>
                    <Switch>{showPage(pages)}</Switch>
                </Suspense>
            </Router>
        </>
    );
}

export default App;
