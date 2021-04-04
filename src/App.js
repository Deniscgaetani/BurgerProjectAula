import React, {Component} from 'react';
import './App.css';
import Layout from './containers/Layout/Layout';
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Checkout from "./containers/Checkout/Checkout";
import {Route, Switch} from 'react-router-dom';

class App extends Component {
    render() {
        return (<div>
            <Layout>
                <Switch>
                    <Route path='/checkout' component={Checkout}/>
                    <Route path='/' exact component={BurgerBuilder}/>
                </Switch>
                {/*<BurgerBuilder/>*/}
                {/*<Checkout/>*/}
            </Layout>
        </div>)
    }
}

export default App;
