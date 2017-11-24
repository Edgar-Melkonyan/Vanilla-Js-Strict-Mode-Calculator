"use strict";

(function() {
	function Calculator() {
		let expression = [],
			result = 0;

		function isNumber(n) {
			return !Object.is(NaN, Number(n)) || n !== n;
		}

		function cleanExpression(expr) {
			for (let i = 0; i < expr.length; ++i) {
				if (isNumber(expr[i])) {
					expr[i] = Number(expr[i]);
				} else {
					if (expr[i] === '-') {
						if (i < expr.length && expr[i + 1] < 0) {
							expr[i] = '+';
							expr[i + 1] *= -1;
						}
					} else if (expr[i] === '^') {
						expr[i] = '**';
					}
				}
			}
			return expr;
		}
		this.clearAll = function() {
			expression.length = 0;
			result = 0;
		};
		this.clearLast = function() {
			return expression.pop();
		};
		this.isValidExpression = function() {
			let shouldBeNumber = true;
			for (let i = 0, len = expression.length; i < len; ++i) {
				if (shouldBeNumber) {
					if (!isNumber(expression[i])) {
						return false;
					}
					shouldBeNumber = false;
				} else {
					if (isNumber(expression[i])) {
						return false;
					}
					shouldBeNumber = true;				
				}
			}
			return isNumber(expression[expression.length - 1]);
		};
		this.evaluate = function() {
			if (this.isValidExpression()) {
				result = Number(eval(cleanExpression(expression).join('')).toFixed(5));
				expression.length = 0;
				expression.push(result);
			}
		};
		this.lastInput = function() {
			return expression[expression.length - 1];
		};
		this.setLastInput = function(value) {
			expression[expression.length - 1] = value;
		};
		this.addInput = function(input) {
			if (isNumber(this.lastInput()) && !isNumber(input)) {
				expression.push(input);
			} else if (!isNumber(this.lastInput()) && isNumber(input)) {
				expression.push(input);
			}
		};
		this.getExpression = function() {
			return expression.join('');
		};
		this.getResult = function() {
			return result;
		};
		this.handleInput = function(input) {
			let inputType = isNumber(input) ? 'number' : 'string',
				lastInput = calculator.lastInput(),
				lastInputType = isNumber(lastInput) ? 'number' : 'string';

			if (inputType === 'number') {
				if (lastInputType === 'number') {
					if (lastInput === this.getResult() || lastInput !== lastInput) {
						this.clearAll();
						this.addInput(input);
					} else {
						this.setLastInput(lastInput + input);
					}
				} else {
					this.addInput(input);
				}
			} else if (inputType === 'string') {
				if (input === '=') {
					this.evaluate();
				} else if (input === '.') {
					if (lastInputType === 'number' && lastInput !== this.getResult() && lastInput.indexOf('.') === -1) {
						this.setLastInput(lastInput + '.');
					}
				} else if (input === 'AC') {
					calculator.clearAll();
				} else if (input === 'CE') {
					calculator.clearLast();
				} else if (input === '±') {
					if (isNumber(calculator.lastInput())) {
						calculator.setLastInput(calculator.lastInput() * -1);
					}
				} else {
					this.addInput(input);
				}
			}
		};
	}

	function getKeyPressed(keycode, isShifting) {
		const keys = {
			8: "CE",
			13: "=",
			46: "CE",
			48: "0",
		    49: "1",
		    50: "2",
		    51: "3",
		    52: "4",
		    53: "5",
		    54: "6",
		    55: "7",
		    56: "8",
		    57: "9",
		    61: "=",
		    65: "AC",
		    67: "CE",
		    96: "0",
			97: "1",
 			98: "2",
 			99: "3",
 			100: "4",
 			101: "5",
 			102: "6",
 			103: "7",
 			104: "8",
 			105: "9",
 		    106: "*",
		    107: "+",
		    108: "-",
		    109: "-",
		    110: ".",
		    111: "/",
		    187: "=",
		    189: "-",
		    190: ".",
		    191: "/"
		},
		shiftKeys = {
			54: "^",
			56: "*",
			187: "+"
		};
		return isShifting ? shiftKeys[keycode] : keys[keycode]; 
	}

	function highlight(button) {
		if (button) {
			button.classList.toggle('highlight');
			setTimeout(function() {
				button.classList.toggle('highlight');
			}, 200);
		}
	}

	const screen = document.getElementById('screen'),
		  buttons = document.getElementById('buttons');

	let calculator = new Calculator();

	window.addEventListener('keydown', function(e) {
		let keycode = e.keyCode || e.which,
			isShifting = e.shiftKey,
			key = getKeyPressed(keycode, e.shiftKey);
		if (key) {
			highlight(document.querySelector(`[data-id="${key}"]`));
			calculator.handleInput(key);
		}
		screen.textContent = calculator.getExpression();
	});

	buttons.addEventListener('click', function(e) {
		let key = e.target.getAttribute('data-id');
		if (key) {
			calculator.handleInput(key);
		}
		screen.textContent = calculator.getExpression();
	});
}());