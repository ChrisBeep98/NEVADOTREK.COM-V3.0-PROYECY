const https = require('https');

const url = 'https://api-6ups4cehla-uc.a.run.app/public/departures';

console.log(`Fetching from: ${url}`);

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      if (res.statusCode !== 200) {
        console.error(`Error: Status Code ${res.statusCode}`);
        console.error('Response:', data);
        return;
      }

      const departures = JSON.parse(data);
      console.log(`Total departures fetched: ${departures.length}`);

      const testDepartures = departures.filter(d => d.tourId === 'test-tour-001');
      console.log(`Departures for 'test-tour-001': ${testDepartures.length}`);
      
      if (testDepartures.length > 0) {
        console.log('Sample departure:', JSON.stringify(testDepartures[0], null, 2));
        
        // Check dates
        console.log('\nDates:');
        testDepartures.forEach(d => {
            const date = new Date(d.date._seconds * 1000);
            console.log(`- ID: ${d.departureId}, Date: ${date.toISOString()}, Status: ${d.status}, Slots: ${d.maxPax - (d.currentPax || 0)}`);
        });
      } else {
          console.log("No departures found for test-tour-001. Dumping first 3 departures found to check structure:");
          console.log(JSON.stringify(departures.slice(0, 3), null, 2));
      }

    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      console.log('Raw data:', data.substring(0, 500));
    }
  });

}).on('error', (err) => {
  console.error('Error fetching data:', err.message);
});
