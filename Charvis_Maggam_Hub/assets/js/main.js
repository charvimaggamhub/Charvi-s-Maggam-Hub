// js/main.js
// -----------------------------------------------------
// Charvi’s Maggam Hub – Main JavaScript File
// Handles gallery loading, modal view, and navbar logic
// -----------------------------------------------------

// ✅ Load products from localStorage or fallback to data/products.json
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

// -------------------------------
// 🧵 Function to Load Products
// -------------------------------
function loadProducts() {
    // Try to get saved products from localStorage
    let products = JSON.parse(localStorage.getItem("products"));

    if (products && products.length > 0) {
        displayGallery(products);
    } else {
        // Fetch default products from data/products.json
        fetch("data/products.json")
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("products", JSON.stringify(data));
                displayGallery(data);
            })
            .catch(err => console.error("Error loading products.json:", err));
    }
}

// -------------------------------
// 🧵 Display Gallery Items
// -------------------------------
function displayGallery(products) {
    const galleryContainer = document.getElementById("gallery-container");

    if (!galleryContainer) return;

    galleryContainer.innerHTML = "";

    products.forEach(product => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="gallery-image" onclick="openModal('${product.image}', '${product.name}', '${product.description || ''}')">
            <h4>${product.name}</h4>
        `;

        galleryContainer.appendChild(item);
    });
}

// -------------------------------
// 🖼️ Modal Popup for Images
// -------------------------------
function openModal(image, name, description) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDescription");

    modal.style.display = "block";
    modalImg.src = image;
    modalTitle.textContent = name;
    modalDesc.textContent = description || "";
}

// -------------------------------
// ❌ Close Modal
// -------------------------------
function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

// -------------------------------
// 🌐 Navbar Active Link Highlight
// -------------------------------
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll("nav ul li a");

navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});

// -------------------------------
// 🔁 Refresh Gallery After Admin Update
// -------------------------------
window.addEventListener("storage", (e) => {
    if (e.key === "products") {
        loadProducts(); // Reload gallery when localStorage is updated
    }
});
