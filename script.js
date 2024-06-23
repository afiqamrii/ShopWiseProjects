document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchQuery').value;
    if (query) {
        fetchGoogleShoppingData(query);
    }
});

function fetchGoogleShoppingData(query) {
    const apiUrl = `http://localhost:3000/search?q=${encodeURIComponent(query)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => console.error('Error fetching data:', error));
}

function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (data.shopping_results && data.shopping_results.length > 0) {
        data.shopping_results.forEach(item => {
            const productItem = document.createElement('div');
            productItem.className = 'product';

            const productImage = document.createElement('img');
            productImage.src = item.thumbnail;
            productImage.alt = item.title;

            const productTitle = document.createElement('div');
            productTitle.className = 'product-title';
            productTitle.textContent = item.title;

            const productPrice = document.createElement('div');
            productPrice.className = 'product-price';
            productPrice.textContent = item.extracted_price ? `MYR ${Math.round((item.extracted_price*4.69) * 100)/100}`  : 'Price not available';

            const productLink = document.createElement('a');
            productLink.className = 'product-link';
            productLink.href = item.link;
            productLink.target = '_blank';
            productLink.textContent = 'View Product';

            productItem.appendChild(productImage);
            productItem.appendChild(productTitle);
            productItem.appendChild(productPrice);
            productItem.appendChild(productLink);

            resultsContainer.appendChild(productItem);
        });
    } else {
        resultsContainer.textContent = 'No results found';
    }
}
