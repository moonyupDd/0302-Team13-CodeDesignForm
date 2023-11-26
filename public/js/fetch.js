// Fetch contract data from server and populate the table
fetch("/contracts")
    .then((response) => response.json())
    .then((data) => {
        const tableBody = document.querySelector("#contractTable tbody");
        data.forEach((contract) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${contract.ID}</td>
            <td>${contract.Full_Contract_Code}</td>
            <td>${contract.Customer_Name}</td>
            <td>${contract.Year_Of_Birth}</td>
            <td>${contract.SSN}</td>
            <td>${contract.Customer_Address}</td>
            <td>${contract.Mobile}</td>
            <td>${contract.Property_ID}</td>
            <td>${contract.Date_Of_Contract}</td>
            <td>${contract.Price}</td>
            <td>${contract.Deposit}</td>
            <td>${contract.Remain}</td>
            <td>${contract.Status ? "1" : "2"}</td>
        `;
            tableBody.appendChild(row);
        });
    })
    .catch((error) => console.error(error));

const addContractForm = document.getElementById("addContractForm")
const full_contract_code = document.getElementById("Full_Contract_Code")
const customer_name = document.getElementById("Customer_Name")
const year_of_birth = document.getElementById("Year_Of_Birth")
const ssn = document.getElementById("SSN")
const customer_address = document.getElementById("Customer_Address")
const mobile = document.getElementById("Mobile")
const property_id = document.getElementById("Property_ID")
const date_of_contract = document.getElementById("Date_Of_Contract")
const price = document.getElementById("Price")
const deposit = document.getElementById("Deposit")
const remain = document.getElementById("Remain")
const status2 = document.getElementById("Status")

// Function to generate the Full_Contract_Code
function generateContractCode(id) {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    // const date = currentDate.getDate().toString().padStart(2, "0");
    const increaseNumber = id.toString().padStart(3, "0");
    return year.slice(2) + month + "FC" + increaseNumber;
}

addContractForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("/contracts")
        .then(res => res.json())
        .then(data => {
            const contracts = data; // Array of contracts from the server
            const nextContractId = contracts.length;
            const formData = {
                Full_Contract_Code: generateContractCode(contracts[nextContractId - 1].ID),
                Customer_Name: customer_name.value,
                Year_Of_Birth: year_of_birth.value,
                SSN: ssn.value,
                Customer_Address: customer_address.value,
                Mobile: mobile.value,
                Property_ID: property_id.value,
                Date_Of_Contract: date_of_contract.value,
                Price: price.value,
                Deposit: deposit.value,
                Remain: remain.value,
                Status: status2.value,
            };
            console.log(formData);
            fetch("/addContract", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
                .then((res) => res.text())
                .then((data) => {
                    console.log(data);
                    // location.reload();
                    window.location.href = "/"
                });
        })
        .catch((error) => console.error(error));
});