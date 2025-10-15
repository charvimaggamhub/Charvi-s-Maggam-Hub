fetch('data/products.json')
  .then(response => response.json())
  .then(data => {
      // Merge with localStorage if exists
      let savedProducts = JSON.parse(localStorage.getItem('products')) || [];
      let products = savedProducts.length ? savedProducts : data;
      localStorage.setItem('products', JSON.stringify(products));
      loadGallery(products);
  });
