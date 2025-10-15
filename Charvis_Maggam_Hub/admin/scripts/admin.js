// Save About Text
function saveAbout() {
  const text = document.getElementById('about-text').value;
  localStorage.setItem('aboutText', text);
  alert('About section updated!');
}

// Upload & Preview Image
function uploadProductImage() {
  const file = document.getElementById('product-image').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '150px';
      img.style.margin = '10px';
      img.style.borderRadius = '10px';
      document.getElementById('image-preview').appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}
