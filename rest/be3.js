// Select necessary DOM elements
const elements = {
    listProductHTML: document.querySelector(".grid-container"),
    listCartHTML: document.querySelector(".cart-section"),
    iconCartSpan: document.querySelector("#cart-count"),
    confirmOrderBtn: document.getElementById("confirm-order-btn"),
    orderConfirmationModal: document.getElementById("order-confirmation-modal"),
    orderSummary: document.getElementById("order-summary"),
    newOrderBtn: document.getElementById("new-order-btn"),
};

// Initialize app state
let state = {
    listProducts: [],
    cart: {},
};

// Fetch product data and initialize app
const initApp = async () => {
    try {
        const response = await fetch("data.json");
        state.listProducts = await response.json();
        renderProducts();
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};

// Render products to the HTML
const renderProducts = () => {
    elements.listProductHTML.innerHTML = ""; // Clear existing products
    state.listProducts.forEach(renderProductCard);
    attachButtonListeners();
};

// Render a single product card
const renderProductCard = (product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("card");
    productCard.dataset.name = product.name;
    productCard.innerHTML = `
        <img class="card-image" src="${product.image.desktop}" alt="${product.name}">
        <button class="add-to-cart-button">
            <img src="assets/images/icon-add-to-cart.svg" alt="cart icon"> Add to cart
        </button>
        <div class="quantity-selector hidden"> 
            <button class="icon-decrement">-</button>
            <span>1</span>
            <button class="icon-increment">+</button>
        </div>
        <p>${product.category}</p>
        <h2 class="product-name">${product.name}</h2>
        <h3 class="price">$${product.price.toFixed(2)}</h3>
    `;
    elements.listProductHTML.appendChild(productCard);
};

// Attach event listeners to buttons
const attachButtonListeners = () => {
    document.querySelectorAll(".add-to-cart-button").forEach(button => {
        button.addEventListener("click", handleAddToCartClick);
    });

    document.querySelectorAll(".icon-increment, .icon-decrement").forEach(button => {
        button.addEventListener("click", handleQuantityChange);
    });
};

// Handle the Add to Cart button click
const handleAddToCartClick = (event) => {
    const productCard = event.target.closest(".card");
    const productName = productCard.dataset.name;
    const productPrice = parseFloat(productCard.querySelector(".price").textContent.replace('$', ''));

    toggleAddToCartButton(productCard, true);
    updateCart(productName, productPrice, 1);
    updateCartDisplay();
};

// Update the cart with the product
const updateCart = (productName, price, quantity) => {
    if (!state.cart[productName]) {
        state.cart[productName] = { quantity: 0, item: { price, name: productName } };
    }
    state.cart[productName].quantity += quantity;
};



// Handle quantity increment/decrement
const handleQuantityChange = (event) => {
    const button = event.target;
    const productCard = button.closest(".card");
    const productName = productCard.dataset.name;
    const span = productCard.querySelector(".quantity-selector span");
    let currentQuantity = parseInt(span.textContent);

    if (button.classList.contains("icon-increment")) {
        currentQuantity++;
    } else if (button.classList.contains("icon-decrement")) {
        currentQuantity = Math.max(1, currentQuantity - 1);
    }

    span.textContent = currentQuantity;
    state.cart[productName].quantity = currentQuantity;

    // Update the cart display after changing quantity
    updateCartDisplay();
};
/*
///* Update the cart display
const updateCartDisplay = () => {
    const cartElement = elements.listCartHTML;
    const orderNumber = elements.iconCartSpan;
    cartElement.innerHTML = ""; // Clear cart display
    let totalOrder = 0;
    let count = 0;

    // Render cart items
    for (const productName in state.cart) {
        const cartItem = state.cart[productName];
        let priceOfElement = cartItem.item.price * cartItem.quantity;
        totalOrder += priceOfElement;
        count++;

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
            <h5>${cartItem.item.name}</h5>
            <span>${cartItem.quantity}x @ $${cartItem.item.price.toFixed(2)}</span>
            <span class="price">$${priceOfElement.toFixed(2)}</span>
            <img class="remove-item" src="assets/images/icon-remove-item.svg" alt="remove" />
        `;
        cartElement.appendChild(cartItemElement);

        // Event listener to remove item from the cart
        cartItemElement.querySelector(".remove-item").addEventListener("click", () => {
            delete state.cart[productName];
            updateCartDisplay();
        });
    }

    // Update cart count and total order
    orderNumber.textContent = `Your Cart (${count})`;
    const orderTotalElement = document.createElement("div");
    orderTotalElement.classList.add("order-total");
    orderTotalElement.innerHTML = `
        <span>Order Total</span>
        <span>$${totalOrder.toFixed(2)}</span>
    `;
    cartElement.appendChild(orderTotalElement);

    // Add confirm order button
    const confirmOrderElement = document.createElement("div");
    confirmOrderElement.classList.add("order-confirm");
    confirmOrderElement.innerHTML = `
        <button class="confirm-btn">Confirm Order</button>
    `;
    cartElement.appendChild(confirmOrderElement);

    // Add event listener to confirm order
    confirmOrderElement.querySelector(".confirm-btn").addEventListener("click", confirmOrderAction);
};*/
// Function to handle the new order button click
const handleNewOrder = () => {
    // Clear the cart state
    state.cart = {};

    // Reset the product cards (show "Add to Cart" buttons, hide quantity selectors)
    document.querySelectorAll(".card").forEach(productCard => {
        toggleAddToCartButton(productCard, false);
    });

    // Update cart display (empty cart view)
    updateCartDisplay();
};



// Update cart display (already defined)
const updateCartDisplay = () => {
    const cartElement = elements.listCartHTML;
    const orderNumber = elements.iconCartSpan;
    cartElement.innerHTML = ""; // Clear cart display
    let totalOrder = 0;
    let count = 0;

    // Render cart items
    for (const productName in state.cart) {
        const cartItem = state.cart[productName];
        let priceOfElement = cartItem.item.price * cartItem.quantity;
        totalOrder += priceOfElement;
        count++;

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
            <h5>${cartItem.item.name}</h5>
            <span>${cartItem.quantity}x @ $${cartItem.item.price.toFixed(2)}</span>
            <span class="price">$${priceOfElement.toFixed(2)}</span>
            <img class="remove-item" src="assets/images/icon-remove-item.svg" alt="remove" />
        `;
        cartElement.appendChild(cartItemElement);

        // Event listener to remove item from the cart
        cartItemElement.querySelector(".remove-item").addEventListener("click", () => {
            delete state.cart[productName];
            updateCartDisplay();
        });
    }

    // Update cart count and total order
    orderNumber.textContent = `Your Cart (${count})`;
    const orderTotalElement = document.createElement("div");
    orderTotalElement.classList.add("order-total");
    orderTotalElement.innerHTML = `
        <span>Order Total</span>
        <span>$${totalOrder.toFixed(2)}</span>
    `;
    cartElement.appendChild(orderTotalElement);

    // Add confirm order button
    const confirmOrderElement = document.createElement("div");
    confirmOrderElement.classList.add("order-confirm");
    confirmOrderElement.innerHTML = `
        <button class="confirm-btn">Confirm Order</button>
    `;
    cartElement.appendChild(confirmOrderElement);

    // Add event listener to confirm order
    confirmOrderElement.querySelector(".confirm-btn").addEventListener("click", confirmOrderAction);
};

// Toggle visibility of the Add to Cart button and counter (already defined)
const toggleAddToCartButton = (productCard, hide) => {
    const addToCartButton = productCard.querySelector(".add-to-cart-button");
    const counterDiv = productCard.querySelector(".quantity-selector");
    addToCartButton.classList.toggle("hidden", hide);
    counterDiv.classList.toggle("hidden", !hide);
};

// Initialize app (already defined)
initApp();

const confirmOrderAction = () => {
    const totalOrder = Object.values(state.cart).reduce((acc, item) => acc + item.item.price * item.quantity, 0);

    // Create order confirmation popup
    const confirmationPopup = document.createElement("div");
    confirmationPopup.classList.add("popup");
    confirmationPopup.innerHTML = `
        <div class="inner-content">
            <img src="assets/images/icon-order-confirmed.svg" alt="Order Confirmed">
            <h1>Order Confirmed</h1>
            <span>We hope you enjoy your food!</span>
            <div class="confirmation-total">
                <span>Order Total</span>
                <span><b>$${totalOrder.toFixed(2)}</b></span>
            </div>
            <button class="new-order-btn">Start New Order</button>
        </div>
    `;

    document.body.appendChild(confirmationPopup);

    // Check if .main-content exists before applying the blur effect
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
        mainContent.style.filter = "blur(5px)";
    }

    // Event listener for starting a new order (reset cart and UI)
    confirmationPopup.querySelector(".new-order-btn").addEventListener("click", () => {
        // Remove the confirmation popup
        confirmationPopup.remove();

        // Remove blur effect if .main-content exists
        if (mainContent) {
            mainContent.style.filter = "none";
        }

        // Call the new order handler to reset the cart and product UI
        handleNewOrder();
    });
};

