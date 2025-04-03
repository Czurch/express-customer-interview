const sqlite3 = require('sqlite3').verbose();
const { faker } = require('@faker-js/faker');


const db = new sqlite3.Database('./db/customers.db');

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS customers`);

    db.run(`
        CREATE TABLE customers (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        email TEXT,
        date_of_birth TEXT,
        employer_number INTEGER
        )
    `);

    const stmt = db.prepare(`
        INSERT INTO customers (first_name, email, date_of_birth, employer_number)
        VALUES (?, ?, ?, ?)
    `);

    // Generate 190 adults (18+)
    for (let i = 0; i < 190; i++) {
        const name = faker.person.firstName();
        const email = faker.internet.email(name);
        const dob = Math.floor(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).getTime() / 1000);
        const employer = (i % 3) + 1;

        stmt.run(name, email, dob, employer);
    }

    // Generate 10 minors (<18)
    for (let i = 0; i < 10; i++) {
        const name = faker.person.firstName();
        const email = faker.internet.email(name);
        const dob = Math.floor(faker.date.birthdate({ min: 12, max: 17, mode: 'age' }).getTime() / 1000);
        const employer = 2;

        stmt.run(name, email, dob, employer);
    }

    // Generate 25 emails using subaddressing
    for (let i = 0; i < 25; i++) {
        const name = faker.person.firstName();
        const baseEmail = faker.internet.email(name); // e.g., john.doe@example.com
  
        const [localPart, domain] = baseEmail.split('@');
        const subaddress = `+test${i}`; // customize this if needed
        const email = `${localPart}${subaddress}@${domain}`; // e.g., john.doe+test3@example.com
  
        const dob = Math.floor(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).getTime() / 1000);
        const employer = 3;
  
        stmt.run(name, email, dob, employer);
    }

  stmt.finalize();

  console.log('✅ Database seeded with 225 customers');
});

db.close();
