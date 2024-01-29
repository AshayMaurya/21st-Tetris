import socketio
import json

sio = socketio.Server()

@sio.event
def connect(sid, environ):
    print(f'Client {sid} connected')

@sio.event
def disconnect(sid):
    print(f'Client {sid} disconnected')

@sio.event
def web3Data(sid, data):
    print('Received web3Data:', data)
    # Process data as needed

@sio.event
def contractHash(sid, data):
    print('Received contractHash:', data)
    # Process data as needed

@sio.event
def contractAddress(sid, data):
    print('Received contractAddress:', data)
    # Process data as needed

app = socketio.WSGIApp(sio)

if __name__ == '__main__':
    import eventlet
    import eventlet.wsgi

    eventlet.wsgi.server(eventlet.listen(('localhost', 3000)), app)
