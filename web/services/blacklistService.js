const net = require('net');

// Use environment variable if set, otherwise default to 4000
const CPP_PORT = process.env.CPP_PORT || 4000;

async function sendToCpp(command) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    client.connect(CPP_PORT, 'localhost', () => {
      client.write(command + '\n');
    });

    client.on('data', (data) => {
      resolve(data.toString());
      client.destroy(); // close connection
    });

    client.on('error', (err) => {
      reject(`Connection error: ${err.message}`);
    });
  });
}

module.exports = { sendToCpp };
