document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('productForm');
  const productList = document.getElementById('productList');

  productForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const productName = document.getElementById('productName').value;
      const description = document.getElementById('description').value;
      const userName = document.getElementById('userName').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:5005/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              productName : productName,
              description : description,
              userName : userName,
              password : password
          })
        });

        if (response.ok) {
            const newProduct = await response.json();

            const listItem = document.createElement('li');
            const inputHidden = document.createElement('input');
            
            inputHidden.type = 'hidden';
            inputHidden.value = newProduct._id.toString();

            listItem.textContent = `[${newProduct.order}] : ${newProduct.productName} - $${newProduct.description}`;
            listItem.appendChild(inputHidden);
            productList.appendChild(listItem);

            productForm.reset();
        } else {
            console.error('등록에 실패하였습니다.');
        }
      } catch (error) {
          console.error('error:', error);
      }
  });

  async function fetchProducts() {
      try {
          const response = await fetch('http://localhost:5005/api/products');
          
          if (response.ok) {
              const products = await response.json();
              products.forEach(product => {
                  
                  const listItem = document.createElement('li');
                  const inputHidden = document.createElement('input');
                  
                  inputHidden.type = 'hidden';
                  inputHidden.value = product._id.toString();
                  
                  listItem.textContent = `[${product.order}] : ${product.productName} - $${product.description}`;
                  listItem.appendChild(inputHidden);
                  productList.appendChild(listItem);
              });
          } else {
              console.error('조회에 실패하였습니다');
          }
      } catch (error) {
          console.error('error:', error);
      }
  }

  fetchProducts();
});
