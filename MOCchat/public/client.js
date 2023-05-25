let name = '';
do {
    name = prompt('Please enter your name:');
} while (!name);
if (name === '') {
    name = 'Unknown';
}

const socket = io();
let textarea = document.getElementById('textarea');
let messageArea = document.querySelector('.message__area');

var audio = new Audio('/ting.mp3');

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});
let btn = document.getElementById('btn')
btn.addEventListener('click', (e)=>{
    sendMessage(textarea.value);
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim(),
    };

    let user = {
        user: name,
        message: message.trim(),
    };

    // Append
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();
    // send to server
    socket.emit('message', msg);
    socket.emit('leave', user, name);
}


function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    // let markup;
    // if (msg.user === '') {
    //     markup = `
    //         <p class="center-message">${msg.message}</p>
    //     `;
    // } else {
    //     markup = `
    //         <h4>${msg.user}</h4>
    //         <p>${msg.message}</p>
    //     `;
    // }
let  markup = `
      <h4>${msg.user}</h4>
          <p>${msg.message}</p>
       `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}


socket.emit('join', name);
socket.on('joined', (msg) => {
    appendMessage(msg, 'center');
    // audio.play();
    scrollToBottom();
});
// receive messages from the server
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    // audio.play();
    scrollToBottom();
});

socket.on('leave', (msg) => {
    appendMessage(msg, 'center');
    // audio.play();
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
