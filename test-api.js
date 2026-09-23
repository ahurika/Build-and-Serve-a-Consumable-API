async function fetchSafe(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return { status: res.status, json, text: null };
  } catch(e) {
    return { status: res.status, json: null, text };
  }
}

async function test() {
  const baseUrl = 'http://localhost:3001/api/v1';
  console.log('--- Testing API Constraints ---');

  // Test 1: Limit Clamped to 100
  let { status, json, text } = await fetchSafe(`${baseUrl}/routes?limit=5000`);
  if (json) {
    console.log(`1. Limit 5000 clamped: status: ${status}, limit returned is ${json.meta?.limit}`);
  } else {
    console.log(`1. Failed: status ${status}`);
  }

  // Test 2: Negative Offset
  ({ status, json } = await fetchSafe(`${baseUrl}/routes?offset=-5`));
  console.log(`2. Negative offset status: ${status}, Message: ${json?.error?.message}`);

  // Test 3: Unknown Sort Field
  ({ status, json } = await fetchSafe(`${baseUrl}/routes?sortBy=unknownField`));
  console.log(`3. Unknown sort field status: ${status}, Message: ${json?.error?.message}`);

  // Test 4: Malformed UUID
  ({ status, json } = await fetchSafe(`${baseUrl}/routes/this-is-not-a-uuid`));
  console.log(`4. Malformed UUID status: ${status}, Message: ${json?.error?.message}`);

  // Test 5: Missing Required POST Fields
  ({ status, json } = await fetchSafe(`${baseUrl}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routeId: 'invalid-but-present' })
  }));
  console.log(`5. Missing POST fields status: ${status}, Message: ${json?.error?.message}`);
}
test();
