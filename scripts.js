document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navBar = document.querySelector('.nav-bar');

    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navBar.classList.toggle('active');
    });
    // Why us Accordion
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            const arrow = this.querySelector(".downArrow i");
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                arrow.classList.remove('fa-angle-up');
                arrow.classList.add('fa-angle-down');
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                arrow.classList.remove('fa-angle-down');
                arrow.classList.add('fa-angle-up');
            }
        });
    }
});




//GoogleAuth Section
function signIn(){
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    let form = document.createElement('form')
    form.setAttribute('method', 'GET')
    form.setAttribute('action', oauth2Endpoint)

    let params = {
        "client_id" : "998811034715-95e7b036slgl0p114tnshhr4r0bb2ln3.apps.googleusercontent.com",
        "redirect_uri" : "https://testshopwise.onrender.com/shopping.html",
        "response_type" : "token",
        "scope" : "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly",
        "include_granted_scopes" : "true",
        "state" : "pass-through-value"
    }

    for(var p in params){
        let input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', p)
        input.setAttribute('value', params[p])
        form.appendChild(input)
    }

    document.body.appendChild(form)

    form.submit()

}

//LogOut Section
let params = {

}

let regex = /([^&=]+)=([^&]*)/g,m

while(m = regex.exec(location.href)){
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2])
}

if(Object.keys(params).length > 0){
    localStorage.setItem('authInfo' , JSON.stringify(params))
}

//Hide the access token

// window.history.pushState({},document.title,"/"+ "ShopWise-Projects" + "/" + "index.html")

let info = JSON.parse(localStorage.getItem('authInfo'))
console.log(JSON.parse(localStorage.getItem('authInfo')))
console.log(info['access_token'])
console.log(info['expires_in'])

fetch("https://www.googleapis.com/oauth2/v3/userinfo",{

    headers:{
        Authorization: "Bearer " + info['access_token']

    }
})
.then((data) => data.json())
.then((info) => {
    console.log(info)
    document.getElementById('name').innerHTML += info.name
})

function logout() {
    fetch("https://oauth2.googleapis.com/revoke?token=" + info['access_token'],{

        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    //Redirect User to Homepage
    .then((data) => {
        location.href = "https://testshopwise.onrender.com/index.html"
    })

}

//Connection to APIs Section
document.getElementById('searchButton').addEventListener('click', function() {
  const query = document.getElementById('searchQuery').value;
  if (query) {
      fetchGoogleShoppingData(query);
  }
});

function fetchGoogleShoppingData(query) {
  const apiUrl = `https://testshopwise.onrender.com/search?q=${encodeURIComponent(query)}`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => displayResults(data))
      .catch(error => console.error('Error fetching data:', error));
}

function displayResults(data) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (data.shopping_results && data.shopping_results.length > 0) {
      // Sort the shopping results by price (lowest to highest)
      data.shopping_results.sort((a, b) => {
          const priceA = a.extracted_price ? a.extracted_price : Infinity;
          const priceB = b.extracted_price ? b.extracted_price : Infinity;
          return priceA - priceB;
      });

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



    
