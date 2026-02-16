function generateBookingId() {
  return "CMH-" + Math.floor(10000 + Math.random() * 90000);
}

function submitBooking() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;
  const msg = document.getElementById("bookingMsg");

  const bookingId = generateBookingId();

  msg.innerText = "Submitting...";
  msg.style.color = "orange";

  db.collection("bookings").add({
    bookingId: bookingId,
    name: name,
    phone: phone,
    service: service,
    status: "Pending",
    createdAt: new Date()
  })
  .then(() => {
    msg.innerText = "✅ Booking successful! ID: " + bookingId;
    msg.style.color = "green";
    document.getElementById("bookingForm").reset();
  })
  .catch((error) => {
    console.error(error);
    msg.innerText = "❌ Error saving booking";
    msg.style.color = "red";
  });
}
