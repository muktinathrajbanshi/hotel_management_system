const form = document.getElementById("bookingForm");
const bookingList = document.getElementById("bookingList");

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

function displayBookings() {

bookingList.innerHTML = "";

bookings.forEach((booking,index)=>{

let row = `
<tr>
<td>${booking.name}</td>
<td>${booking.room}</td>
<td>${booking.checkIn}</td>
<td>${booking.checkOut}</td>
<td><button class="delete-btn" onclick="deleteBooking(${index})">Delete</button></td>
</tr>
`;

bookingList.innerHTML += row;

});

}

form.addEventListener("submit",(e)=>{

e.preventDefault();

const name = document.getElementById("guestName").value;
const room = document.getElementById("roomType").value;
const checkIn = document.getElementById("checkIn").value;
const checkOut = document.getElementById("checkOut").value;

const booking = {name,room,checkIn,checkOut};

bookings.push(booking);

localStorage.setItem("bookings",JSON.stringify(bookings));

displayBookings();

form.reset();

});
