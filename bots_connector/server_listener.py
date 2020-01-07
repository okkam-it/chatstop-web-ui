import socket
import time

ips = ['localhost', 'localhost', 'localhost', 'localhost']
ports = [5005, 5005, 5005, 5006]

print('Listening...')
while True:    
    for ip, port in zip(ips, ports):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((ip, port))
        if result == 0:
            print ("Port is open")
        else:
            print ("Port is not open: " + str(port))
        sock.close() 
    time.sleep(5) 