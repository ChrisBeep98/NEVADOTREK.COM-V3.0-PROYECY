const https = require('https');

const url = 'https://api-6ups4cehla-uc.a.run.app/public/bookings/join';

const payload = JSON.stringify({
    departureId: "P8STQJLfPKmZx9w1hP2p", // Salida del 15 de Marzo del test-tour-001
    pax: 1,
    customer: {
        name: "Final Verification - Public Flow",
        email: "verify-public@staging.com",
        phone: "+573000000001",
        document: "JOIN-001"
    }
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

console.log(`Sending POST to: ${url}`);
console.log('Payload:', payload);

const req = https.request(url, options, (res) => {
    let data = '';
    console.log('Status Code:', res.statusCode);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            console.log('Response:', JSON.stringify(response, null, 2));
            
            if (res.statusCode === 200 || res.statusCode === 201) {
                console.log('\n✅ SUCCESS: Successfully joined public departure!');
                console.log('Booking ID:', response.bookingId);
            } else {
                console.log('\n❌ FAILED: Backend rejected the join request.');
            }
        } catch (e) {
            console.error('Error parsing response JSON:', e.message);
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (err) => {
    console.error('Request Error:', err.message);
});

req.write(payload);
req.end();
