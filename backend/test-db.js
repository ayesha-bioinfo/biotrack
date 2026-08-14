require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();
    console.log("DATABASE CONNECTION SUCCESSFUL");

    const result = await client.query("SELECT NOW()");
    console.log(result.rows);

    await client.end();
  } catch (error) {
    console.error("DATABASE TEST FAILED");
    console.error(error);
  }
}

testConnection();