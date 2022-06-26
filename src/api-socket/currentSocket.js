import Config from 'react-native-config';
import {io} from 'socket.io-client';
import { store } from 'src/state/redux';

export let currentSocket;

export const initSocket = () => {
    if (!currentSocket) {
        const user = store.getState()['user.auth'].login.user;
        console.log('initial socket connect');
        currentSocket = io.connect(Config.SOCKET_API_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity,
            extraHeaders: {
              // Authorization: "Bearer authorization_token_here"
              // 'Control-Allow-Credentials': true
            },
        });

        if (user) {
            currentSocket.emit('auth', {id: user.userId});
        }

        currentSocket.on('auth', res => {
          console.log('res auth', res);
        });

        currentSocket.on('connect', function(){
            console.log('connected');
        });
        currentSocket.on('disconnect', function (){
            console.log('disconnected');
            currentSocket = null;
            initSocket();
        });
    } else {
        // console.log('already connect');
    }
    
    return currentSocket;
}