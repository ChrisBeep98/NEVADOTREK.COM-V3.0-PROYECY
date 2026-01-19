const https = require('https');

const url = 'https://api-6ups4cehla-uc.a.run.app/public/bookings/private';

const options = {
    method: 'OPTIONS',
};

console.log(`Sending OPTIONS to: ${url}`);

const req = https.request(url, options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    
    res.on('data', () => {}); // Consume stream
    res.on('end', () => console.log('Request complete.'));
});

req.on('error', (err) => {
    console.error('Request Error:', err.message);
});

req.end();
