/*eslint no-unused-vars:off*/

let xhr = new XMLHttpRequest();

function signup() {
	
	xhr.open(`https://thomaskaldahl.com/skyline/newacc.php?`);
}

if(localStorage.getItem('username') == null) {
	document.getElementById('login-popup').classList.remove('hidden');
}
