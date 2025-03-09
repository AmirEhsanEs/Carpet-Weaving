const { Client } = require('pg')
const connection = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '13801353',
    port: 5432,
  });

const newConnection = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'carpetdb',
    password: '13801353',
    port: 5432,
  });  
connection.connect();

//initial database
function checkExistDb(){  
    connection.query('SELECT datname FROM pg_catalog.pg_database WHERE datname = $1', ['carpetdb'], (err, res) => {
        if (err) {
            console.error('Error executing query', err.stack);
        } else {
            if (res.rows.length === 0) {
                console.log('Database does not exist. Creating it...');
                createDatabase();
            } else {
                console.log('Database already exists');
                connection.end()
                newConnection.connect()

            }
            }
            });
        }
function createDatabase() {
    connection.query('CREATE DATABASE carpetdb', (err, res) => {
      if (err) {
        console.error('Error creating database', err.stack);
      } else {
        console.log('Database created');
        createTables()

      }
    });
  }
function createTables() {
    connection.end()
    newConnection.connect()
    const createUsersTableQuery = `
      CREATE TABLE users (
        Id SERIAL PRIMARY KEY,
        Username TEXT NOT NULL,
        Password TEXT NOT NULL,
        Name TEXT NOT NULL,
        PhoneNumber TEXT,
        Email TEXT
      )
    `;
    const createProductsTableQuery = `
      CREATE TABLE products (
            Id SERIAL PRIMARY KEY,
            Name TEXT NOT NULL,
            Price INTEGER NOT NULL,
            ImageUrl TEXT,
            Description TEXT
      )
    `;
    newConnection.query(createUsersTableQuery, (err, res) => {
      if (err) {
        console.error('Error creating users table', err.stack);
      } else {
        console.log('Users table created');
      }
    });
    newConnection.query(createProductsTableQuery, (err, res) => {
      if (err) {
        console.error('Error creating products table', err.stack);
      } else {
        console.log('Products table created');
      }
    });
  }
  checkExistDb()
  module.exports=newConnection