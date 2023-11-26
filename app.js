const express = require('express');
const app = express();
const sql = require('mssql/msnodesqlv8');
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Database configuration
const dbConfig = {
    server: "localhost\\SQLEXPRESS",
    database: "QUANLYBDS_0302_TEAM13",
    user: "sa",
    password: "123456",
    port: 1433,
    options: {
        enableArithAbort: true,
        // trustServerCertificate: true
    },
    driver: "msnodesqlv8",
};

// Serve index.html as the home page
app.get('/', (req, res) => {
    res.render('pages/index');
});

// Route to fetch contracts data from the database

app.get('/contracts', async (req, res) => {
    try {
        // Create a connection pool
        const pool = await new sql.ConnectionPool(dbConfig).connect();

        // Execute the query
        const result = await pool.request().query('SELECT * FROM Full_Contract');

        // Send the result as JSON response
        // res.send({ result: result.recordset });
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving contract data');
    }
});

//Route POST data to contracts table
// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/addContract', (req, res) => {
    res.render('pages/addContract');
});
// Route to handle the POST request for adding a new contract
app.post('/addContract', async (req, res) => {
    try {
        const contract = req.body;
        console.log(contract);

        // Create a new SQL Server connection pool
        const pool = await sql.connect(dbConfig);

        // format date
        const dateFormat = new Date().toISOString().slice(0, 19).replace('T', ' ')

        // Insert the contract data into the database
        await pool.request()
            .input('Full_Contract_Code', sql.NVarChar, contract.Full_Contract_Code)
            .input('Customer_Name', sql.NVarChar, contract.Customer_Name)
            .input('Year_Of_Birth', sql.Int, contract.Year_Of_Birth)
            .input('SSN', sql.NVarChar, contract.SSN)
            .input('Customer_Address', sql.NVarChar, contract.Customer_Address)
            .input('Mobile', sql.NVarChar, contract.Mobile)
            .input('Property_ID', sql.Int, contract.Property_ID)
            // .input('Date_Of_Contract', sql.Date, new Date(contract.Date_Of_Contract))
            .input('Date_Of_Contract', sql.Date, dateFormat)
            .input('Price', sql.Decimal, contract.Price)
            .input('Deposit', sql.Decimal, contract.Deposit)
            .input('Remain', sql.Decimal, contract.Remain)
            .input('Status', sql.Bit, contract.Status)
            .query('INSERT INTO Full_Contract (Full_Contract_Code, Customer_Name, Year_Of_Birth, SSN, Customer_Address, Mobile, Property_ID, Date_Of_Contract, Price, Deposit, Remain, Status) VALUES (@Full_Contract_Code, @Customer_Name, @Year_Of_Birth, @SSN, @Customer_Address, @Mobile, @Property_ID, @Date_Of_Contract, @Price, @Deposit, @Remain, @Status)');

        // res.status(200).send('Contract added successfully');
        res.status(200).json({ message: 'Contract added successfully' });
    } catch (error) {
        console.error('Error adding contract:', error);
        res.status(500).send('An error occurred while adding the contract');
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
