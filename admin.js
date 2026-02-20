// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyA6gthbmmbK_dZWt-bdpXEw986Lj94msz4",
  authDomain: "charvis-maggam-hub.firebaseapp.com",
  projectId: "charvis-maggam-hub",
  appId: "1:137089691820:web:fe35a99dd7dd231ca02f09"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ================= APPS SCRIPT URL =================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWxBh1-GTwNcFxKs_s-oAP0_vUa-MiCaaisIldGgpRl5-vZJpfcakh2iQj1WYyB2B7Vw/exec";

// 🔐 Only this email can access admin
const ADMIN_EMAIL = "admin@charvi.com";

// ================= CLOUDINARY CONFIG =================
const CLOUD_NAME = "dzlncwjiy";
const UPLOAD_PRESET = "Charvi's Maggam Hub"; // ⚠ make sure this matches Cloudinary preset exactly



// ================= LOGIN =================
document.getElementById("loginBtn")?.addEventListener("click", function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("loginMsg");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => { if (msg) msg.innerText = ""; })
    .catch(() => { if (msg) msg.innerText = "Login Failed ❌"; });

});


// ================= AUTH STATE =================
auth.onAuthStateChanged(function (user) {

  const loginSection = document.getElementById("loginSection");
  const dashboardSection = document.getElementById("dashboardSection");

  if (!loginSection || !dashboardSection) return;

  if (user) {

    if (user.email !== ADMIN_EMAIL) {
      alert("Access Denied ❌");
      auth.signOut();
      return;
    }

    loginSection.style.display = "none";
    dashboardSection.style.display = "block";

    loadBookings();
    loadGallery();

  } else {
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
  }

});


// ================= LOAD BOOKINGS =================
function loadBookings(){

  fetch(SCRIPT_URL + "?action=getBookings")
    .then(res => res.json())
    .then(data => {

      const tableBody = document.querySelector("#bookingTable tbody");
      tableBody.innerHTML = "";

      let todayCount = 0;
      const today = new Date().toDateString();

      data.forEach((booking) => {

        const bookingDate = new Date(booking.timestamp).toDateString();
        if (bookingDate === today) todayCount++;

        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${booking.timestamp}</td>
          <td>${booking.bookingId}</td>
          <td>${booking.name}</td>
          <td>${booking.phone}</td>
          <td>${booking.service}</td>
          <td>${booking.email}</td>
          <td><button onclick="this.closest('tr').remove()">🗑</button></td>
        `;

        tableBody.appendChild(row);
      });

      document.getElementById("totalBookings").innerText = data.length;
      document.getElementById("todayBookings").innerText = todayCount;

    })
    .catch(err => console.error("Booking Load Error:", err));
}



// ================= CLOUDINARY IMAGE UPLOAD =================
const dropArea = document.getElementById("dropArea");
const imageInput = document.getElementById("imageInput");

if (dropArea && imageInput) {

  dropArea.addEventListener("click", () => imageInput.click());

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");
    uploadToCloudinary(e.dataTransfer.files[0]);
  });

  imageInput.addEventListener("change", () => {
    uploadToCloudinary(imageInput.files[0]);
  });
}


// ================= UPLOAD TO CLOUDINARY =================
function uploadToCloudinary(file){

  if(!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {

    // Save image URL to Google Sheet
    fetch(SCRIPT_URL, {
      method:"POST",
      body: JSON.stringify({
        action:"saveImage",
        url:data.secure_url
      })
    })
    .then(()=> loadGallery());

  })
  .catch(err => console.error("Upload Error:", err));
}



// ================= LOAD GALLERY =================
function loadGallery(){

  fetch(SCRIPT_URL + "?action=getImages")
    .then(res => res.json())
    .then(images => {

      const gallery = document.getElementById("galleryContainer");
      gallery.innerHTML = "";

      if (!Array.isArray(images)) {
        console.error("Invalid gallery response:", images);
        return;
      }

      images.forEach(url => {

        if (typeof url !== "string") {
          console.error("Invalid image URL:", url);
          return;
        }

        const div = document.createElement("div");
        div.className = "gallery-item";

        const img = document.createElement("img");
        img.src = url;

        const btn = document.createElement("button");
        btn.className = "delete-btn";
        btn.innerText = "🗑";

        btn.addEventListener("click", function(){
          if(confirm("Delete image?")){
            fetch(SCRIPT_URL,{
              method:"POST",
              body: JSON.stringify({
                action:"deleteImage",
                url:url
              })
            })
            .then(()=> loadGallery());
          }
        });

        div.appendChild(img);
        div.appendChild(btn);
        gallery.appendChild(div);

      });

    })
    .catch(err => console.error("Gallery Load Error:", err));
}

// ================= SECTION SWITCH =================
function showSection(sectionId, element){

  document.querySelectorAll(".admin-section").forEach(sec=>{
    sec.style.display="none";
  });

  document.querySelectorAll(".menu-item").forEach(item=>{
    item.classList.remove("active");
  });

  document.getElementById(sectionId).style.display="block";

  if(element){
    element.classList.add("active");
  }
}


// ================= SEARCH =================
function searchBooking(){
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#bookingTable tbody tr");

  rows.forEach(row => {
    const name = row.children[2].innerText.toLowerCase();
    row.style.display = name.includes(input) ? "" : "none";
  });
}