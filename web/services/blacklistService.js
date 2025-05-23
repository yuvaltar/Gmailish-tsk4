const net = require('net');

function sendToCpp(command) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let data = '';

    client.connect(12345, '127.0.0.1', () => {
      client.write(command + '\n');
    });

    client.on('data', chunk => {
      data += chunk;
      if (data.includes('\n')) {
        client.destroy();
        resolve(data.trim());
      }
    });

    client.on('error', reject);
  });
}

module.exports = { sendToCpp };
