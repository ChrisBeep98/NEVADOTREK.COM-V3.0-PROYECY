const https = require('https');

// ID obtained from user logs
const bookingId = '26kcsqcYHhXhozRakJ7k';
const url = `https://api-6ups4cehla-uc.a.run.app/public/bookings/${bookingId}`;

console.log(`Fetching booking details for: ${bookingId}`);

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      if (res.statusCode !== 200) {
        console.error(`Error: Status Code ${res.statusCode}`);
        return;
      }

      const booking = JSON.parse(data);
      console.log('Booking Details:');
      console.log(JSON.stringify(booking, null, 2));

    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  });

}).on('error', (err) => {
  console.error('Error fetching data:', err.message);
});
