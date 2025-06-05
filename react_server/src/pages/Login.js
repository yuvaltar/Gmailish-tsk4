const response = await fetch('http://localhost:3000/api/tokens', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

const data = await response.json();
console.log(data); // this might contain the JWT token