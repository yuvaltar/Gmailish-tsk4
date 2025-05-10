import socket

SERVER_IP = input()
SERVER_PORT = int(input())

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    
    client_socket.connect((SERVER_IP, SERVER_PORT))
    

    while True:
        message = input()
        if message.strip().lower() == "quit":
            break

        # Send the message (with newline for server parsing)
        client_socket.send((message + '\n').encode('utf-8'))

        # Wait for server response
        response = client_socket.recv(4096).decode('utf-8')


except KeyboardInterrupt:
     pass

except Exception as e:
     pass

finally:
    client_socket.close()
    
