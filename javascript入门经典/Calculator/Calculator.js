var oper_states; //操作状态
var operator; //操作符
var num1; //第一个数

//设置开始状态
function setStartState() {
	oper_states = false;
	operator = "isempty";
	num1 = 0;
}

//添加数字
function add(number) {
	if (oper_states) {
		document.cal.calc_text.value = number;
		oper_states = false;
	} else {
		if (document.cal.calc_text.value == "0") {
			document.cal.calc_text.value = number;
		} else {
			document.cal.calc_text.value += number;
		}
	}
}

//添加小数点
function addPoint() {
	document.cal.calc_text.value += ".";
}

//操作符
function setOper(oper) {
	oper_states = true;
	if (operator == "isempty") {
		num1 = 0 + document.cal.calc_text.value;
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
			num1 = parseFloat(num1) + parseFloat(document.cal.calc_text.value);
			break;
			case "-":
			num1 = parseFloat(num1) - parseFloat(document.cal.calc_text.value);
			break;
			case "*":
			num1 = parseFloat(num1) * parseFloat(document.cal.calc_text.value);
			break;
			case "/":
			num1 = parseFloat(num1) / parseFloat(document.cal.calc_text.value);
			break;
		}
		document.cal.calc_text.value = num1;
	}
	operator = "isempty";
}

//清空数据
function clearText() {
	document.cal.calc_text.value = "0";
	operator = "isempty";
}
