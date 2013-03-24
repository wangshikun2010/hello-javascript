var isOperatorInputed; //操作状态
var operator; //操作符
var num1; //第一个数
var scores = [];
var storage; //储存数据标志变量
var old_operator;
var num2;

//设置开始状态
window.onload = function setStartState() {
    storage = false;
    isOperatorInputed = false;
    operator = "isempty";
    num1 = 0;
    var ndDisplay = document.cal.calc_text;
    :qa

:visual
q


:q

    bindButtonHandlers();
}

/**
 * 这个函数的作用是在按钮上绑定事件
 */
function bindButtonHandlers() {
    buttons = document.getElementsByTagName('li');
    for (var i=0; i<buttons.length; i++) {
        var text = buttons[i].innerText;
        var buttonHandler = function () {};
        switch(text) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                buttonHandler = createNumberButtonHandler(text);
                break;
            case '＋':
            case '－':
            case '×':
            case '÷':
                buttonHandler = createOperatorButtonHandler(text);
                break;
            case '.':
                buttonHandler = addPoint;
                break;
            case '=':
                buttonHandler = getResult();
                break;
            case 'AC':
                buttonHandler = clearResult();
                break;
        }
        buttons[i].addEventListener('click', buttonHandler, false);
    }
}

/**
 * 创建1个数字按钮的回调函数
 */
function createNumberButtonHandler(number) {
    return function() {
        addNumber(number);
    };
}

/**
 * 创建1个运算符按钮的回调函数
 */
function createOperatorButtonHandler(operator) {
    if (operator === '×') {
        operator = '*';
    }
    if (operator === '÷') {
        operator = '/';
    }
    return function() {
        setOperator(operator);
    };
}

/**
 * 添加数字
 */
function addNumber(number) {
    if (storage == true) {
        ndDisplay.value = number;
        storage = false;
    } else {
        if (isOperatorInputed == true) {
            ndDisplay.value = number;
            isOperatorInputed = false;
        } else {
            if (ndDisplay.value == "0") {
                ndDisplay.value = number;
            } else {
                ndDisplay.value += number;
            }
        }
    }
}


/**
 * 添加小数点
 */
function addPoint() {
    ndDisplay.value += ".";
}

/**
 * 设置操作符
 */
function setOperator(oper) {
    isOperatorInputed = true;
    if (operator == "isempty") {
        num1 = 0 + ndDisplay.value;
        operator = oper;
    } else {
        oper = oper.charAt(oper.length - 1);
        operator = oper;
        getResult();
    }
}

/**
 * 计算结果
 */
function getResult() {
    if (operator != "isempty") {
        old_operator = operator;
        var number1 = parseFloat(num1);
        var number2 = parseFloat(ndDisplay.value);
        num2 = number2;
        switch(operator) {
            case "+":
                result = number1 + number2;
                break;
            case "-":
                result = number1 - number2;
                break;
            case "*":
                result = number1 * number2;
                break;
            case "/":
                result = number1 / number2;
                break;
        }
        console.log('' + number1 + operator + number2 + '=' + result);
        ndDisplay.value = result;
        operator = "isempty";
        storage = true;
    } else {
        if (storage == true) {
            switch(old_operator) {
                case "+":
                    ndDisplay.value = (ndDisplay.value) + (num2);
                    break;
                case "-":
                    ndDisplay.value = (ndDisplay.value) - (num2);
                    break;
                case "*":
                    ndDisplay.value = (ndDisplay.value) * (num2);
                    break;
                case "/":
                    ndDisplay.value = (ndDisplay.value) / (num2);
                    break;
            }
        }
    }
}

//清空数据
function clearResult() {
    ndDisplay.value = "0";
    operator = "isempty";
}
