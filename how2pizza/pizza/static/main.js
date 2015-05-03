'use strict';

var PEOPLE_PER_PIZZA = 3;

// Converts textarea input to list of lists of ingredients
function getRecords() {
	var records = [];
	var input = document.getElementById("records").value;
	var lines = input.split("\n");
	for (var i = 0, len = lines.length; i < len; i++) {
		var line = lines[i];
		var toppings = line.split(",");
		toppings = toppings.map(function (elem) { return elem.trim(); });
		records.push(toppings);
	}
	return records;
}

function getToppings() {
	// todo refactor to combine with getRecords
	var toppings = [];
	var input = document.getElementById("records").value;
	var lines = input.split("\n");
	for (var i = 0, len = lines.length; i < len; i++) {
		var line = lines[i];
		var currentToppings = line.split(",");
		currentToppings = currentToppings.map(function (elem) {
			return elem.trim();
		});
		currentToppings = currentToppings.filter(function (elem) {
			return toppings.indexOf(elem) === -1;
		});
		toppings = toppings.concat(currentToppings);
	}
	return toppings;
}

function tallyVotes(records, toppings) {
	var votes = {};
	for (var i = 0, len = records.length; i < len; i++) {
		var record = records[i];
		for (var j = 0, len2 = record.length; j < len2; j++) {
			var topping = record[j];
			if (isNaN(votes[topping])) {
				votes[topping] = 0;
			}
			votes[topping]++;
		}
	}
	return votes;
}

function countVotes(records) {
	var count = 0;
	for (var i = 0, len = records.length; i < len; i++) {
		var record = records[i];
		count += record.length;
	}
	return count;
}

function getPeoplePerPizza() {
	return parseInt(document.getElementById("people-per-pizza").value) || PEOPLE_PER_PIZZA;
}

function getMaxPizzas(records) {
	return records.length / getPeoplePerPizza();
}

function getScores(records, toppings) {
	var pizzaScore = {};
	var numberOfVotes = tallyVotes(records, toppings);
	var totalVotes = countVotes(records);
	var maxPizzas = getMaxPizzas(records);
	for (var i = 0, len = toppings.length; i < len; i++) {
		var topping = toppings[i];
		pizzaScore[topping] = numberOfVotes[topping] / totalVotes * maxPizzas;
	}
	return pizzaScore;
}

function getMaxTopping(pizzaScores) {
	// surely there's a better way
	var maxTopping = null;
	var maxToppingScore = -1;
	for (var topping in pizzaScores) {
		var score = pizzaScores[topping];
		if (score > maxToppingScore) {
			maxTopping = topping;
			maxToppingScore = score;
		}
	}
	return maxTopping;
}

function calculatePizzas(records, toppings) {
	var pizzaScores = getScores(records, toppings);
	var numPizzas = {};
	var maxPizzas = getMaxPizzas(records);
	console.log(pizzaScores);
	for (var i = 0; i < maxPizzas; i++) {
		var topping = getMaxTopping(pizzaScores);
		if (!numPizzas[topping]) {
			numPizzas[topping] = 0;
		}
		console.log(numPizzas[topping]);
		numPizzas[topping]++;
		pizzaScores[topping]--;
	}
	return numPizzas;
}

function updatePizzaList() {
	var records = getRecords();
	var toppings = getToppings();
	var pizzasToOrder = calculatePizzas(records, toppings);
	var outputList = document.getElementById("pizza-list");
	while (outputList.hasChildNodes()) {
		outputList.removeChild(outputList.firstChild);
	}
	for (var topping in pizzasToOrder) {
		var li = document.createElement('li');
		var count = pizzasToOrder[topping];
		li.textContent = count + " " + topping + " pizza" + (count == 1 ? "" : "s");
		outputList.appendChild(li);
	}
}

function updateShouldFeedCount() {
	var records = getRecords();
	document.getElementById("num-people").textContent = records.length;
	document.getElementById("people").textContent = records.length == 1 ? "person" : "people";
}

function updateUI() {
	updatePizzaList();
	updateShouldFeedCount();
}

function main() {
	document.addEventListener('keyup', updateUI);
}

main();