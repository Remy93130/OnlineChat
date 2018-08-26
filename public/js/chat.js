var socket = io()
var logged = false
var sound = new sound("asset/unsure.mp3")

function sound(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
		this.play = () => {
			this.sound.play();
		}
		this.stop = () => {
			this.sound.pause();
		}    
	}

function appendMessage(data) {
	var message =
	"<a href='#' class='list-group-item list-group-item-action flex-column align-items-start'>" +
	"<div class='d-flex w-100 justify-content-between'>" + 
	"<h5 class='mb-1'>" + data.author + "</h5>" +
	"<small>" + data.time + "</small>" +
	"</div>" +
	"<p class='mb-1'>" + data.content + "</p></a>"
	$('#chat').prepend(message)
	if ($("#sound").is(':checked')) {
		console.log("sound");
		sound.play();
	}
}

$('#confirm_pseudo').on('submit', (e) => {
	e.preventDefault()
	if ($('#init_pseudo').val() == '') {
		return 0
	}
	socket.emit('new_user', $('#init_pseudo').val())
	$('#users_online').append('<li>' + $('#init_pseudo').val() + '</li>')
	$('#create_pseudo').css('display', 'none')
	$('#app').css('display', 'flex')
	logged = true
})

$('#confirm_message').on('submit', (e) => {
	e.preventDefault()
	if ($('#message').val() == '') {
		return 0
	}
	socket.emit('new_message', $('#message').val())
	d = new Date()
	appendMessage({
		author: 'You',
		time: d.toTimeString().substr(0, 8),
		content: $('#message').val()
	})
	$('#message').val('')
})

$('#wipe_messages').on('click', (e) => {
	e.preventDefault()
	$('#chat').empty()
})

$(window).on('beforeunload', () => {
	if (logged) {
		socket.emit('end_user', null)
	}
});

socket.on('alter_user', (data) => {
	if (logged) {
		appendMessage(data)
	}
	$('#users_online').empty()
	for (var i = 0; i < data.users.length; i++) {
		$('#users_online').append('<li>' + data.users[i] + '</li>')
	}
})

socket.on('message', (data) => {
	appendMessage(data)
})

$(document).ready(function(){
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			$('#back-to-top').fadeIn();
		} else {
			$('#back-to-top').fadeOut();
		}
	});
	$('#back-to-top').click(function () {
		$('#back-to-top').tooltip('hide')
		$('body,html').animate({
			scrollTop: 0
		}, 800)
		return false
	})
	$('#back-to-top').tooltip('show')
})

$('a').click((e) => {
	e.preventDefault()
})