function loadGallery(items){
  const gallery = document.getElementById('galleryGrid');
  gallery.innerHTML = "";
  items.forEach(item=>{
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
    `;
    gallery.appendChild(card);

    // Click event for modal
    const img = card.querySelector('img');
    img.addEventListener('click', ()=>{
      const modal = document.getElementById('modal');
      const modalImg = document.getElementById('modalImg');
      const caption = document.getElementById('caption');
      modal.style.display = "block";
      modalImg.src = item.image;
      caption.innerText = item.name;
    });
  });
}

// Close modal
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
closeBtn.onclick = function() { modal.style.display = "none"; }
window.onclick = function(event) {
  if (event.target == modal) { modal.style.display = "none"; }
}
