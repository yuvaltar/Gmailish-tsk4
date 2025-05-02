import socket

SERVER_IP = input("Enter server IP number: ")
SERVER_PORT = int(input("Enter server port number: "))
 
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    print(f"[Connecting] Connecting to {SERVER_IP}:{SERVER_PORT}...")
    client_socket.connect((SERVER_IP, SERVER_PORT))
    print("[Connected] Connection established.")
except Exception as e:
    print(f"[Error] Could not connect: {e}")
    exit(1)

try:
    while True:
        # Prompt user for input
        message = input("[Input] Message to send (type 'quit' to exit): ") # check out why do we need the message in there

        # ---- EXIT CONDITION ----
 

        # Send the message to the server (append newline since server expects it)
        client_socket.send((message + '\n').encode('utf-8'))
        print("[Sent] Message sent to server.")

        # Receive the server's response (up to 4096 bytes)
        response = client_socket.recv(4096).decode('utf-8')
        print(f"[Received] Server sent: {response}")


except KeyboardInterrupt:
    print("\n[Interrupt] Disconnected by user via Ctrl+C.")


finally:
    client_socket.close()
    print("[Closed] Connection closed.")
