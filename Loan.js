let users = JSON.parse(localStorage.getItem("users")) || [];


window.onload = function () {
    renderUsers();
};


function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function checkStrength() {

    const pw = document.getElementById("userPassword").value;
    const bar = document.getElementById("strengthBar");

    let score = 0;

    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    let width = score * 25;

    bar.style.width = width + "%";

    if (score <= 1)
        bar.style.background = "red";
    else if (score <= 2)
        bar.style.background = "orange";
    else
        bar.style.background = "lime";
}

function addUser() {

    const id = document.getElementById("userId").value;
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const pw = document.getElementById("userPassword").value;
    const cpw = document.getElementById("confirmPassword").value;
    const image = document.getElementById("userImage").files[0];

    if (!id || !name || !email || !pw) {
        alert("Fill all fields");
        return;
    }

    if (pw !== cpw) {
        alert("Passwords do not match");
        return;
    }

   
    if (users.some(user => user.id === id)) {
        alert("User ID already exists");
        return;
    }

    if (image) {

        const reader = new FileReader();

        reader.onload = function (e) {

            users.push({
                id: id,
                name: name,
                email: email,
                image: e.target.result
            });

            saveUsers();
            renderUsers();

            alert("User Added");

            clearForm();
        };

        reader.readAsDataURL(image);

    } else {

        users.push({
            id: id,
            name: name,
            email: email,
            image: "https://via.placeholder.com/150"
        });

        saveUsers();
        renderUsers();

        alert("User Added");

        clearForm();
    }
}

function renderUsers() {

    const list = document.getElementById("userList");

    list.innerHTML = "";

    users.forEach(user => {

        list.innerHTML += `
        <div class="user-card">

            <img src="${user.image}" alt="${user.name}" width="150">

            <h3>${user.name}</h3>

            <p>ID: ${user.id}</p>

            <p>Email: ${user.email}</p>

            <button onclick="deleteUser('${user.id}')">
                Delete
            </button>

        </div>
        `;
    });
}

function deleteUser(id) {

    if (!confirm("Delete this user?")) {
        return;
    }

    users = users.filter(user => user.id !== id);

    saveUsers();
    renderUsers();
}

function searchUser() {

    const id = document.getElementById("searchId").value;

    const result = document.getElementById("searchResult");

    const user = users.find(u => u.id === id);

    if (!user) {
        result.innerHTML = "<p>User not found</p>";
        return;
    }

    result.innerHTML = `
        <div class="user-card">

            <img src="${user.image}" width="150">

            <h3>${user.name}</h3>

            <p>ID: ${user.id}</p>

            <p>Email: ${user.email}</p>

        </div>
    `;
}

function generateSchedule() {

    const P = parseFloat(
        document.getElementById("loanAmount").value
    );

    const rate = parseFloat(
        document.getElementById("interestRate").value
    ) / 100 / 12;

    const months = parseInt(
        document.getElementById("loanTerm").value
    );

    if (!P || !rate || !months) {
        alert("Please enter all loan information");
        return;
    }

    const payment =
        (P * rate) /
        (1 - Math.pow(1 + rate, -months));

    let balance = P;

    const body =
        document.getElementById("scheduleBody");

    body.innerHTML = "";

    for (let i = 1; i <= months; i++) {

        const interest = balance * rate;
        const principal = payment - interest;

        balance -= principal;

        if (balance < 0) balance = 0;

        body.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>$${payment.toFixed(2)}</td>
            <td>$${interest.toFixed(2)}</td>
            <td>$${principal.toFixed(2)}</td>
            <td>$${balance.toFixed(2)}</td>
        </tr>
        `;
    }

    document.getElementById("loanSummary")
        .innerHTML = `
        <h3>
            Monthly Payment:
            $${payment.toFixed(2)}
        </h3>
    `;
}

function printLoanSchedule() {

    const summary =
        document.getElementById("loanSummary")
            .innerHTML;

    const table =
        document.querySelector("table")
            .outerHTML;

    const win =
        window.open("", "_blank");

    win.document.write(`
        <html>
        <head>
        <title>Loan Report</title>

        <style>

        body{
            font-family:Arial;
            padding:15px;
        }

        table{
            width:100%;
            border-collapse:collapse;
        }

        table,th,td{
            border:1px solid black;
        }

        th,td{
            padding:8px;
            text-align:center;
        }

        .group-name{
            margin-top:20px;
            font-size:18px;
            font-weight:bold;
        }

        </style>

        </head>
        <body>

        <h1>Loan Report</h1>

                ${summary}

            ${table} 
                <p>
                    <strong>Members:</strong>
                </p>

                <ul>
                    <li>Sangva Sokheng</li>
                    <li>Soy Somoun</li>
                    <li>Heng LyHong</li>
                    <li>Som Ponakboreachsakd</li>
                </ul>

            </div>
    `);

    win.document.close();
    win.print();
}

function clearForm() {

    document.getElementById("userId").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("userEmail").value = "";
    document.getElementById("userPassword").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("userImage").value = "";

    document.getElementById("strengthBar").style.width = "0%";
}