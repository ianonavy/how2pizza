'use strict';

function addNewPizza() {
	var typesList = document.getElementById('types-list');
	if (typesList.lastElementChild.value == '') {
		typesList.lastElementChild.focus();
	} else {
		var newType = document.createElement('input');
		newType.type = 'text';
		newType.className = 'pizza-type';
		newType.name = 'types[]';
		typesList.appendChild(newType);
		newType.focus();
	}
}

function main() {
	document.getElementById("add-pizza").addEventListener('focus', addNewPizza);
}

main();