/* Chat commands */

/* Play music */

const audio = new Audio('../assets/images/Tersbetoni  Taivas Ly Tulta.mp3');


export function handleCommand(command) {
    switch (command) {
        case '/play taivas':
            console.log('Playing music...');
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
            console.log('Unknown command');
    }
}