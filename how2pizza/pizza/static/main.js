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
		newType.maxLength = '24';
		typesList.appendChild(newType);
		newType.focus();
	}
}

function clearPizzaList(pizzaList) {
	while (pizzaList.children.length > 0) {
		pizzaList.removeChild(pizzaList.lastChild);
	}
	return pizzaList;
}

function getChoices() {
	var userChoices = document.getElementsByClassName('user-choice');
	var choices = [];
	for (var i = 0, len = userChoices.length; i < len; i++) {
		var choice = userChoices[i];
		var name = choice.children[0].textContent;
		var pizzaTypes = choice.children[1].textContent.split(', ');
		choices.push({
			name: name,
			types: pizzaTypes
		});
	}
	return choices;
}

function getPizzaTypesByFrequency(choices) {
	var counts = {};
	for (var i = 0, len = choices.length; i < len; i++) {
		var choice = choices[i];
		var name = choice.name;
		var types = choice.types;
		for (var j = 0, len2 = types.length; j < len2; j++) {
			var type = types[j];
			if (typeof(counts[type]) == 'undefined') {
				counts[type] = 0;
			}
			counts[type]++;
		}
	}
	return counts;
}

function getPeoplePerPizza() {
	var ppp = parseFloat(document.getElementById('people-per-pizza').value);
	localStorage.setItem('ppp', ppp);
	return ppp;
}

function getMostPopularPizzaTypeBesidesCheese(counts, types) {
	var maxCount = 0;
	var bestType = 'cheese';
	for (var i = 0, len = types.length; i < len; i++) {
		var type = types[i];
		if (type != 'cheese' && counts[type] > maxCount) {
			bestType = type;
			maxCount = counts[type];
		}
	}
	return bestType;
}

function getPickiestChoices(choices) {
	choices.sort(function (a, b) {
		return a.types.length - b.types.length;
	});
	return choices;
}

function getPickiestChoice(choices) {
	return getPickiestChoices(choices)[0];
}

function removeNPickiestWhoChose(choices, n, bestType) {
	n = Math.floor(n);
	var choicesWhoLikeBestType = choices.filter(function (val, idx, arr) {
		return val.types.indexOf(bestType) != -1;
	});
	var pickiest = getPickiestChoices(choicesWhoLikeBestType);
	for (var i = 0, len = Math.min(pickiest.length, n); i < len; i++) {
		choices = choices.filter(function(val, idx, arr) {
			return val.name != pickiest[i].name;
		});
	}
	return choices;
}

function updatePizzaList() {
	var pizzaList = clearPizzaList(document.getElementById('pizza-list'));
	var choices = getChoices();
	var counts = getPizzaTypesByFrequency(choices);
	var peoplePerPizza = getPeoplePerPizza();
	if (peoplePerPizza <= 0 || isNaN(peoplePerPizza)) {
		var li = document.createElement('li');
		li.textContent = "Nothing. If you're not feeding anyone, why order?";
		pizzaList.appendChild(li);
		return;
	}
	var numPizzas = Object.keys(choices).length / peoplePerPizza;
	var pizzasToBuy = {}
	for (var i = 0; i < numPizzas; i++) {
		var pickiest = getPickiestChoice(choices);
		var bestType = getMostPopularPizzaTypeBesidesCheese(counts, pickiest.types);
		if (typeof(pizzasToBuy[bestType]) == 'undefined') {
			pizzasToBuy[bestType] = 0;
		}
		pizzasToBuy[bestType]++;
		choices = removeNPickiestWhoChose(choices, peoplePerPizza, bestType);
		if (choices.length == 0) {
			break;
		}
		counts = getPizzaTypesByFrequency(choices);
	}
	for (var type in pizzasToBuy) {
		var li = document.createElement('li');
		var num = pizzasToBuy[type]
		li.textContent = num + " " + type;
		pizzaList.appendChild(li);
	}
}

function updateWhatYouWant() {
	var name = this.children[0].textContent;
	var types = this.children[1].textContent.split(', ');
	document.getElementById('name').value = name;
	var checkboxDiv = document.getElementById('existing-types');
	for (var i = 0, len = checkboxDiv.children.length; i < len; i++) {
		var checkbox = checkboxDiv.children[i].firstChild;
		checkbox.checked = false;
		for (var j = 0, len2 = types.length; j < len2; j++) {
			if (checkbox.value == types[j]) {
				checkbox.checked = true;
			}
		}
	}
}

function resetForm() {
	document.getElementById('name').value = '';
	var checkboxDiv = document.getElementById('existing-types');
	for (var i = 0, len = checkboxDiv.children.length; i < len; i++) {
		var checkbox = checkboxDiv.children[i].firstChild;
		checkbox.checked = false;
	}
}

function main() {
	document.getElementById("add-pizza").addEventListener('focus', addNewPizza);
	document.getElementById("people-per-pizza").addEventListener('keyup', updatePizzaList);
	var userChoices = document.getElementsByClassName("user-choice");
	for (var i = 0, len = userChoices.length; i < len; i++) {
		userChoices[i].addEventListener('click', updateWhatYouWant.bind(userChoices[i]));
	}
	document.getElementById("reset-form").addEventListener('click', resetForm);
	document.getElementById('people-per-pizza').value = localStorage.getItem('ppp') || '3';
	updatePizzaList();
}

main();