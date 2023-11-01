export const addDecimals = (num) => {
	return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
	// Calculate the total number of items in the cart
	state.itemsPrice = addDecimals(
		state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
	);

	// Calculate the shipping price (free if over $50) (otherwise $5)
	state.shippingPrice = addDecimals(state.itemsPrice > 50 ? 0 : 5);

	// Calculate the tax price (13%)
	state.taxPrice = addDecimals(Number((0.13 * state.itemsPrice).toFixed(2)));

	// Calculate the total price (items + shipping + tax)
	state.totalPrice = (
		Number(state.itemsPrice) +
		Number(state.shippingPrice) +
		Number(state.taxPrice)
	).toFixed(2);

	// Save the cart to localStorage so it persists
	localStorage.setItem('cart', JSON.stringify(state));

	return state;
};
