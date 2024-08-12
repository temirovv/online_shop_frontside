document.addEventListener('DOMContentLoaded', function() {
    // The URL of your API endpoint
    const apiURL = 'https://77.232.131.69/api/products';

    // Function to fetch products from the API
    async function fetchProducts() {
        try {
            const response = await fetch(apiURL);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Function to display products on the page
    function displayProducts(products) {
        const productList = document.querySelector('.container.mt-4.content .row');
        productList.innerHTML = ''; // Clear any existing content

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-6 col-md-4';
            
            productCard.innerHTML = `
                <div class="card product-card">
                    <div class="position-relative">
                        <img src="${product.image[0].image || './pictures/default-product.jpg'}" alt="${product.name}" class="product-image">
                        <div class="new-label">${product.is_new ? 'Yangi' : ''}</div>
                    </div>
                    <div class="card-body text-center">
                        <div class="price">${product.price.toLocaleString()} so'm</div>
                        <div class="product-title">${product.name}</div>
                        <button class="add-to-cart-btn w-100 mt-3" data-product-id="${product.id}"><i class="bi bi-lock"></i> Savatga</button>
                    </div>
                </div>
            `;

            productList.appendChild(productCard);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        const buttons = document.querySelectorAll('.add-to-cart-btn');
        console.log(buttons); // Debug: Check if buttons are selected
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('Button clicked'); // Debug: Check if the event listener is working
                
                const productId = this.getAttribute('data-product-id');
                // Redirect to the product detail page
                window.location.href = `product-detail.html?product_id=${productId}`;
            });
        });
    }

    // Fetch and display products when the page loads
    fetchProducts();


    document.querySelectorAll('.add-to-basket').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const quantity = 1; // You can add a quantity selector in your HTML
    
            fetch('/api/add-to-basket/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'), // Include the CSRF token if required
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    updateBasketCount(); // Update the basket count on the UI
                    alert('Product added to basket!');
                } else {
                    alert('Error adding product to basket.');
                }
            });
        });
    });
    
    function updateBasketCount() {
        fetch('/api/basket-count/')  // You can create an endpoint to get the current basket count
            .then(response => response.json())
            .then(data => {
                document.getElementById('basket-count').innerText = data.count;
            });
    }
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
});

