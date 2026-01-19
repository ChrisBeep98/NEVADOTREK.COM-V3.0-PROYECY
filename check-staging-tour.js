const https = require('https');

const url = 'https://api-6ups4cehla-uc.a.run.app/public/tours';

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
        return;
      }

      const tours = JSON.parse(data);
      console.log(`Total tours fetched: ${tours.length}`);
      console.log('All Tour IDs:', tours.map(t => t.tourId).join(', '));

      const testTour = tours.find(t => t.tourId === 'test-tour-001');
      
      if (testTour) {
        console.log('✅ FOUND: test-tour-001 exists!');
        console.log('Name:', JSON.stringify(testTour.name));
        console.log('Pricing Tiers:', JSON.stringify(testTour.pricingTiers, null, 2));
      } else {
        console.log('❌ NOT FOUND: test-tour-001 is missing from the list.');
        console.log('Available IDs:', tours.map(t => t.tourId).join(', '));
      }

    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  });

}).on('error', (err) => {
  console.error('Error fetching data:', err.message);
});
