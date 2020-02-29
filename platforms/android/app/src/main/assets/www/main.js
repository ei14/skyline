/*eslint no-unused-vars:off, no-empty:off, no-undef:off, no-fallthrough:off*/

function openMenu() {
	document.getElementById('sidebar').classList.add('sidebar-shown');
	document.getElementById('sidebar-behind').classList.remove('sidebar-behind-hidden');
}
function closeMenu() {
	document.getElementById('sidebar').classList.remove('sidebar-shown');
	document.getElementById('sidebar-behind').classList.add('sidebar-behind-hidden');
}

window.addEventListener('resize', function() {
	[].forEach.call(
		document.getElementsByClassName('icon'),
		function(each) { each.setAttribute('x', 0);
		}
	);
});

document.addEventListener('contextmenu', event => event.preventDefault());

const prevent = function(ev) {
	ev.preventDefault();
}

function openNewTask() {
	document.getElementById('new-task-popup').classList.remove('hidden');
	document.getElementById('blur-behind').classList.add('blurring-behind');
	document.getElementById('blur-behind').classList.remove('not-blurring-behind');
	document.getElementById('blur-behind').addEventListener('touchstart', prevent);
}

function closeNewTask() {
	document.getElementById('new-task-popup').classList.add('hidden');
	document.getElementById('blur-behind').classList.remove('blurring-behind');
	document.getElementById('blur-behind').classList.add('not-blurring-behind');
	document.getElementById('blur-behind').removeEventListener('touchstart', prevent);

	document.getElementById('what-input').value = document.getElementById('what-input').defaultValue;
	document.getElementById('date-input').value = document.getElementById('date-input').defaultValue;
	document.getElementById('time-input').value = document.getElementById('time-input').defaultValue;
	document.getElementById('for-input').value = document.getElementById('for-input').defaultValue;
	document.getElementById('long-input-num').value = document.getElementById('long-input-num').defaultValue;
	document.getElementById('long-input-time').value = document.getElementById('long-input-time').defaultValue;
	document.getElementById('importance-input').value = document.getElementById('importance-input').defaultValue;
	document.getElementById('extra-input').value = document.getElementById('extra-input').defaultValue;
}

function taskToString(what, when, subject, len, importance, extra) {
	return encodeURIComponent(what.replace(/\n/g, ' ')) + '%0A' +
		encodeURIComponent(when.replace(/\n/g, ' ')) + '%0A' +
		encodeURIComponent(subject.replace(/\n/g, ' ')) + '%0A' +
		encodeURIComponent(len.replace(/\n/g, ' ')) + '%0A' +
		encodeURIComponent(importance.replace(/\n/g, ' ')) + '%0A' +
		encodeURIComponent(extra.replace(/\n/g, ' ')) + '%0A';
}

let errTxt = document.getElementById('error-text');
let username = localStorage.getItem('username');
let password = localStorage.getItem('password');

function uploadTask() {
	errTxt.innerHTML = 'Uploading...<br>';
	let taskname = document.getElementById('what-input').value;
	let duetime = new Date(document.getElementById('date-input').value + ' ' + document.getElementById('time-input').value).getTime() / 1000;
	let subject = document.getElementById('for-input').value;
	let tasklength = document.getElementById('long-input-num').value;
	switch(document.getElementById('long-input-time').value) {
		case 'Days':
			tasklength *= 24;
		case 'Hours':
			tasklength *= 60;
	}
	let importance = document.getElementById('importance-input').value;
	let extrainfo = document.getElementById('extra-input').value;
	let str = 'Task%0A' + taskToString('' + taskname, '' + duetime, '' + subject, '' + tasklength, '' + importance, '' + extrainfo);

	let xhr = new XMLHttpRequest();
	xhr.open('GET', `https://thomaskaldahl.com/skyline/append.php?u=${username}&p=${password}&d=${str}`);
	xhr.send();
	xhr.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(xhr.status == 200) {
				if(xhr.responseText != null) {
					if(xhr.responseText.indexOf('Success') != 0) {
						alert(xhr.responseText);
					} else {
						errTxt.innerHTML = '';
						alert('Event Saved.');
						xhr.abort();
					}
				}
			} else {
				alert(xhr.statusText);
			}
		}
	};

	closeNewTask();
}

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

function showTasks() {
	if(localStorage.getItem('tasks').length == 0 || localStorage.getItem('tasks') == null || localStorage.getItem('tasks') == 'Success.') {
		document.getElementById('tasks').innerHTML = 'Nothing on your to-do list!<br>Tap (+) to set a new task.';
	} else {
		document.getElementById('tasks').innerHTML = '';
		let input = decodeURI(localStorage.getItem('tasks').substring(8)).split('\n');
		let i = 0;
		while(i < input.length) {
			switch(input[i]) {
				case 'Task':
					if(i != 0) document.getElementById('tasks').innerHTML += '<div class="h-divide"></div>';
					document.getElementById('tasks').innerHTML += '<h1>' + input[++i] + '</h1>';
					var duedate = new Date(input[++i]*1000);
					if(!isNaN(duedate)) {
						var now = new Date();
						var dateStr = months[duedate.getMonth()] + ' ' + duedate.getDate() + ', ' + (1900 + duedate.getYear()) + ' at ' + ((duedate.getHours()+11)%12+1) + ':' + (duedate.getMinutes()<10?'0':'') + duedate.getMinutes() + (duedate.getHours()<12?'AM':'PM');
						var timeStr = ((duedate.getHours()+11)%12+1) + ':' + (duedate.getMinutes()<10?'0':'') + duedate.getMinutes() + (duedate.getHours()<12?'AM':'PM');
						if(duedate < now) {
							document.getElementById('tasks').innerHTML += '<p>Overdue. Was due on ' + dateStr + '</p>';
						} else if(duedate-now < 60000) {
							document.getElementById('tasks').innerHTML += '<p>Due about now</p>';
						} else if(duedate-now < 60*60000) {
							document.getElementById('tasks').innerHTML += '<p>Due in ' + Math.ceil((duedate-now)/60000); + ' minutes</p>';
						} else if(duedate-now < 120*60000) {
							document.getElementById('tasks').innerHTML += '<p>Due in an hour at ' + timeStr + '</p>';
						} else if(duedate-now < 24*60*60000) {
							document.getElementById('tasks').innerHTML += '<p>Due in ' + Math.ceil((duedate-now)/3600000) + ' hours at ' + timeStr + '</p>';
						} else if(duedate-now < 48*60*60000) {
							document.getElementById('tasks').innerHTML += '<p>Due tomorrow at ' + timeStr + '</p>';
						} else if(duedate-now < 7*24*60*60000) {
							document.getElementById('tasks').innerHTML += '<p>Due in ' + Math.ceil((duedate-now)/24/3600000) + ' days on ' + dateStr + '</p>';
						} else {
							document.getElementById('tasks').innerHTML += '<p>Due on ' + dateStr + '</p>';
						}
					}
					var subject = input[++i];
					if(subject.length > 0) {
						document.getElementById('tasks').innerHTML += '<p>For ' + subject + '.</p>';
					}
					var len = input[++i];
					if(len != 0) {
						document.getElementById('tasks').innerHTML += '<p>';
						if(len <= 1) {
							document.getElementById('tasks').innerHTML += 'Only a minute';
						} else if(len < 60) {
							document.getElementById('tasks').innerHTML += len + ' minutes';
						} else if(len == 60) {
							document.getElementById('tasks').innerHTML += 'An hour';
						} else if(len < 1440) {
							document.getElementById('tasks').innerHTML += Math.floor(len/60) + ' ';
							switch(len%60) {
								case 0:
									document.getElementById('tasks').innerHTML += 'hours';
									break;
								case 30:
									document.getElementById('tasks').innerHTML += 'and a half hours';
									break;
								case 15:
									document.getElementById('tasks').innerHTML += 'hours and a quarter';
									break;
								case 45:
									document.getElementById('tasks').innerHTML += 'hours and three quarters';
									break;
								default:
									document.getElementById('tasks').innerHTML += 'hours and ' + len%60 + ' minutes';
							}
						} else if(len < 43200) {
							document.getElementById('tasks').innerHTML += Math.floor(len/60/24) + ' days';
						} else {
							document.getElementById('tasks').innerHTML += 'forever';
						}
						i++;
						document.getElementById('tasks').innerHTML += ' to complete.</p><p>' + input[++i] + '</p>';
					} else {
						i += 2;
					}
					document.getElementById('tasks').innerHTML +=
						'<div class="button-row"><input type="button" value="I\'m done!" class="main-button" onclick="doneWithTask(\''
						+ taskToString(input[i-5], input[i-4], input[i-3], input[i-2], input[i-1], input[i])
						+'\')"></div>'
					;
					break;
			}
			i++;
		}
	}
}

function updateTasks() {
	errTxt.innerHTML = 'Loading...<br>';
	let xhr = new XMLHttpRequest();
	xhr.open('GET', `https://thomaskaldahl.com/skyline/read.php?u=${username}&p=${password}`);
	xhr.send();
	xhr.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(xhr.status == 200) {
				if(xhr.responseText != null) {
					if(xhr.responseText.indexOf('Success') != 0) {
						errTxt.innerHTML = xhr.responseText;
					} else {
						if(localStorage.getItem('tasks') != xhr.responseText) {
							localStorage.setItem('tasks', xhr.responseText);
						}
						setTimeout(function() {errTxt.innerHTML = '';}, 250);
					}
				}
			} else {
				errTxt.innerHTML = xhr.statusText;
			}
			showTasks();
		}
	};
}

showTasks();
updateTasks();
setInterval(updateTasks, 10000);

function logOut() {
	if(confirm('Are you sure you want to log out?')) {
		localStorage.clear();
		window.location.href = 'index.html';
	}
}

function deleteAll() {
	if(
		confirm('This action will delete all of your tasks.')
		&& confirm('Are you sure you want to delete everything?')
		&& confirm('No seriously, this action deletes everything.')
		&& confirm('Last chance. You\'re about to delete your entire to-do list.')
	) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', `https://thomaskaldahl.com/skyline/write.php?u=${username}&p=${password}&d=`);
		xhr.send();
		localStorage.setItem('tasks', null);
		showTasks();
	}
}

function doneWithTask(str) {
	if(confirm('Are you sure you want to delete the task ' + decodeURI(str.split('%0A')[0]) + '?')) {
		let xhr = new XMLHttpRequest();
		let deleteThis = 'Task%0A' + str;
		xhr.open('GET', `https://thomaskaldahl.com/skyline/remove.php?u=${username}&p=${password}&d=${deleteThis}`);
		xhr.send();
		xhr.onreadystatechange = function() {
			if(this.readyState == 4) {
				if(xhr.status == 200) {
					if(xhr.responseText != null) {
						if(xhr.responseText.indexOf('Success') != 0) {
							alert(xhr.responseText);
						}
					}
				} else {
					alert(xhr.statusText);
				}
			}
		}
		updateTasks();
	}
}

document.addEventListener('deviceready', function () {
	cordova.plugins.notification.local.schedule({
		title: 'Justin Rhyss',
		text: 'Do you want to go see a movie tonight?',
		actions: [{
			id: 'reply',
			type: 'input',
			title: 'Reply',
			emptyText: 'Type message',
		}]
	});
}, false);
