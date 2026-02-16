// ================= CLOUDINARY =================

const CLOUD_NAME = "dzlncwjiy";   // 🔥 your real cloud name
const UPLOAD_PRESET = "charvi_gallery";

// ================= FIREBASE CONFIG =================

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA6gthbmmbK_dZWt-bdpXEw986Lj94msz4",
  authDomain: "charvis-maggam-hub.firebaseapp.com",
  projectId: "charvis-maggam-hub",
  storageBucket: "charvis-maggam-hub.firebasestorage.app",
  messagingSenderId: "137089691820",
  appId: "1:137089691820:web:fe35a99dd7dd231ca02f09D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

function adminLogin() {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;
  const errorText = document.getElementById("loginError");

  errorText.innerText = "Logging in...";

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "admin-dashboard.html";
    })
    .catch((error) => {
      errorText.innerText = "Invalid Email or Password";
    });
}


// ================= LOGIN =================

function adminLogin() {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      // Redirect to dashboard
      window.location.href = "admin-dashboard.html";
    })
    .catch(() => {
      alert("Invalid login");
    });
}

// ================= LOGOUT =================

function adminLogout() {
  auth.signOut().then(() => {
    location.reload();
  });
}

// ================= CHECK AUTH =================

auth.onAuthStateChanged((user) => {
  const currentPage = window.location.pathname;

  if (currentPage.includes("admin-dashboard") && !user) {
    window.location.href = "admin-login.html";
  }

  if (currentPage.includes("admin-dashboard") && user) {
    loadBookings();
    loadGallery();
  }
});

// ================= LOAD BOOKINGS =================

function loadBookings() {
  const tbody = document.querySelector("#bookingTable tbody");

  db.collection("bookings")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      tbody.innerHTML = "";

      snapshot.forEach((doc) => {
        const data = doc.data();

        tbody.innerHTML += `
          <tr>
            <td>${data.bookingId || "-"}</td>
            <td>${data.name}</td>
            <td>${data.phone}</td>
            <td>${data.service}</td>
            <td>
              <select onchange="updateStatus('${doc.id}', this.value)">
                <option ${data.status === "Pending" ? "selected" : ""}>Pending</option>
                <option ${data.status === "In Progress" ? "selected" : ""}>In Progress</option>
                <option ${data.status === "Completed" ? "selected" : ""}>Completed</option>
              </select>
            </td>
          </tr>
        `;
      });
    });
}

// ================= UPDATE STATUS =================

function updateStatus(id, newStatus) {
  db.collection("bookings").doc(id).update({
    status: newStatus
  });
}

// ================= UPLOAD IMAGE =================

function uploadImage() {

  const user = firebase.auth().currentUser;

  if (!user) {
    alert("Unauthorized. Please login as admin.");
    return;
  }

  const file = document.getElementById("imageFile").files[0];

  if (!file) {
    alert("Select an image");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {

    return db.collection("gallery").add({
      imageUrl: data.secure_url,
      publicId: data.public_id,
      createdAt: new Date()
    });

  })
  .then(() => {
    alert("Image uploaded successfully");
    document.getElementById("imageFile").value = "";
    document.getElementById("previewContainer").innerHTML = "";
    loadGallery();   // 🔥 auto refresh gallery
  })
  .catch(error => {
    console.error(error);
    alert("Upload failed");
  });
}

// ================= LOAD GALLERY =================

function loadGallery() {
  const container = document.getElementById("adminGallery");

  db.collection("gallery")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      container.innerHTML = "";

      snapshot.forEach(doc => {
        const data = doc.data();

        container.innerHTML += `
          <div class="gallery-item">
            <img src="${data.imageUrl}">
            <button class="delete-btn"
              onclick="deleteImage('${doc.id}')">
              X
            </button>
          </div>
        `;
      });
    });
}

// ================= DELETE IMAGE =================

function deleteImage(docId) {
  if (!confirm("Delete this image?")) return;

  db.collection("gallery").doc(docId).delete()
    .then(() => {
      alert("Image deleted");
    });
}

// ================= DRAG & DROP + PREVIEW =================

document.addEventListener("DOMContentLoaded", function() {

  const dropArea = document.getElementById("dropArea");
  const fileInput = document.getElementById("imageFile");
  const previewContainer = document.getElementById("previewContainer");

  if (!dropArea || !fileInput) return;

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.background = "#ffe6ea";
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.style.background = "";
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.background = "";
    fileInput.files = e.dataTransfer.files;
    showPreview();
  });

  fileInput.addEventListener("change", showPreview);

  function showPreview() {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      previewContainer.innerHTML = `
        <h4>Preview:</h4>
        <img src="${e.target.result}" width="200">
        <br><br>
        <button onclick="uploadImage()">Upload</button>
      `;
    };
    reader.readAsDataURL(file);
  }

});


function showSection(sectionId) {
  document.getElementById("bookingsSection").style.display = "none";
  document.getElementById("gallerySection").style.display = "none";

  document.getElementById(sectionId).style.display = "block";
}
