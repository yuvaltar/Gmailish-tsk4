#include <string>
#include "IHashFunctions.h"
#include "StdHashFunction.h"
#include "CommandManager.h"

// SessionHandler is responsible for interacting with a single client.
// It reads full commands from the socket, calls CommandManager, and sends back results.
class SessionHandler {
public:
    // Constructor: requires the connected client socket and reference to the CommandManager.
    //SessionHandler(int socket, CommandManager& manager);
    SessionHandler(int socket);

    // Runs the full client session: read-process-respond loop.
    void handle();

private:
    int clientSocket;                    // Socket descriptor for this client
       

    // Receives a line (command) from the client, blocking until newline is encountered.
    std::string receiveLine();

    // Sends a full response (ending with newline) back to the client.
    void sendResponse(const std::string& response);

    // Closes the client socket cleanly.
    void closeConnection();
};
