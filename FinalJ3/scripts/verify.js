const axios = require('axios');
const { spawn, execSync } = require('child_process');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const fs = require('fs');

// check de toute les ftn du projet, les routes etc

async function runTest() {
    // kill tout les proc sur le port 3000
    try {
        const pid = execSync('lsof -t -i:3000').toString().trim();
        if (pid) {
            console.log(`Killing process ${pid} on port 3000...`);
            execSync(`kill - 9 ${pid} `);
        }
    } catch (e) {
        // si pas de proc en cours juste passe
    }
    const dbPath = path.join(__dirname, '..', 'database.sqlite');
    console.log('Database path:', dbPath);

    if (fs.existsSync(dbPath)) {
        console.log('Deleting existing database...');
        try {
            fs.unlinkSync(dbPath);
            console.log('Database deleted successfully.');
        } catch (err) {
            console.error('Error deleting database:', err.message);
        }
    }

    if (fs.existsSync(dbPath)) {
        console.error('WARNING: Database file still exists!');
    } else {
        console.log('Confirmed: Database file does not exist.');
    }

    console.log('Starting server...');
    const server = spawn('node', ['src/app.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
    });

    await sleep(3000);

    try {
        console.log('\n--- 1. Register Client ---');
        const clientRes = await axios.post(`${BASE_URL}/auth/register`, {
            email: 'client@test.com',
            password: 'password123',
            role: 'CLIENT',
        });
        console.log('Client Registered:', clientRes.status === 201);

        console.log('\n--- 2. Register Support ---');
        const supportRes = await axios.post(`${BASE_URL}/auth/register`, {
            email: 'support@test.com',
            password: 'password123',
            role: 'SUPPORT',
        });
        console.log('Support Registered:', supportRes.status === 201);

        console.log('\n--- 3. Login Client ---');
        const clientLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'client@test.com',
            password: 'password123',
        });
        const clientToken = clientLogin.data.data.accessToken;
        console.log('Client Logged In:', !!clientToken);

        console.log('\n--- 4. Login Support ---');
        const supportLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'support@test.com',
            password: 'password123',
        });
        const supportToken = supportLogin.data.data.accessToken;
        console.log('Support Logged In:', !!supportToken);

        console.log('\n--- 5. Create Ticket (Client) ---');
        const ticketRes = await axios.post(
            `${BASE_URL}/tickets`,
            {
                title: 'PC Broken',
                description: 'Screen is black',
                priority: 'HIGH',
                tags: ['Hardware', 'Urgent'],
            },
            { headers: { Authorization: `Bearer ${clientToken}` } }
        );
        const ticketId = ticketRes.data.data.ticket.id;
        console.log('Ticket Created:', ticketRes.status === 201);

        console.log('\n--- 6. Get Tickets (Client) ---');
        const clientTickets = await axios.get(`${BASE_URL}/tickets`, {
            headers: { Authorization: `Bearer ${clientToken}` },
        });
        console.log('Client sees tickets:', clientTickets.data.results === 1);

        console.log('\n--- 7. Get Tickets (Support) ---');
        const supportTickets = await axios.get(`${BASE_URL}/tickets`, {
            headers: { Authorization: `Bearer ${supportToken}` },
        });
        console.log('Support sees tickets:', supportTickets.data.results >= 1);

        console.log('\n--- 8. Update Status (Support) ---');
        const updateRes = await axios.patch(
            `${BASE_URL}/tickets/${ticketId}/status`,
            { status: 'DONE' },
            { headers: { Authorization: `Bearer ${supportToken}` } }
        );
        console.log('Status Updated:', updateRes.data.data.ticket.status === 'DONE');

        console.log('\n--- 9. Update Status (Client) - Should Fail ---');
        try {
            await axios.patch(
                `${BASE_URL}/tickets/${ticketId}/status`,
                { status: 'OPEN' },
                { headers: { Authorization: `Bearer ${clientToken}` } }
            );
        } catch (error) {
            console.log('Client Update Failed (Expected):', error.response.status === 403);
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    } finally {
        console.log('\nStopping server...');
        server.kill();
    }
}

runTest();
