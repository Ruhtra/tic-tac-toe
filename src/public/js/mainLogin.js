import Messages from "/js/modules/Alerts.js";

function ok() {
    let room = document.querySelector('input#room').value
    if (room.length == 0) return fMessages.insert('Preencha o campo "Room"')

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

const fMessages = new Messages(document.querySelector('header #notifications'))