document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');
    const apiUrl = `http://77.232.131.69/api/product-detail/${productId}`;  // Adjust the URL to fetch the specific product

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Update the page with the product details
            document.getElementById('product-image').src = 'http://localhost:8000/' +  data.image[0].image;
            document.getElementById('product-title').textContent = data.name;
            document.getElementById('current-price').textContent = `${data.price} so'm`;

            if (data.old_price) {
                document.getElementById('old-price').textContent = `${data.old_price} so'm`;
                document.getElementById('old-price').style.display = 'inline';
            }

            if (data.discount) {
                document.getElementById('discount-percentage').textContent = `${data.discount}%`;
                document.getElementById('discount-percentage').style.display = 'inline';
            }

            if (data.is_discounted) {
                document.getElementById('discount-label').style.display = 'inline';
            }

            document.getElementById('availability-label').textContent = `Qoldi ${data.quantity} dona`;
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
});
