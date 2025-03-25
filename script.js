AOS.init({
        duration: 1000,  // Animation duration in milliseconds
        once: false       // Animation only happens once if true
    });

const form = document.getElementById('booking-form');
const viewBookingsButton = document.getElementById('view-bookings');
const bookingReceiptDiv = document.getElementById('booking-receipt');

function calculateRoomAmount(arrivalDate, departureDate, roomType, numberOfGuests) {
    // Calculate the number of days
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    const days = Math.round((departure - arrival) / (1000 * 3600 * 24));

    // Validate dates
    if (days <= 0) {
        alert('Invalid dates. Departure date should be after arrival date.');
        return;
    }

    // Calculate room amount based on room type
    let roomAmount;
    switch (roomType) {
        case 'single':
            roomAmount = 1200 * days;
            if (numberOfGuests > 2) {
                roomAmount += (numberOfGuests - 2) * 150 * days;
            }
            break;
        case 'double':
            roomAmount = 2100 * days;
            if (numberOfGuests > 3) {
                roomAmount += (numberOfGuests - 3) * 250 * days;
            }
            break;
        case 'family':
            roomAmount = 2800 * days;
            if (numberOfGuests > 5) {
                roomAmount += (numberOfGuests - 5) * 380 * days;
            }
            break;
        default:
            alert('Invalid room type.');
            return;
    }

    return roomAmount;
}


// Initialize an empty array to store bookings
let bookings = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const arrivalDate = document.getElementById('arrival-date').value;
  const departureDate = document.getElementById('departure-date').value;
  const roomType = document.getElementById('room-type').value;
        const tripType = document.getElementById('trip-type').value;
  const numberOfGuests = document.getElementById('number-of-guests').value;
  const specialRequests = document.getElementById('special-requests').value;
        const roomAmount = calculateRoomAmount(arrivalDate, departureDate, roomType, numberOfGuests);
        const form = document.getElementById('booking-form');

  // Validate form data
  if (!name || !email || !phone || !arrivalDate || !departureDate || !roomType || !numberOfGuests  || !tripType) {
    alert('Please fill in all required fields.');
    return;
  }

  // Create a new booking object
  const booking = {
    name,
    email,
    phone,
    arrivalDate,
    departureDate,
    roomType, tripType,
    numberOfGuests,
    specialRequests,
          roomAmount
  };

  // Add the new booking to the bookings array
  bookings.push(booking);

  // Store the bookings array in local storage
  localStorage.setItem('bookings', JSON.stringify(bookings));

  // Display booking receipt and confirmation message
  displayBookingReceipt(booking);
        // Display confirmation message
alert('Booking successful!');
  form.reset();
});

viewBookingsButton.addEventListener('click', () => {
  // Retrieve the bookings array from local storage
  const storedBookings = localStorage.getItem('bookings');
  if (storedBookings) {
    bookings = JSON.parse(storedBookings);

    // Display bookings in a modal popup
    const modalHtml = `
      <div class="modal fade" id="bookingsModal" tabindex="-1" role="dialog" aria-labelledby="bookingsModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="bookingsModalLabel">Bookings</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ${bookings.map((booking, index) => `
                <h6>Booking ${index + 1}</h6>
                <p>Name: ${booking.name}</p>
                <p>Email: ${booking.email}</p>
                <p>Phone: ${booking.phone}</p>
                <p>Arrival Date: ${booking.arrivalDate}</p>
                <p>Departure Date: ${booking.departureDate}</p>
                <p>Room Type: ${booking.roomType}</p>
                <p>Number of Guests: ${booking.numberOfGuests}</p>
                <p>Travel Reason: ${booking.tripType}</p>
                <p>Special Requests: ${booking.specialRequests}</p>
                <p>Room Amount: ${booking.roomAmount}</p>
                <button type="button" class="btn btn-danger" id="cancel-booking-${index}">Cancel Booking</button>
                <button type="button" class="btn btn-primary" id="cancel-booking-${index}">Cancel Booking</button>
                <hr>
              `).join('')}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
    $('#bookingsModal').modal('show');

    // Cancel booking button event listeners
    bookings.forEach((booking, index) => {
      const cancelBookingButton = document.getElementById(`cancel-booking-${index}`);
      cancelBookingButton.addEventListener('click', () => {
        // Remove the booking from the bookings array
        bookings.splice(index, 1);
        // Update the bookings array in local storage
        localStorage.setItem('bookings', JSON.stringify(bookings));
        // Hide the modal
        $('#bookingsModal').modal('hide');
        // Display a confirmation message
        alert('Booking cancelled successfully!');
      });
    });
  } else {
    alert('No bookings found.');
  }
});

// Display booking receipt and confirmation message
function displayBookingReceipt(booking, roomAmount) {
    const receiptHtml = `
        <h2>Booking Receipt</h2>
        <p>Name: ${booking.name}</p>
        <p>Email: ${booking.email}</p>
        <p>Phone: ${booking.phone}</p>
        <p>Arrival Date: ${booking.arrivalDate}</p>
        <p>Departure Date: ${booking.departureDate}</p>
        <p>Room Type: ${booking.roomType}</p>
        <p>Number of Guests: ${booking.numberOfGuests}</p>
        <p>Special Requests: ${booking.specialRequests}</p>
        <p>Room Amount: ${roomAmount}</p>
    `;
    bookingReceiptDiv.innerHTML = receiptHtml;
    bookingReceiptDiv.style.display = 'block';

}