import React from "react";
import Aux from "react-aux";

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(icky => {
            return (
                <li key={icky}>
                    <span style={{textTransform: 'capitalize'}}>{icky}</span>: {props.ingredients[icky]}
                </li>
            )
        })
    return (<Aux>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>
            {ingredientSummary}
        </ul>
        <p>Continue to Checkout?</p>
    </Aux>)
}


export default orderSummary;
