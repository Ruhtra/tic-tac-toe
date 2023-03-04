import Messages from "/js/modules/Alerts.js";
import { getCookie } from "/js/functions.js"

function veirifyErrors(username, room) {
    let errs = false
    if (username.length == 0) {
        fMessages.insert('Preencha o campo "Username"') 
        errs = true
    }
    if (room.length == 0) { 
        fMessages.insert('Preencha o campo "Room"')
        errs = true
    }
    return errs
}

function ok() {
    let username = document.querySelector('input#username').value
    let room = document.querySelector('input#room').value

    if (veirifyErrors(username, room)) return

    // Insert username
    document.cookie = `username=${username}`

    // Request
    const request = new Request("/api/verifyFullRoom/"+room);
    fetch(request)
        .then((response) => response.json())
        .then(data => {
            if (data.msg == 'Room okay') window.location.href = '/game/'+room;
            if (data.msg == 'Busy room') fMessages.insert('Sala lotada')
        })
}

document.querySelector('input#play').addEventListener('click', (e) => ok())
document.querySelector('input#room').addEventListener('keyup', (e) => {
    var key = e.which || e.keyCode;
    if (key == 13) ok()
});
document.addEventListener('DOMContentLoaded', (e) => {
    console.log(getCookie('username').length != 0)
    if (getCookie('username').length != 0) document.querySelector('input#username').value = getCookie('username')
});

const fMessages = new Messages(document.querySelector('header #notifications'))