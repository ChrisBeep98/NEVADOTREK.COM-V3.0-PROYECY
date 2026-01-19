const https = require('https');

const url = 'https://api-6ups4cehla-uc.a.run.app/public/bookings/private';

const payload = JSON.stringify({
    tourId: "4kIrLG0YVaDKuwmsAp9a", // Un ID real que no es test-tour-001
    date: "2026-03-15",
    pax: 1,
    customer: {
        name: "Prod ID Test Agent",
        email: "prod-test@nevadotrek.com",
        phone: "+573000000000",
        document: "PROD-001"
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
                console.log('\n✅ SUCCESS: Booking created successfully!');
                console.log('Booking ID:', response.bookingId);
            } else {
                console.log('\n❌ FAILED: Backend rejected the request.');
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
