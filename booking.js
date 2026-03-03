const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWxBh1-GTwNcFxKs_s-oAP0_vUa-MiCaaisIldGgpRl5-vZJpfcakh2iQj1WYyB2B7Vw/exec";

document.getElementById("bookingForm")
.addEventListener("submit", async function (e) {

  e.preventDefault();

  const loading = document.getElementById("loadingMsg");
  const msg = document.getElementById("bookingMsg");

  if (loading) loading.style.display = "block";
  if (msg) msg.innerText = "";

  const data = {
    action: "saveBooking",   // 🔥 VERY IMPORTANT
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    service: document.getElementById("service").value,
    email: document.getElementById("email").value
  };

  try {

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
  "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (loading) loading.style.display = "none";

    if (result.success) {

      // 🎀 Show Animated Popup
      document.getElementById("popupBookingId").innerText =
        "Your Booking ID: " + result.bookingId;

      document.getElementById("successPopup").classList.add("active");

      document.getElementById("bookingForm").reset();

    } else {
      msg.innerText = "❌ Booking failed.";
      msg.style.color = "red";
    }

  } catch (error) {

    if (loading) loading.style.display = "none";

    if (msg) {
      msg.innerText = "❌ Server error. Try again.";
      msg.style.color = "red";
    }

    console.error(error);
  }

});


// ================= CLOSE POPUP =================
function closePopup(){
  document.getElementById("successPopup").classList.remove("active");
}