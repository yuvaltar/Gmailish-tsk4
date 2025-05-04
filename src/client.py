import socket

SERVER_IP = input("Enter server IP number: ")
SERVER_PORT = int(input("Enter server port number: "))

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    print(f"[Connecting] Connecting to {SERVER_IP}:{SERVER_PORT}...")
    client_socket.connect((SERVER_IP, SERVER_PORT))
    print("[Connected] Connection established.")

    # --- Send config first ---
    config = input("[Config] Enter BloomFilter config (e.g. '128 3 7'): ")
    client_socket.send((config + '\n').encode('utf-8'))
    print("[Sent] Config sent. Now you can enter commands.")

    # --- Main loop ---
    while True:
        message = input("[Input] Message to send (type 'quit' to exit): ")
        if message.strip().lower() == "quit":
            break

        client_socket.send((message + '\n').encode('utf-8'))
        print("[Sent] Message sent to server.")

        # Only now we wait for a response
        response = client_socket.recv(4096).decode('utf-8')
        print(f"[Received] Server sent: {response}")

except KeyboardInterrupt:
    print("\n[Interrupt] Disconnected by user via Ctrl+C.")

finally:
    client_socket.close()
    print("[Closed] Connection closed.")
