const net = require('net'); 
// Import Node.js's built-in networking module to create TCP connections

function sendToCpp(command) {
  // Define a function that sends a command string to the C++ TCP server
  return new Promise((resolve, reject) => {
    // Wrap the whole logic in a Promise so we can use async/await
    // Call resolve(result) when done, or reject(error) if it fails
    const client = new net.Socket(); 
    // Create a new TCP socket client
    let data = ''; 
    // This will store the data received from the server
    client.connect(12345, '127.0.0.1', () => {
      // Try to connect to the C++ server at localhost:12345
      client.write(command + '\n'); 
      // Send the command string with a newline at the end
      // The newline lets the C++ server know where the message ends
    });
    client.on('data', chunk => {
      // When data is received from the C++ server, this event is triggered
      data += chunk; 
      // Append the received data chunk to the full data string
      if (data.includes('\n')) {
        // Once we detect a newline, we know the full message is received
        client.destroy(); 
        // Close the TCP connection immediately (force close)
        resolve(data.trim()); 
        // Resolve the promise with the trimmed response (remove newline)
      }
    });
    client.on('error', reject); 
    // If an error occurs (e.g., cannot connect), reject the promise
  });
  
}
module.exports = { sendToCpp }; 
// Export the function so other files can import and use it
