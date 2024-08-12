document.addEventListener('DOMContentLoaded', function() {
    // const telegram_user = window.Telegram.WebApp;
    // const user_id = telegram_user.user.id;
    
    document.getElementById('loader').style.display = 'block';


    // The URL of your API endpoint
    const apiURL = 'https://temirovv.uz/api/products';


    window.onload = function() {
        // Hide the loader once the page is fully loaded
        document.getElementById('loader').style.display = 'none';
    };

    // Function to fetch products from the API
    async function fetchProducts() {
        try {
            const response = await fetch(apiURL);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        finally {
            document.getElementById('loader').style.display = 'none';
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
                        <button class="add-to-basket w-100 mt-3" data-product-id="${product.id}"><i class="bi bi-lock"></i> Savatga</button>
                    </div>
                </div>
            `;

            productList.appendChild(productCard);
        });

        attachEventListeners();
    }

    // Function to attach event listeners to the buttons
    function attachEventListeners() {
        const buttons = document.querySelectorAll('.add-to-basket');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                addToBasket(productId);
            });
        });
    }

    // Function to handle adding a product to the basket
    function addToBasket(productId) {
        fetch('/api/add-to-basket/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Include the CSRF token if required
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1, // You can allow the user to select the quantity
                // telegram_user_id: telegram_user_id
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
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to update the basket count
    function updateBasketCount() {
        fetch('/api/basket-count/')  // You can create an endpoint to get the current basket count
            .then(response => response.json())
            .then(data => {
                document.getElementById('basket-count').innerText = data.count;
            })
            .catch(error => console.error('Error fetching basket count:', error));
    }

    // Function to get the CSRF token
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

    // Fetch and display products when the page loads
    fetchProducts();
});
