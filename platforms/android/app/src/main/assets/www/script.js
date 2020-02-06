/*eslint no-unused-vars:off*/

let xhr = new XMLHttpRequest();

function signup() {
	let username = document.getElementById('username-input').value.toUpperCase();
	let email = document.getElementById('email-input').value;
	let password = document.getElementById('password-input').value;
	let errTxt = document.getElementById('login-error');
	errTxt.innerHTML = '';
	if(username.match(/[^A-Z0-9]/g) != null) errTxt.innerHTML += 'Username must only contain letters and numbers.<br>';
	if(username.length < 3) errTxt.innerHTML += 'Username must be at least 3 characters.<br>';
	if(username.length > 64) errTxt.innerHTML += 'Username cannot be longer than 64 characters.<br>';
	if(email.match(/^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.[A-Za-z0-9.]+$/) == null) errTxt.innerHTML += 'Invalid email address.<br>';
	if(password != document.getElementById('password-confirm').value) errTxt.innerHTML += 'The passwords entered do not match.<br>';
	if(password.length < 5) errTxt.innerHTML += 'Password must be at least 5 characters.<br>';
	if(password.length > 230) errTxt.innerHTML += 'That password is TOO secure. Please limit it to 230 characters.<br>';
	if(errTxt.innerHTML == '') {
		xhr.open('GET', `https://thomaskaldahl.com/skyline/newacc.php?u=${username}&e=${email}&p=${password}`);
		if(!xhr.send()) errTxt.innerHTML += 'An error occured. Please make sure you have a good internet connection.<br>';
		xhr.onreadystatechange = function() {
			if(this.readyState == 4) { 
				if(xhr.responseText == null) {
					errTxt.innerHTML += 'An error occured. Please make sure you have a good internet connection.<br>';
				} else {
					if(xhr.responseText.indexOf('Success') != 0) {
						errTxt.innerHTML += xhr.responseText;
					} else {
						document.getElementById('login-popup').innerHTML = '<div id="box-title">Welcome, ' + username + '.</div>';
					}
				}
			}
		};
	}
}

function login() {
	let username = document.getElementById('username-input').value.toUpperCase();
	let password = document.getElementById('password-input').value;
	let errTxt = document.getElementById('login-error');
	errTxt.innerHTML = '';
	if(username.match(/[^A-Z0-9]/g) != null) errTxt.innerHTML += 'Username must only contain letters and numbers.<br>';
	if(username.length < 3) errTxt.innerHTML += 'Username must be at least 3 characters.<br>';
	if(username.length > 64) errTxt.innerHTML += 'Username cannot be longer than 64 characters.<br>';
	if(errTxt.innerHTML == '') {
		xhr.open('GET', `https://thomaskaldahl.com/skyline/cred.php?u=${username}&p=${password}`);
		if(!xhr.send()) errTxt.innerHTML += 'An error occured. Please make sure you have a good internet connection.<br>';
		xhr.onreadystatechange = function() {
			if(this.readyState == 4) { 
				if(xhr.responseText == null) {
					errTxt.innerHTML += 'An error occured. Please make sure you have a good internet connection.<br>';
				} else {
					if(xhr.responseText.indexOf('Success') != 0) {
						errTxt.innerHTML += xhr.responseText;
					} else {
						document.getElementById('login-popup').innerHTML = '<div id="box-title">Welcome, ' + username + '.</div>';
					}
				}
			}
		};
	}
}

function justLogIn() {
	Array.prototype.forEach.call(document.getElementsByClassName('signup-not-login'), function(element) {
		element.style.display = 'none';
	});
	document.getElementById('switch-signup').setAttribute('onclick', 'justSignUp()');
	document.getElementById('switch-signup').value = 'Sign up';
	document.getElementById('signup-button').setAttribute('onclick', 'login()');
	document.getElementById('signup-button').value = 'Log In';
	document.getElementById('login-heading').innerHTML = 'Welcome back.';
	document.getElementById('login-error').innerHTML = '';
}

function justSignUp() {
	Array.prototype.forEach.call(document.getElementsByClassName('signup-not-login'), function(element) {
		element.style.display = 'initial';
	});
	document.getElementById('switch-signup').setAttribute('onclick', 'justLogIn()');
	document.getElementById('switch-signup').value = 'Log in';
	document.getElementById('signup-button').setAttribute('onclick', 'signup()');
	document.getElementById('signup-button').value = 'Sign up';
	document.getElementById('login-heading').innerHTML = 'Create an account';
	document.getElementById('login-error').innerHTML = '';
}

if(localStorage.getItem('username') == null) {
	document.getElementById('login-popup').classList.remove('hidden');
}

FCMPlugin.getToken();
