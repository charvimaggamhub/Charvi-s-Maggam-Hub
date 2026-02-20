const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWxBh1-GTwNcFxKs_s-oAP0_vUa-MiCaaisIldGgpRl5-vZJpfcakh2iQj1WYyB2B7Vw/exec";

document.getElementById("bookingForm")
.addEventListener("submit", async function (e) {

  e.preventDefault();

  const loading = document.getElementById("loadingMsg");
  const successBox = document.getElementById("successBox");
  const successText = document.getElementById("successText");
  const msg = document.getElementById("bookingMsg");

  loading.style.display = "block";
  successBox.style.display = "none";
  msg.innerText = "";

  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    service: document.getElementById("service").value,
    email: document.getElementById("email").value
  };

  try {

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",   // 🔥 Important to avoid CORS error
      body: JSON.stringify(data)
    });

    // Since no-cors doesn’t allow reading response
    loading.style.display = "none";
    successBox.style.display = "block";
    successText.innerText = "✅ Booking submitted successfully!";
    document.getElementById("bookingForm").reset();

  } catch (error) {

    loading.style.display = "none";
    msg.innerText = "❌ Server error. Try again.";
    msg.style.color = "red";
    console.error(error);

  }

});

document.addEventListener("DOMContentLoaded", function () {

  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      // your login code
    });
  }

});
