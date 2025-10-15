if(localStorage.getItem('isAdmin') !== 'true'){
  alert('Please login as admin!');
  window.location.href = 'login.html';
}

// Sample products stored in localStorage
let products = JSON.parse(localStorage.getItem('products')) || [];

// Display designs
function displayDesigns(){
  const list = document.getElementById('designList');
  list.innerHTML = '';
  products.forEach((p,i)=>{
    const div = document.createElement('div');
    div.innerHTML = `
      <p>${p.name} <button onclick="deleteDesign(${i})">Delete</button></p>
    `;
    list.appendChild(div);
  });
}

displayDesigns();

// Add new design
document.getElementById('addForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('pName').value;
  const image = document.getElementById('pImage').value;
  products.push({name, image});
  localStorage.setItem('products', JSON.stringify(products));
  displayDesigns();
  this.reset();
});

// Delete design
function deleteDesign(i){
  products.splice(i,1);
  localStorage.setItem('products', JSON.stringify(products));
  displayDesigns();
}

// Logout
document.getElementById('logoutBtn').addEventListener('click',()=>{
  localStorage.removeItem('isAdmin');
  window.location.href='login.html';
});
