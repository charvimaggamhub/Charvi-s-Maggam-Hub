// ================= BOOKING FORM SUBMIT =================

document.getElementById("bookingForm")
.addEventListener("submit", async function (e) {

  e.preventDefault();

  const loading = document.getElementById("loadingMsg");
  const msg = document.getElementById("bookingMsg");

  if (loading) loading.style.display = "block";
  if (msg) msg.innerText = "";

  const name = document.getElementById("name")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const service = document.getElementById("service")?.value.trim();
  const email = document.getElementById("email")?.value.trim();

  // Basic validation
  if (!name || !phone || !service) {

    if (loading) loading.style.display = "none";

    if (msg) {
      msg.innerText = "❌ Please fill all required fields.";
      msg.style.color = "red";
    }

    return;
  }

  // Generate Booking ID
  const bookingId = "CMH-" + Date.now();

  const bookingData = {
    booking_id: bookingId,
    name: name,
    phone: phone,
    service: service,
    email: email
  };

  try {

    // Save booking to Supabase
    const { error } = await db
      .from("bookings")
      .insert([bookingData]);

    if (loading) loading.style.display = "none";

    if (error) {

      console.error("Supabase Error:", error);

      if (msg) {
        msg.innerText = "❌ Booking failed. Please try again.";
        msg.style.color = "red";
      }

      return;
    }

    // Show Success Popup
    const popupId = document.getElementById("popupBookingId");
    const popup = document.getElementById("successPopup");

    if (popupId) popupId.innerText = "Your Booking ID: " + bookingId;

    if (popup) popup.classList.add("active");

    // Reset form
    document.getElementById("bookingForm").reset();

  } catch (err) {

    if (loading) loading.style.display = "none";

    console.error("Server Error:", err);

    if (msg) {
      msg.innerText = "❌ Server error. Try again later.";
      msg.style.color = "red";
    }

  }

});


// ================= CLOSE POPUP =================

function closePopup() {

  const popup = document.getElementById("successPopup");

  if (popup) {
    popup.classList.remove("active");
  }

}