// This JS file is for managing data ---------------------------//

/// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {
	getAuth,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import {
	getDatabase,
	ref,
	set,
	update,
	child,
	get,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBg2zApspKowyOwlIuz7voq2549cgjbIQw",
  authDomain: "fir-intro-demo.firebaseapp.com",
  databaseURL: "https://fir-intro-demo-default-rtdb.firebaseio.com",
  projectId: "fir-intro-demo",
  storageBucket: "fir-intro-demo.appspot.com",
  messagingSenderId: "491851960615",
  appId: "1:491851960615:web:d69b821b480f13b4f35902"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

///initialize authentication
const auth = getAuth();

//initialize database
const db = getDatabase();

// --------------------- Get reference values -----------------------------
let userLink = document.getElementById("userLink");
let signOutLink = document.getElementById("signOut");
let welcome = document.getElementById("welcome");
let currentUser = null;

// ----------------------- Get User's Name'Name ------------------------------
function getUsername() {
	//grab value for key logged in switch
	let keeptLoggedIn = localStorage.getItem("keepLoggedIn");

	if (keeptLoggedIn == "yes") {
		currentUser = JSON.parse(localStorage.getItem("user"));
	} else {
		currentUser = JSON.parse(sessionStorage.getItem("user"));
	}

	currentUser = currentUser.accountInfo;
}

// Sign-out function that will remove user info from local/session storage and sign-out from FRD
function signOutUser() {
	// Clear session and localStorage
	sessionStorage.removeItem("user");
	localStorage.removeItem("user");
	localStorage.removeItem("keepLoggedIn");

	signOut(auth)
		.then(() => alert("Sign out successful"))
		.catch((error) => alert(`Error: ${error.code} - ${error.message}`));
}

// ------------------------Set (insert) data into FRD ------------------------
function setData(trialNum, temp, sg, brix, mass, userID) {
	// Set the data
	set(ref(db, `users/${userID}/data/${trialNum}`), {
		[temp]: { sg, brix, mass }
	})
		.then(() => {
			alert("Data saved successfully!");
		})
		.catch((error) => {
			alert(`Error: ${error.code} - ${error.message}`);
		});
}

document.getElementById("set").onclick = function () {
	const trialNum = document.getElementById("trialNum").value;
	const temp = document.getElementById("temp").value;
	const sg = document.getElementById("sg").value;
	const brix = document.getElementById("brix").value;
	const mass = document.getElementById("mass").value;
	const userID = currentUser.uid;

	setData(trialNum, temp, sg, brix, mass, userID);
};

// -------------------------Update data in database --------------------------
function updateData(trialNum, temp, sg, brix, mass, userID) {
	// Update the data
	update(ref(db, `users/${userID}/data/${trialNum}`), {
		[temp]: { sg, brix, mass }
	})
		.then(() => {
			alert("Data updated successfully!");
		})
		.catch((error) => {
			alert(`Error: ${error.code} - ${error.message}`);
		});
}

document.getElementById("update").onclick = function () {
	const trialNum = document.getElementById("trialNum").value;
	const temp = document.getElementById("temp").value;
	const sg = document.getElementById("sg").value;
	const brix = document.getElementById("brix").value;
	const mass = document.getElementById("mass").value;
	const userID = currentUser.uid;

	updateData(trialNum, temp, sg, brix, mass, userID);
};

// -------------------------Get a datum from database --------------------------

// Get a datum function call
function getDatum(userID, year, month, day) {
	// Get the data
	let trialVal = document.getElementById("trialVal");
	let tempVal = document.getElementById("tempVal");
	let sgVal = document.getElementById("sgVal");
	let brixVal = document.getElementById("brixVal");
	let massVal = document.getElementById("massVal");

	const dbref = ref(db);

	get(child(dbref, `users/${userID}/data/${trialNum}/${temp}`))
		.then((snapshot) => {
			if (snapshot.exists()) {
				trialVal.textContent = trialNum;
				tempVal.textContent = temp;
				sgVal.textContent = snapshot.val();
				brixVal.textContent = snapshot.val();
				massVal.textContent = snapshot.val();
			} else {
				alert("No data available");
			}
		})
		.catch((error) => {
			alert(`Error: ${error.code} - ${error.message}`);
		});
}

document.getElementById("get").onclick = function () {
	const trialNum = document.getElementById("getTrial").value;
	const temp = document.getElementById("getTemp").value;

	getDatum(currentUser.uid, trialNum, temp);
}

// Get a data set function call
async function getDataSet(userID, temp){
	let tempVal = document.getElementById('setTempVal');
	//let monthVal = document.getElementById('setMonthVal');

	tempVal.textContent = `Temperature: ${temp}`;
	//monthVal.textContent = `Month: ${month}`;

	const temps = []
	const sg = []
	const brix = []
	const mass = []
	const tbodyEL = document.getElementById('tbody-2'); //select <tbody> from table

	const dbref = ref(db);

	//wait for data to be pulled from FRD
	//provide path through the nodes to the data
	await get(child(dbref, 'users/' + userID + '/data/' + trialNum + '/' + temp)).then((snapshot)=>{
		if(snapshot.exists()){
			console.log(snapshot.val());

			snapshot.forEach(child =>{
				console.log(child.key, child.val());
				// push values to the correct arrays
				temps.push(child.key);
				sg.push(child.val());
				brix.push(child.val());
				mass.push(child.val());
			});
		}
		else{
			alert('No data found')
		}
	})
	.catch((error)=>{
		alert('unsuccessful, error ' + error);
	})

	//dynamically add table rows to HTML
	for(let i = 0; i < days.length; i++){
		addItemToTable(days[i], temps[i], tbodyEL)
	}
}

//add an item to the table
function addItemToTable(day, temp, tbody){
	console.log(day, temp);
	let tRow = document.createElement("tr")		//create table row
	let td1 = document.createElement("td")		//column 1
	let td2 = document.createElement("td")		//column 2

	td1.innerHTML = day;
	td2.innerHTML = temp;

	tRow.appendChild(td1)
	tRow.appendChild(td2)

	tbody.appendChild(tRow);
}

//call data set function
document.getElementById('getDataSet').onclick = function(){
	const year = document.getElementById('getSetYear').value;
	const month = document.getElementById('getSetMonth').value;
	const userID = currentUser.uid;

	getDataSet(userID, year, month);
}

// Delete a single day's data function call
function deleteData(userID, year, month, day){
	remove(ref(db, 'users/' + '/data/' + year + '/' + month + '/' + day))
	.then(()=>{
		alert('Data removed successfully.');
	})
	.catch((error)=>{
		alert('unsuccessful, error: ' + error);
	});
}

//call delete data function
document.getElementById('delete').onclick = function(){
	const year = document.getElementById('delYear').value;
	const month = document.getElementById('delMonth').value;
	const day = document.getElementById('delDay').value;
	const userID = currentUser.uid;

	deleteData(userID, year, month, day);
}

// --------------------------- Home Page Loading -----------------------------

window.onload = function () {
	getUsername();

	if (currentUser == null) {
		userLink.innerText = "Create New Account";
		userLink.classList.replace("nav-link", "btn");
		userLink.classList.add("btn-primary");
		userLink.href = "register.html";

		signOutLink.innerText = "Sign In";
		signOutLink.classList.replace("nav-link", "btn");
		signOutLink.classList.add("btn-success");
		signOutLink.href = "signIn.html";
	} else {
		console.log(currentUser);

		userLink.innerText = currentUser.firstName;
		welcome.innerText = "Welcome, " + currentUser.firstName;
		userLink.classList.replace("btn", "nav-link");
		userLink.classList.add("btn-primary");
		userLink.href = "#";

		signOutLink.innerText = "Sign Out";
		signOutLink.classList.replace("btn", "nav-link");
		signOutLink.classList.add("btn-success");
		signOutLink.addEventListener("click", (e) => {
			e.preventDefault();
			signOutUser();
		});
	}
};
