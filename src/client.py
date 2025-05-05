import socket

SERVER_IP = input("Enter server IP number: ")
SERVER_PORT = int(input("Enter server port number: "))

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    print(f"[Connecting] Connecting to {SERVER_IP}:{SERVER_PORT}...")
    client_socket.connect((SERVER_IP, SERVER_PORT))
    print("[Connected] Connection established. You can now send commands.")

    while True:
        message = input("[Input] Enter command (POST/GET/DELETE URL), or 'quit' to exit: ")
        if message.strip().lower() == "quit":
            break

        # Send the message (with newline for server parsing)
        client_socket.send((message + '\n').encode('utf-8'))
        print("[Sent] Command sent to server.")

        # Wait for server response
        response = client_socket.recv(4096).decode('utf-8')
        print(f"[Received] Server replied:\n{response}")

except KeyboardInterrupt:
    print("\n[Interrupt] Disconnected by user via Ctrl+C.")

except Exception as e:
    print(f"[Error] {e}")

finally:
    client_socket.close()
    print("[Closed] Connection closed.")
