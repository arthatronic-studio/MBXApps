import Config from 'react-native-config';
import {io} from 'socket.io-client';
import { store } from 'src/state/redux';

export let currentSocket;

export const initSocket = () => {
    const user = store.getState()['user.auth'].login.user;

    if (!user) {
        currentSocket = null;
        return currentSocket;
    }

    if (!currentSocket) {
        console.log('initial socket connect');
        currentSocket = io.connect(Config.SOCKET_API_URL, {
            // reconnection: true,
            // reconnectionDelay: 1000,
            // reconnectionDelayMax : 5000,
            // reconnectionAttempts: Infinity,
            transports: ['websocket'],
            jsonp: false, 
            'forceNew': true,
            extraHeaders: {
              // Authorization: "Bearer authorization_token_here"
              // 'Control-Allow-Credentials': true
            },
        });

        if (user) {
            currentSocket.emit('auth', {id: user.userId});
        }

        currentSocket.on('auth', res => {
          console.log('socket auth', res);
        });

        currentSocket.on('connect', function(){
            console.log('socket connected');
        });
        currentSocket.on('disconnect', function (){
            console.log('socket disconnected');
            currentSocket = null;
            initSocket();
        });
    }
    
    return currentSocket;
}