import socket

# ------------------------------
# Configuration: Server details
# ------------------------------
SERVER_IP = '127.0.0.1'   # Localhost IP (server and client on same machine)
SERVER_PORT = 12345       # Port number the server listens on

# ------------------------------
# Create a TCP socket
# ------------------------------
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# ------------------------------
# Try to connect to the server
# ------------------------------
try:
    print(f"[Connecting] Connecting to {SERVER_IP}:{SERVER_PORT}...")
    client_socket.connect((SERVER_IP, SERVER_PORT))
    print("[Connected] Connection established.")
except Exception as e:
    print(f"[Error] Could not connect: {e}")
    exit(1)

# ------------------------------
# Communication loop: send & receive
# ------------------------------
try:
    while True:
        # Prompt user for input
        message = input("[Input] Message to send (type 'quit' to exit): ")

        # ---- EXIT CONDITION ----
        # If the user types 'quit' (in any capitalization), we break the loop.
        # .lower() is used to make it case-insensitive, so 'QUIT' and 'Quit' also work.
        if message.lower() == 'quit':
            print("[Exit] User requested to quit.")
            break

        # Send the message to the server (append newline since server expects it)
        client_socket.send((message + '\n').encode('utf-8'))
        print("[Sent] Message sent to server.")

        # Receive the server's response (up to 4096 bytes)
        response = client_socket.recv(4096).decode('utf-8').strip()
        print(f"[Received] Server sent: {response}")

# ------------------------------
# Handle keyboard interruption (Ctrl+C)
# ------------------------------
# This allows the user to manually stop the program using Ctrl+C
except KeyboardInterrupt:
    print("\n[Interrupt] Disconnected by user via Ctrl+C.")

# ------------------------------
# Close the connection on exit
# ------------------------------
finally:
    client_socket.close()
    print("[Closed] Connection closed.")
