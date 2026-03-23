const form = document.getElementById("form");
const list = document.getElementById("list");
const search = document.getElementById("search");
const filter = document.getElementById("filter");

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
let editIndex = -1;

const prices = {
  Single: 50,
  Double: 80,
  Deluxe: 120,
  Suite: 200
};

function daysBetween(a, b) {
  return (new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24);
}

function isAvailable(room, checkIn, checkOut, index = -1) {
  return !bookings.some((b, i) => {
    if (i === index) return false;
    return b.room === room && !(checkOut <= b.checkIn || checkIn >= b.checkOut);
  });
}

function render() {
  list.innerHTML = "";
  let total = 0;

  let filtered = bookings.filter(b =>
    b.name.toLowerCase().includes(search.value.toLowerCase()) &&
    (filter.value === "" || b.room === filter.value)
  );

  filtered.forEach((b, i) => {
    list.innerHTML += `
      <tr>
        <td>${b.name}</td>
        <td>${b.room}</td>
        <td>${b.days}</td>
        <td>$${b.price}</td>
        <td>
          <button class="edit" onclick="edit(${i})">Edit</button>
          <button class="delete" onclick="del(${i})">Delete</button>
        </td>
      </tr>
    `;
    total += b.price;
  });

  document.getElementById("totalBookings").innerText = filtered.length;
  document.getElementById("totalRevenue").innerText = total;

  localStorage.setItem("bookings", JSON.stringify(bookings));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const room = document.getElementById("room").value;
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  if (checkOut <= checkIn) return alert("Invalid dates");

  if (!isAvailable(room, checkIn, checkOut, editIndex)) {
    return alert("Room not available");
  }

  const days = daysBetween(checkIn, checkOut);
  const price = days * prices[room];

  const booking = { name, room, checkIn, checkOut, days, price };

  if (editIndex === -1) {
    bookings.push(booking);
  } else {
    bookings[editIndex] = booking;
  }

  editIndex = -1;
  form.reset();
  render();
});

function del(i) {
  bookings.splice(i, 1);
  render();
}

function edit(i) {
  const b = bookings[i];
  document.getElementById("name").value = b.name;
  document.getElementById("room").value = b.room;
  document.getElementById("checkIn").value = b.checkIn;
  document.getElementById("checkOut").value = b.checkOut;
  editIndex = i;
}

search.addEventListener("input", render);
filter.addEventListener("change", render);

render();