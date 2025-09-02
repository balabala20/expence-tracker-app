import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Income from './components/Income/Income';
import Expense from './components/Expense/Expense';
import PrivateRoute from './components/Routing/PrivateRoute';
import Alert from './components/Layout/Alert';
import Sidebar from './components/Layout/Sidebar';
import Goals from './components/Goals/Goals';
import RecentTransactions from './components/Transactions/RecentTransactions'; // Import the new component

// Redux
import { Provider, connect } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

const AppContent = ({ auth: { isAuthenticated, loading } }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    if (loading) {
        return <div>Loading...</div>; // Or a proper spinner component
    }

    return (
        <Router>
            <Alert />
            {isAuthenticated && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
                <PrivateRoute exact path="/" component={(props) => <Dashboard {...props} toggleSidebar={toggleSidebar} />} />
                <PrivateRoute exact path="/income" component={(props) => <Income {...props} toggleSidebar={toggleSidebar} />} />
                <PrivateRoute exact path="/expense" component={(props) => <Expense {...props} toggleSidebar={toggleSidebar} />} />
                <PrivateRoute exact path="/goals" component={(props) => <Goals {...props} toggleSidebar={toggleSidebar} />} />
                <PrivateRoute exact path="/transactions" component={(props) => <RecentTransactions {...props} toggleSidebar={toggleSidebar} />} />
            </Switch>
        </Router>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

const ConnectedAppContent = connect(mapStateToProps)(AppContent);

const App = () => (
    <Provider store={store}>
        <ConnectedAppContent />
    </Provider>
);

export default App;