// scripts/testDiscover.js
const { discover } = require('../src/discovery/client');

(async () => {
  try {
    const cfg = await discover(3000);
    console.log('Discovered config:', cfg);
  } catch (err) {
    console.error('Discovery failed:', err);
  }
})();
