function signup(role) {
  let firstName = document.getElementById("firstName").value;
  let verifFirstName = firstName.length > 4;
  displayErrors(
    verifFirstName,
    "firstNameError",
    "first name should have at least 5 characters"
  );

  let lastName = document.getElementById("lastName").value;
  let verifLastName = lastName.length > 3;
  displayErrors(
    verifLastName,
    "lastNameError",
    "last name should have at least 4 characters"
  );

  let email = document.getElementById("email").value;
  let verifEmail = validateEmail(email);
  displayErrors(verifEmail, "emailError", "E-mail Invalid");

  let password = document.getElementById("password").value;

  let address = "";
  let verifAddress = true;

  if (role !== "admin") {
    address = document.getElementById("address").value;
    verifAddress = address.length > 4;
    displayErrors(
      verifAddress,
      "addressError",
      "Address should have at least 5 characters"
    );
  }

  let phone = document.getElementById("phone").value;
  let verifPhone = phone.length >= 8;
  displayErrors(
    verifPhone,
    "phoneError",
    "Phone number should have at least 8 numbers"
  );

  let fax = "";
  let verifFax = true;
  if (role === "owner") {
    fax = document.getElementById("fax").value;
    verifFax = fax.length >= 8;
    displayErrors(
      verifFax,
      "faxError",
      "Fax number should have at least 8 numbers"
    );
  }

  let patant = "";
  let verifPatant = true;

  if (role === "owner") {
    patant = document.getElementById("patant").value;
    verifPatant = patant.length >= 5;
    displayErrors(
      verifPatant,
      "patantError",
      "Patant should have at least 5 characters"
    );
  }

  console.log(verifAddress);
  if (
    verifFirstName &&
    verifLastName &&
    verifEmail &&
    verifPhone &&
    verifPatant &&
    verifFax &&
    verifAddress
  ) {
    //JSON.parse => convert string  to object JSON
    let userId = JSON.parse(localStorage.getItem("userId") || "1");
    let userTable = JSON.parse(localStorage.getItem("users") || "[]");
    let data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      address: address,
      phone: phone,
      fax: fax,
      patant: patant,
      role: role,
    };
    data.id = userId;
    userTable.push(data);
    //JSON.stringify => convert object JSON to string
    localStorage.setItem("users", JSON.stringify(userTable));
    localStorage.setItem("userId", JSON.stringify(userId + 1));
    location.replace("login.html");
  }
}

function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let users = getFromLS("users");
  let role;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      role = users[i].role;
      localStorage.setItem("connectedUser", JSON.stringify(users[i].id));
    }
  }
  if (role === "admin") {
    window.location = "index.html";
  } else if (role === "owner") {
    window.location = "add-house.html";
  } else if (role === "user") {
    window.location = "index.html";
  } else {
    displayErrors(false, "loginError", "invalid data");
  }
}

// Header
function displayHeader() {
  let idConnectedUser = getFromLS("connectedUser");
  let header = ``;

  if (typeof idConnectedUser.value === "undefined") {
    console.log(typeof idConnectedUser.value === "undefined");
    header = `
  <div class="navbar-nav ml-auto py-0">
                            <a href="index.html" class="nav-item nav-link active">Home</a>
                            <a href="about.html" class="nav-item nav-link">About</a>
                           
                            <div class="nav-item dropdown">
                                <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">Sign Up</a>
                                <div class="dropdown-menu border-0 rounded-0 m-0">
                                    <a href="signUpUser.html" class="dropdown-item">User Sign Up</a>
                                    <a href="signUpOwner.html" class="dropdown-item">Owner Sign Up</a>
                                </div>
                            </div>
                            <a href="login.html" class="nav-item nav-link">Login</a>
    
                            <a href="contact.html" class="nav-item nav-link">Contact</a>
                        </div>`;
  }

  if (idConnectedUser > 0) {
    let user = searchById("users", idConnectedUser);

    if (user.role === "admin") {
      header = ` <div class="navbar-nav ml-auto py-0">
                            <a href="index.html" class="nav-item nav-link active">Home</a>
                            <a href="about.html" class="nav-item nav-link">About</a>
                           
                            <div class="nav-item dropdown">
                                <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">Admin Dashbord<span id='ReservNotifications' class="badge badge-danger"></span></a>
                                <div class="dropdown-menu border-0 rounded-0 m-0">
                                <a href="users.html" class="dropdown-item">Users</a>
                                <a href="admin-houses.html" class="dropdown-item">Houses</a>
                                <a href="admin-rooms.html" class="dropdown-item">Rooms</a>
                                <a href="admin-booking.html" class="dropdown-item">Reservations<span id='RNotifications' class="badge badge-danger"></span></a>
                                </div>
                            </div>
                            <button class="btn btn-primary py-3 px-4" type="button" onclick="logout()">Logout</button>    
                            <a href="contact.html" class="nav-item nav-link">Contact</a>
                        </div>`;
    }
    if (user.role === "user") {
      header = ` <div class="navbar-nav ml-auto py-0">
      <a href="index.html" class="nav-item nav-link active">Home</a>
      <a href="guestHouses.html" class="nav-item nav-link">Houses</a>
      <a href="bookings.html" class="nav-link">Bookings</a>
      <button class="btn btn-primary py-3 px-4" type="button" onclick="logout()">Logout</button>

      <a href="contact.html" class="nav-item nav-link">Contact</a>
  </div>`;
    }
    if (user.role === "owner") {
      header = ` <div class="navbar-nav ml-auto py-0">
      <a href="index.html" class="nav-item nav-link active">Home</a>
      <a href="guestHouses.html" class="nav-item nav-link">Houses</a>
     
      <div class="nav-item dropdown">
          <a href="#" class="nav-link dropdown-toggle"  data-toggle="dropdown">Manage Properties<span id='ReservNotifications' class="badge badge-danger"></span></a>
          <div class="dropdown-menu border-0 rounded-0 m-0">
              <a href="housesTable.html" class="dropdown-item">Houses Table</a>
              <a href="add-house.html" class="dropdown-item">Add Houses</a>
              <a href="add-room.html" class="dropdown-item">Add Rooms</a>
              <a href="owner-bookings.html" class="dropdown-item">Reservations<span id='RNotifications' class="badge badge-danger"></span></a>
              
          </div>
      </div>

      <button class="btn btn-primary py-3 px-4" type="button" onclick="logout()">Logout</button>

      <a href="contact.html" class="nav-item nav-link">Contact</a>
  </div>`;
    }
  }
  document.getElementById("displayHeader").innerHTML = header;
}

// adding houses and rooms section
function addHouse() {
  let houseName = document.getElementById("houseName").value;
  let cityName = document.getElementById("cityName").value;
  let houseAdd = document.getElementById("houseAdd").value;
  let houseView = document.getElementById("houseView").value;
  let houseImg = document.getElementById("houseImg").value;
  let ownerId = getFromLS("connectedUser");

  let housesTable = getFromLS("houses");
  let houseId = JSON.parse(localStorage.getItem("houseId") || "1");
  let data = {
    ownerID: ownerId,
    houseID: houseId,
    houseName: houseName,
    cityName: cityName,
    houseAdd: houseAdd,
    houseView: houseView,
    houseImg: houseImg,
  };

  let houseCount = 0;
  for (let i = 0; i < housesTable.length; i++) {
    if (housesTable[i].ownerID === ownerId) {
      houseCount++;
    }
  }
  console.log(houseCount);
  if (houseCount < 3) {
    housesTable.push(data);

    localStorage.setItem("houses", JSON.stringify(housesTable));
    localStorage.setItem("houseId", JSON.stringify(houseId + 1));
  } else {
    document.getElementById("maxHousesError").innerHTML =
      "You have reached your maximum number of houses";
  }
}
function addRoom() {
  let roomName = document.getElementById("roomName").value;
  let description = document.getElementById("description").value;
  let roomPrice = document.getElementById("roomPrice").value;
  let capacity = document.getElementById("capacity").value;
  let roomImg = document.getElementById("roomImg").value;
  let houseId = getvalue();

  console.log(houseId, "house Id");

  let roomsTable = JSON.parse(localStorage.getItem("rooms") || "[]");
  let roomId = JSON.parse(localStorage.getItem("roomId") || "1");
  let data = {
    houseId: houseId,
    roomId: roomId,
    roomName: roomName,
    description: description,
    roomPrice: roomPrice,
    capacity: capacity,
    roomImg: roomImg,
  };

  let roomCount = 0;
  for (let i = 0; i < roomsTable.length; i++) {
    if (roomsTable[i].houseId === houseId) {
      roomCount++;
    }
  }
  console.log(roomCount, "rooms counter");
  if (roomCount < 10) {
    roomsTable.push(data);

    localStorage.setItem("rooms", JSON.stringify(roomsTable));
    localStorage.setItem("roomId", JSON.stringify(roomId + 1));
    location.reload();
  } else {
    document.getElementById("maxHousesError").innerHTML =
      "You have reached your maximum number of rooms";
  }
}
function displayHouseSelection() {
  let houses = getFromLS("houses");
  let connectedUser = getFromLS("connectedUser");
  let selection = ``;
  for (let i = 0; i < houses.length; i++) {
    if (houses[i].ownerID === connectedUser) {
      selection += `
      <option  value="${houses[i].houseID}">${houses[i].houseName}</option> 
      
                                    
 `;
    }
  }
  document.getElementById("selectedHouses").innerHTML = selection;
}
function getvalue() {
  let select = document.getElementById("selectedHouses");
  let value = select.value;
  let text = select.options[select.selectedIndex].text;

  return value;
}
// adding houses and rooms section end

// display Houses Table
function displayHouses() {
  let houses = getFromLS("houses");

  let connectedUser = getFromLS("connectedUser");

  let trHouses = ``;

  for (let i = 0; i < houses.length; i++) {
    if (houses[i].ownerID == connectedUser) {
      trHouses =
        trHouses +
        ` 
    <tr>
    <th scope="row">${houses[i].houseID}</th>
    <td><img style="width:100px; height: 60px" src="${houses[i].houseImg}" alt=""></td>
    <td>${houses[i].houseName}</td>
    <td>${houses[i].cityName}</td>
    <td>${houses[i].houseAdd}</td>
    
    <td>     
    <button type="button" onclick="deleteObjectRooms('houses','rooms',${i})" class="btn btn-danger">
       <i class="fa fa-trash"></i>
    </button>
    </td>
    <td>     
    <button type="button" onclick="navigateToPage('edit-house.html', ${houses[i].houseID} ,'houseToEdit')" class="btn btn-info">
    <i class="fa fa-home"></i></button>
    </td>
    <td> 
    <button type="button" onclick="navigateToPage('rooms-table.html', ${houses[i].houseID} ,'RoomsToEdit')" class="btn btn-success">
    <i class="fa fa-bed"></i>
    </button>
    </td>
    </tr>  
     `;
    }
  }
  document.getElementById("housesTable").innerHTML = trHouses;
}
function displayAdminHouses() {
  let houses = getFromLS("houses");
  let trHouses = ``;

  for (let i = 0; i < houses.length; i++) {
    trHouses =
      trHouses +
      ` 
    <tr>
    <th scope="row">${houses[i].houseID}</th>
    <td><img style="width:100px; height: 60px" src="${houses[i].houseImg}" alt=""></td>
    <td>${houses[i].houseName}</td>
    <td>${houses[i].cityName}</td>
    <td>${houses[i].houseAdd}</td>
    
    <td>     
    <button type="button" onclick="deleteObjectRooms('houses','rooms',${i})" class="btn btn-danger">
       <i class="fa fa-trash"></i>
    </button>
    </td>
    <td> 
    <button type="button" onclick="navigateToPage('rooms-table.html', ${houses[i].houseID} ,'RoomsToEdit')" class="btn btn-info">
       <i class="fa fa-edit background-warning"></i>
    </button>
    </td>
    </tr>  
     `;
  }

  document.getElementById("admin-houses").innerHTML = trHouses;
}
// display Houses Table end

function displayTableRooms() {
  let rooms = getFromLS("rooms");
  let HouseID = getFromLS("RoomsToEdit");

  let trRooms = ``;
  console.log(HouseID);

  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].houseId == HouseID) {
      trRooms =
        trRooms +
        ` 
    <tr>
    <th scope="row">${rooms[i].roomId}</th>
    <td><img style="width:100px; height: 70px" src="${rooms[i].roomImg}" alt=""></td>
    <td>${rooms[i].roomName}</td>
    <td>${rooms[i].capacity}</td>
    <td>${rooms[i].roomPrice}</td>
   
    
    <td>     
    <button type="button" onclick="deleteObject('rooms',${i})" class="btn btn-danger">
       <i class="fa fa-trash"></i>
    </button>
    </td>
    <td>     
    <button type="button" onclick="navigateToPage('edit-room.html', ${rooms[i].roomId} ,'roomsToEdit')" class="btn btn-info">
       <i class="fa fa-edit"></i>
    </button>
    </td>
    <td>  
     `;
    }
  }
  document.getElementById("roomsTable").innerHTML = trRooms;
}

function displayAdminRooms() {
  let rooms = getFromLS("rooms");
  let HouseID = getFromLS("RoomsToEdit");

  let trRooms = ``;
  console.log(rooms.houseId);
  console.log(HouseID);

  for (let i = 0; i < rooms.length; i++) {
    trRooms =
      trRooms +
      ` 
    <tr>
    <th scope="row">${rooms[i].roomId}</th>
    <td><img style="width:100px; height:70px" src="${rooms[i].roomImg}" alt=""></td>
    <td>${rooms[i].roomName}</td>
    <td>${rooms[i].capacity}</td>
    <td>${rooms[i].roomPrice}</td>
    
    <td>     
    <button type="button" onclick="deleteObject('rooms',${i})" class="btn btn-danger">
       <i class="fa fa-trash"></i>
    </button>
    </td>
    <td>  
     `;
  }

  document.getElementById("admin-rooms").innerHTML = trRooms;
}

function displayTableReservations() {
  let rooms = getFromLS("rooms");
  let reservation = getFromLS("reservations");
  let userId = getFromLS("connectedUser");

  let trRooms = ``;

  for (let j = 0; j < reservation.length; j++) {
    for (let i = 0; i < rooms.length; i++) {
      if (
        rooms[i].roomId == reservation[j].roomId &&
        userId == reservation[j].userId
      ) {
        trRooms =
          trRooms +
          ` 
    <tr>
    <td><img style="width:100px; height:70px" src="${rooms[i].roomImg}" alt=""></td>
    <td>${rooms[i].roomName}</td>
    <td>${rooms[i].capacity}</td>
    <td>${rooms[i].roomPrice}</td>
    <td>${reservation[j].startDate}</td>
    <td>${reservation[j].endDate}</td>
    <td>${reservation[j].status}</td>
    
    <td>     
    <button type="button" onclick="deleteObject('reservations',${j})" class="btn btn-danger">
       <i class="fa fa-trash"></i>
    </button>
    </td>
    
    <tr>  
     `;
      }
    }
  }
  document.getElementById("roomsTable").innerHTML = trRooms;
}

function displayAdminReservations() {
  let rooms = getFromLS("rooms");
  let reservation = getFromLS("reservations");
  let connectedUser = getFromLS("connectedUser");
  let users = getFromLS("users");

  let trRooms = ``;

  for (let j = 0; j < reservation.length; j++) {
    for (let i = 0; i < rooms.length; i++) {
      for (let k = 0; k < users.length; k++) {
        if (rooms[i].roomId == reservation[j].roomId) {
          if (reservation[j].userId == users[k].id) {
            trRooms =
              trRooms +
              ` 
    <tr>
    <td><img style="width:100px; height:70px" src="${rooms[i].roomImg}" alt=""></td>
    <td>${rooms[i].roomName}</td>
    <td>${users[k].firstName}</td>
    <td>${rooms[i].roomPrice}</td>
    <td>${reservation[j].startDate}</td>
    <td>${reservation[j].endDate}</td>

    <td>${reservation[j].status}</td>
    
    <td>     
    <button type="button" onclick="deleteObject('reservations',${j})" class="btn btn-danger">
       <i class="fa fa-trash"></i>
    </button>
    </td>
    <td>     
    <button type="button" onclick="confirmReservation(${j})" class="btn btn-success">
    <i class="fa fa-check"></i>
    </button>
    </td>
    
     `;
          }
        }
      }
    }
  }

  document.getElementById("reservations").innerHTML = trRooms;
}

function displayOwnerReservations() {
  let rooms = getFromLS("rooms");
  let reservation = getFromLS("reservations");
  let connectedUser = getFromLS("connectedUser");
  let users = getFromLS("users");

  let trRooms = ``;

  for (let j = 0; j < reservation.length; j++) {
    for (let i = 0; i < rooms.length; i++) {
      for (let k = 0; k < users.length; k++) {
        if (rooms[i].roomId == reservation[j].roomId) {
          if (reservation[j].userId == users[k].id) {
            trRooms =
              trRooms +
              ` 
    <tr>
    <td><img style="width:100px; height:70px" src="${rooms[i].roomImg}" alt=""></td>
    <td>${rooms[i].roomName}</td>
    <td>${users[k].firstName}</td>
    <td>${rooms[i].capacity}</td>
    <td>${rooms[i].roomPrice}</td>
    <td>${reservation[j].status}</td>
    
    <td>     
    <button type="button" onclick="deleteObject('reservations',${j})" class="btn btn-danger">
       <i class="fa fa-trash"></i>
    </button>
    </td>
    <td>     
   
     `;
          }
        }
      }
    }
  }

  document.getElementById("reservations").innerHTML = trRooms;
}

// display Houses and rooms cards section
function DisplayGuestHouses(data) {
  let houses = data === undefined ? getFromLS("houses") : data;
  let innerHtml = ``;

  for (let i = 0; i < houses.length; i++) {
    innerHtml =
      innerHtml +
      `
      <div class="col-lg-4 col-md-6 mb-4">
                    
                    <div class="package-item bg-white mb-2">
                        <img class="img-fluid" src="${houses[i].houseImg}" alt="">
                        <div class="p-4">
                            <div class="d-flex justify-content-between mb-3">
                                <small class="m-0"><i class="fa fa-map-marker-alt text-primary mr-2"></i>${houses[i].cityName}</small>    
                               
                            </div>
                            <a class="h5 text-decoration-none" href="">${houses[i].houseName}</a>
                            <p>${houses[i].houseView}</p>
                            <h6 class="m-0"><i class="fas fa-map text-primary"></i> ${houses[i].houseAdd}</h6>
                            <div class="border-top mt-4 pt-4">
                               
                                <div class="d-flex justify-content-center">
                                   
                                   <a href="rooms.html"><button onclick="navigateTo(${houses[i].houseID}, 'roomHouseId')" class="btn btn-primary btn-block" type="button" style="height: 47px; margin-top: -2px;">Check Available Rooms</button></a> 

                                </div>
                               
                            </div>
                        </div>
                    </div>
                </div>
    `;
  }

  document.getElementById("displayHouses").innerHTML = innerHtml;
}

function DisplayRooms(data) {
  let rooms = data === undefined ? getFromLS("rooms") : data;
  let innerHtml = ``;
  let reservation = getFromLS("reservations");

  let houseId = getFromLS("roomHouseId");
  let reservationIds = [];
  for (let j = 0; j < reservation.length; j++) {
    reservationIds.push(reservation[j].roomId);
  }

 

  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].houseId == houseId) {
      // if (!reservationIds.includes(rooms[i].roomId)) {
        innerHtml =
          innerHtml +
          `
      <div class="col-lg-4 col-md-6 mb-4">
                    <div class="package-item bg-white mb-2">
                    <div class="img-container">
                    <img class="img-fluid" src="${rooms[i].roomImg}" alt="">
                  </div>
                        <div class="p-4">
                            <div class="d-flex justify-content-between mb-3">
                             
                                <small class="m-0"><i class="fa fa-user text-primary mr-2"></i>${rooms[i].capacity} Person</small>
                            </div>
                            <a class="h5 text-decoration-none" href="">${rooms[i].roomName}</a>
                            <p>${rooms[i].description}</p>
                            <div  class="border-top mt-4 pt-4">
                            <div class="">
                            


                            <div class="form-group">
  <label for="start">Start date:</label>
  <input type="date" id="startDate" onchange="getDate(date)" name="trip-start" value="2023-01-05" min="2023-01-01" max="2024-12-31">
</div>
                            <label for="start" >End date:</label>
                            <input type="date" onchange="getDate(date)" id="endDate" name="trip-start"value="2023-01-15"
                            min="2023-01-01" max="2024-12-31">
                            </div>

                       <div class="border-top mt-4 pt-4">
                                <div class="d-flex justify-content-between">
                                    <button class="btn btn-primary btn-small" onclick="createReservation('bookings.html', ${rooms[i].roomId},${rooms[i].capacity})" type="submit">Book a Room</button>
                                    <h5 class="m-0">$${rooms[i].roomPrice}</h5>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    `;
      }
    }
  // }

  document.getElementById("displayrooms").innerHTML = innerHtml;
}
// display Houses and rooms cards section end

function displayUsers() {
  let tableUsers = ``;
  let Users = getFromLS("users");
  for (let i = 0; i < Users.length; i++) {
    if (Users[i].role !== "admin") {
      tableUsers =
        tableUsers +
        ` 
      <tr>
      <th scope="row">${Users[i].id}</th>
      <td>${Users[i].firstName}</td>
      <td>${Users[i].lastName}</td>
      <td>${Users[i].email}</td>
      <td>${Users[i].password}</td>
      <td>${Users[i].role}</td>
      <td>     
      <button type="button" onclick="deleteObject('users',${i})" class="btn btn-danger">
         <i class="fa fa-trash"></i>
      </button>
      </td>
      </tr>  
       `;
    }
  }
  document.getElementById("table-users").innerHTML = tableUsers;
}

function navigateToPage(path, id, key) {
  localStorage.setItem(key, id);
  location.replace(path);
}

function getDate(date) {
  const startDateInput = document.getElementById(date);
  const startDateValue = startDateInput.value;
  return startDateValue

}

function createReservation(path, id, capacity) {
  let reservations = getFromLS("reservations");
  let userID = getFromLS("connectedUser");
  let reservationsId = JSON.parse(localStorage.getItem("reservationId") || "1");
  let startDate =getDate('startDate');
  let endDate = getDate('endDate');
  let Capacity = capacity;

  // Check if the selected date range overlaps with any existing bookings
  let overlap = false;
  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].roomId == id) {
      
    
    let reservation = reservations[i];
    let bookingStartDate = reservation.startDate;
    let bookingEndDate = reservation.endDate;
 
    if (startDate <= bookingEndDate && endDate >= bookingStartDate) {
      overlap = true
       
      break;
    }
  }
}
  // If there is an overlap, display an error message and return
  if (overlap) {
    alert("This room is already booked for the selected date range.");
    return;
  } else{ 
    let data = {
      userId: userID,
      reservationsId: reservationsId,
      roomId: id,
      capacity: Capacity,
      startDate:startDate,
      endDate:endDate,
      status: "pending",
    };
  
    reservations.push(data);
  
    localStorage.setItem("reservations", JSON.stringify(reservations));
    localStorage.setItem("reservationId", JSON.stringify(reservationsId + 1));
    location.replace(path);

}
}


function confirmReservation(pos) {
  let reservation = getFromLS("reservations");
  let userID = reservation[pos].userId;
  let reservationsId = reservation[pos].reservationsId;
  let id = reservation[pos].roomId;
  let Capacity = reservation[pos].capacity;
  let startDate = reservation[pos].startDate;
  let endDate = reservation[pos].endDate;

  let status = "booked";

  console.log(reservation[pos].userId, "id");
  console.log(pos);

  let data = {
    userId: userID,
    reservationsId: reservationsId,
    roomId: id,
    capacity: Capacity,
    startDate:startDate,
    endDate:endDate,
    status: status,
  };


  reservation.splice(pos, 1, data);
  localStorage.setItem("reservations", JSON.stringify(reservation));
  location.reload();
}

function reservationNotification() {
  let reservations = getFromLS("reservations");
  let reservCount = 0;
  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].status != "booked") {
      reservCount++;
    }
  }
  console.log(reservCount);
  if (reservCount > 0) {
    document.getElementById("ReservNotifications").innerHTML = reservCount;
    document.getElementById("RNotifications").innerHTML = reservCount;
  } else {
    document.getElementById("ReservNotifications").innerHTML = "";
    document.getElementById("RNotifications").innerHTML = "";
  }
}

function NotificationOwnerResrv() {
  let reservations = getFromLS("reservations");
  let reservCount = 0;
  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].status != "booked") {
      reservCount++;
    }
  }
  console.log(reservCount);
  document.getElementById("ReservNotifications").innerHTML = reservCount;
  document.getElementById("RNotifications").innerHTML = reservCount;
}

function navigateTo(id, key) {
  localStorage.setItem(key, id);
}

function editInputHouse() {
  let idHouse = JSON.parse(localStorage.getItem("houseToEdit"));
  let house = JSON.parse(localStorage.getItem("houses") || "[]");
  for (let i = 0; i < house.length; i++) {
    if (house[i].houseID == idHouse) {
      document.getElementById("houseName").value = house[i].houseName;
      document.getElementById("cityName").value = house[i].cityName;
      document.getElementById("houseAdd").value = house[i].houseAdd;
      document.getElementById("houseView").value = house[i].houseView;
      document.getElementById("houseImg").value = house[i].houseImg;
    }
  }
}

function editHouse() {
  let idHouse = JSON.parse(localStorage.getItem("houseToEdit"));
  let houseName = document.getElementById("houseName").value;
  let cityName = document.getElementById("cityName").value;
  let houseAdd = document.getElementById("houseAdd").value;
  let houseView = document.getElementById("houseView").value;
  let houseImg = document.getElementById("houseImg").value;
  let ownerId = getFromLS("connectedUser");

  let data = {
    ownerID: ownerId,
    houseID: idHouse,
    houseName: houseName,
    cityName: cityName,
    houseAdd: houseAdd,
    houseView: houseView,
    houseImg: houseImg,
  };

  let houses = getFromLS("houses");
  let pos;
  for (let i = 0; i < houses.length; i++) {
    if (houses[i].houseID === idHouse) {
      pos = i;
    }
  }
  houses.splice(pos, 1, data);
  localStorage.setItem("houses", JSON.stringify(houses));
  location.replace("housesTable.html");
}

function searchHouses() {
  let search = document.getElementById("search").value;
  console.log(search);
  let houses = getFromLS("houses");
  let T = [];
  if (search === undefined) {
    T = houses;
  } else {
    for (let i = 0; i < houses.length; i++) {
      if (houses[i].houseName.toLowerCase().includes(search.toLowerCase())) {
        T.push(houses[i]);
      }
    }
  }

  DisplayGuestHouses(T);
}

function searchRooms() {
  let search = document.getElementById("search").value;
  console.log(search);
  let rooms = getFromLS("rooms");
  let T = [];
  if (search === undefined) {
    T = rooms;
  } else {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomName.toLowerCase().includes(search.toLowerCase())) {
        T.push(rooms[i]);
      }
    }
  }

  DisplayRooms(T);
}

function editInputRoom() {
  let idRoom = JSON.parse(localStorage.getItem("roomsToEdit"));
  let houses = getFromLS("houses");
  let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
  let houseName = "";
  for (let i = 0; i < rooms.length; i++) {
    for (let j = 0; j < houses.length; j++) {
      if (idRoom == houses[j].houseID) houseName = houses[j].houseName;
    }
    if (rooms[i].roomId == idRoom) {
      console.log(houseName);
      document.getElementById("houseName").innerHTML = houseName;
      document.getElementById("roomName").value = rooms[i].roomName;
      document.getElementById("description").value = rooms[i].description;
      document.getElementById("roomPrice").value = rooms[i].roomPrice;
      document.getElementById("capacity").value = rooms[i].capacity;
      document.getElementById("roomImg").value = rooms[i].roomImg;
    }
  }
}

function editRoom() {
  let rooms = getFromLS("rooms");
  let roomId = JSON.parse(localStorage.getItem("roomsToEdit"));
  let roomName = document.getElementById("roomName").value;
  let description = document.getElementById("description").value;
  let roomPrice = document.getElementById("roomPrice").value;
  let capacity = document.getElementById("capacity").value;
  let roomImg = document.getElementById("roomImg").value;
let houseID = function houseId() {
   let idhouse=''
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomId == roomId) {
       idhouse = rooms[i].houseId;
      }

    }
    return idhouse;
  };

console.log(houseID())

  let data = {
    houseId: houseID(),
    roomId: roomId,
    roomName: roomName,
    description: description,
    roomPrice: roomPrice,
    capacity: capacity,
    roomImg: roomImg,
  };

  let pos;
  for (let i = 0; i < rooms.length; i++) {
    
    if (rooms[i].houseId == houseID()) {
      pos = i;
    }
  }
  rooms.splice(pos, 1, data);
  localStorage.setItem("rooms", JSON.stringify(rooms));
  location.replace("rooms-table.html");
}

function searchHouses() {
  let search = document.getElementById("search").value;
  console.log(search);
  let houses = getFromLS("houses");
  let T = [];
  if (search === undefined) {
    T = houses;
  } else {
    for (let i = 0; i < houses.length; i++) {
      if (houses[i].houseName.toLowerCase().includes(search.toLowerCase())) {
        T.push(houses[i]);
      }
    }
  }

  DisplayGuestHouses(T);
}

function logout() {
  localStorage.removeItem("connectedUser");
  location.replace("login.html");
}

// **************** generique fn start*************
function validateEmail(email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

function validatePassword(password) {}

function displayErrors(condition, id, msgErr) {
  if (condition === false) {
    document.getElementById(id).innerHTML = msgErr;
    document.getElementById(id).style.color = "red";
  } else {
    document.getElementById(id).innerHTML = "";
  }
}

function searchById(key, id) {
  let T = JSON.parse(localStorage.getItem(key) || "[]");
  for (let i = 0; i < T.length; i++) {
    if (T[i].id === id) {
      return T[i];
    }
  }
}

function getFromLS(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function deleteObject(key, position) {
  let houses = getFromLS(key);
  houses.splice(position, 1);
  localStorage.setItem(key, JSON.stringify(houses));
  location.reload();
}
// **************** generique fn end*************

let connectedUser = getFromLS("connectedUser");

function searchById(key, id) {
  let T = JSON.parse(localStorage.getItem(key) || "[]");
  for (let i = 0; i < T.length; i++) {
    if (T[i].id === id) {
      return T[i];
    }
  }
}

// function deleteObjectRooms(houseKey,roomKey,position) {
//   let houses = getFromLS(houseKey);
//   let rooms = getFromLS(roomKey);

//   for (let i = 0; i < rooms.length; i++) {
//     if(houses[position].houseID == rooms[i].houseId) {
//      console.log(rooms[i])

// }
// // rooms.splice(rooms.indexOf(rooms[i]), 1)
// }

// // houses.splice(position, 1)
//   localStorage.setItem(houseKey, JSON.stringify(houses));
//   localStorage.setItem(roomKey, JSON.stringify(rooms));

//  }

function deleteObjectRooms(houseKey, roomKey, position) {
  let houses = getFromLS(houseKey);
  let rooms = getFromLS(roomKey);

  // Get the houseId for the house at the specified position
  let houseID = houses[position].houseID;

  console.log(houseID, "HOUSE ID");

  // Remove all rooms with the same houseId
  let newRooms = rooms.filter(function (room) {
    console.log(room.houseId, "ALL ROOMS ID");
    return room.houseId != houseID;
  });

  console.log(newRooms, "NEW ROOMS ARRAY");
  // Update the rooms in local storage
  localStorage.setItem(roomKey, JSON.stringify(newRooms));

  // Remove the house from the houses array
  houses.splice(position, 1);

  // Update the houses in local storage
  localStorage.setItem(houseKey, JSON.stringify(houses));

  location.reload();
}
