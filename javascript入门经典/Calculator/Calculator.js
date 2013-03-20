var oper_states; //操作状态
var operator; //操作符
var num1; //第一个数
var scores = [];

//设置开始状态
window.onload = function setStartState() {
	oper_states = false;
	operator = "isempty";
	num1 = 0;
	var calc_text = document.cal.calc_text;
	li_event();
}

//添加数字
function add(number) {
	if (oper_states) {
		calc_text.value = number;
		oper_states = false;
	} else {
		if (calc_text.value == "0") {
			calc_text.value = number;
		} else {
			calc_text.value += number;
		}
	}
}

scores = document.getElementsByTagName('li');
function li_event() {
	for (var i=0; i<scores.length; i++) {
		switch(scores[i].innerHTML) {
			case '1':
			scores[i].addEventListener('click',add('1'),false);
			case '2':
			scores[i].addEventListener('click',add('2'),false);
			case '3':
			scores[i].addEventListener('click',add('3'),false);
		}
	}
}

//添加小数点
function addPoint() {
	calc_text.value += ".";
}

//操作符
function setOper(oper) {
	oper_states = true;
	if (operator == "isempty") {
		num1 = 0 + calc_text.value;
		operator = oper;
	} else {
		oper = oper.charAt(oper.length - 1);
		operator = oper;
		count();
	}
}

//计算结果
function count() {
	if (operator != "isempty") {
		switch(operator) {
			case "+":
			num1 = parseFloat(num1) + parseFloat(calc_text.value);
			break;
			case "-":
			num1 = parseFloat(num1) - parseFloat(calc_text.value);
			break;
			case "*":
			num1 = parseFloat(num1) * parseFloat(calc_text.value);
			break;
			case "/":
			num1 = parseFloat(num1) / parseFloat(calc_text.value);
			break;
		}
		calc_text.value = num1;
	}
	operator = "isempty";
}

//清空数据
function clearText() {
	calc_text.value = "0";
	operator = "isempty";
}
