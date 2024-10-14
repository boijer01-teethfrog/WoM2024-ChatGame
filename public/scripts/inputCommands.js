import { changePlayerSize } from './player.js';

/* Chat commands */

/* Play music */

const audio = new Audio('../assets/taivas8bit.mp3');


export function handleCommand(command) {
    switch (command) {
        case '/play taivas':
            console.log('Playing music...');
            audio.volume = 0.5;
            audio.play();
            break;
        case '/stop':
            if (audio) {
                console.log('Stopping music...');
                audio.pause();
                audio.currentTime = 0;
            } else {
                console.log('Nothing is playing...');
            }
            break;
        case '/huge':
            changePlayerSize(150, 150);
            break;
        case '/normal':
            changePlayerSize(50, 50);
            break;
        case '/small':
            changePlayerSize(15, 15);
            break;
        default:
            console.log('Unknown command');
    }
}

export function handleServerCommand(command) {
    switch (command) {
        case '/play taivas':
            console.log('Playing music...');
            audio.volume = 0.5;
            audio.play();
            break;
        case '/stop':
            if (audio) {
                console.log('Stopping music...');
                audio.pause();
                audio.currentTime = 0;
            } else {
                console.log('Nothing is playing...');
            }
            break;
        default:
            break;
    }
}