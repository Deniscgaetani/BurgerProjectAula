import React, {Component} from 'react';
import Burger from '../../components/Burger/Burger'
import Aux from 'react-aux';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from "../../axios-orders";
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/WithErrorHandler/WithErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: null,
            totalPrice: 4,
            purchasable: false,
            loading: false,
            error: null
        }
    }

    async componentDidMount() {
        try {
            const getMethod = await axios.get('https://react-my-burger-a6841-default-rtdb.firebaseio.com/ingredients.json')
            this.setState({ingredients: getMethod.data})

        } catch (error) {
        this.setState({error: true})
        }
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(icky => {
                return ingredients[icky];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchasable: sum > 0});
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchaseContinueHandler = async () => {
        // alert('You continue!');
        try {
            this.setState({loading: true})
            const data = {
                ...this.state,
                costumer: {
                    name: 'teste',
                    address: {
                        zipcode: '1323131231',
                        country: 'Brazil',
                        street: 'test street'
                    },
                    email: 'e@gmail.com',
                },
                deliveryMethod: 'fastest'
            }
            const postMethod = await axios.post('/orders.json', data);
            if (postMethod.status === 200) {
                this.setState({loading: false, purchasing: false})
            }
            console.log('postMethod', postMethod);
        } catch (error) {
            this.setState({loading: false, purchasing: false})
            console.log('error:', error);
        }

    }
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    render() {
        const disabledInfo = {...this.state.ingredients};
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;

        let burger = this.state.error ? <p> Ingredients can't be loaded!</p>:<Spinner/>;
        if(this.state.ingredients) {
            burger = (<Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls ingredientAdded={this.addIngredientHandler}
                               ingredientRemoved={this.removeIngredientHandler}
                               disabled={disabledInfo}
                               ordered={this.purchaseHandler}
                               purchasable={this.state.purchasable}
                               price={this.state.totalPrice}/>
            </Aux>)
            orderSummary = <OrderSummary
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}
                ingredients={this.state.ingredients}/>

        }
        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
