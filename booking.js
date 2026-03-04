// ================= SUPABASE CONFIG =================

// Replace with your Supabase details
const SUPABASE_URL = "https://syciwtjfsvgggljorxbm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Y2l3dGpmc3ZnZ2dsam9yeGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MDA3NzQsImV4cCI6MjA4ODE3Njc3NH0.QMx67QYQ-PDh3ZciJnu0PTCkUMhBMV2q57AGF5t2E3Q";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// ================= BOOKING FORM SUBMIT =================

document.getElementById("bookingForm")
.addEventListener("submit", async function (e) {

  e.preventDefault();

  const loading = document.getElementById("loadingMsg");
  const msg = document.getElementById("bookingMsg");

  if (loading) loading.style.display = "block";
  if (msg) msg.innerText = "";

  // Generate booking ID
  const bookingId = "CMH-" + Date.now();

  const bookingData = {
    booking_id: bookingId,
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    service: document.getElementById("service").value,
    email: document.getElementById("email").value
  };

  try {

    const { data, error } = await db
      .from("bookings")
      .insert([bookingData]);

    if (loading) loading.style.display = "none";

    if (error) {

      console.error(error);

      if (msg) {
        msg.innerText = "❌ Booking failed.";
        msg.style.color = "red";
      }

      return;
    }

    // 🎀 Show Animated Success Popup
    document.getElementById("popupBookingId").innerText =
      "Your Booking ID: " + bookingId;

    document.getElementById("successPopup").classList.add("active");

    // Reset form
    document.getElementById("bookingForm").reset();

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

function closePopup() {
  document.getElementById("successPopup").classList.remove("active");
}