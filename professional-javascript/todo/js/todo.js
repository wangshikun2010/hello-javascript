EventUtil.addHandler(window, 'load', function(event) {
    var todoListId = 0;
    var todoListLength = 0;
    var todoListComplete = 0;

    // 获取元素节点
    var ndTodoInputBox = $('#j-todo-input-box');
    var ndTodoSelectAll = $('#j-select-all');
    var ndTodoList = $('#j-todo-list');
    var ndFooter = $('footer');
    var ndTodoListLength = $('#j-todo-list-length');
    var ndTodoListComplete = $('#j-todo-list-complete');
    var ndTodoClearComplete = $('#j-todo-clear-complete');

    // 设置footer显示
    function setFooterDisplay() {
        if (ndTodoList.childNodes.length == 0) {
            ndFooter.style.display = 'none';
            ndTodoSelectAll.style.display = 'none';
        } else {
            ndFooter.style.display = 'block';
            ndTodoSelectAll.style.display = 'block';
        }
    }
    setFooterDisplay();

    // 设置清空按钮显示
    function setClearButtonDisplay() {
        var hasCompletedTodo = false;

        for (var i=0; i<ndTodoList.childNodes.length; i++) {
            if (ndTodoList.childNodes[i].querySelector('input').checked) {
                hasCompletedTodo = true;
                break;
            }
        }

        if (hasCompletedTodo) {
            ndTodoClearComplete.style.display = 'block';
        } else {
            ndTodoClearComplete.style.display = 'none';
        }

    }
    setClearButtonDisplay();

    EventUtil.addHandler(document.forms[0], 'submit', function(event) {
        event = EventUtil.getEvent(event);
        EventUtil.preventDefault(event);

        // add a todo list element
        var ndTodoItem = document.createElement('li');
        todoListId++;
        ndTodoItem.setAttribute('id', todoListId);
        ndTodoItem.innerHTML =  '<input type="checkbox" class="todo-list-checked">' +
                                '<span class="todo-list-content">' + ndTodoInputBox.value + '</span>' + 
                                '<a class="todo-list-delete">删除</a>';
        ndTodoList.insertBefore(ndTodoItem, ndTodoList.firstChild);

        ndTodoInputBox.value = '';

        // 显示footer和项目条数
        setFooterDisplay();
        update();

        EventUtil.addHandler(ndTodoItem, 'dblclick', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            var todoItemValue = target.innerText;
            console.log(todoItemValue);


            ndTodoItem.innerHTML = '<form><input type="text" class=""/></form>';
            console.log(ndTodoItem.innerHTML);
        });

        var ndTodoCheckbox = ndTodoItem.querySelector('input');
        var ndTodoDelete = ndTodoItem.querySelector('a');

        if (ndTodoCheckbox) {
            EventUtil.addHandler(ndTodoCheckbox, 'click', changeStyle);
        }

        if (ndTodoDelete) {
            EventUtil.addHandler(ndTodoDelete, 'click', deleteTodoItem);
        }

        function changeStyle(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            if (target.checked) {
                ndTodoItem.querySelector('span').setAttribute('class', 'todo-list-complete');
            } else {
                ndTodoItem.querySelector('span').setAttribute('class', 'todo-list-content');
            }
            update();
            setClearButtonDisplay();
        }

        function deleteTodoItem(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            EventUtil.preventDefault(event);

            EventUtil.removeHandler(ndTodoDelete, 'click', deleteTodoItem);
            EventUtil.removeHandler(ndTodoCheckbox, 'click', changeStyle);

            ndTodoDelete.parentNode.parentNode.removeChild(ndTodoDelete.parentNode);
            
            update();
            setFooterDisplay();
            setClearButtonDisplay();
        } 
    });

    EventUtil.addHandler(ndTodoClearComplete, 'click', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        for (var i=0, todolist=ndTodoList.childNodes, len=todolist.length; i<len; i++) {
            console.log(todolist[i].id);
            if (todolist[i].querySelector('input').checked) {
                ndTodoList.removeChild(todolist[i]);
            }
        }
        update();
    });

    // 给全选按钮添加事件
    EventUtil.addHandler(ndTodoSelectAll, 'click', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        if (target.checked) {
            for (var i=0; i<ndTodoList.childNodes.length; i++) {
                ndTodoList.childNodes[i].querySelector('input').checked = true;
            }
        } else {
            for (var i=0; i<ndTodoList.childNodes.length; i++) {
                ndTodoList.childNodes[i].querySelector('input').checked = false;
            }
        }
        update();
        setClearButtonDisplay();
    });

    for (var i=0; i<ndTodoList.length; i++) {
        // 编辑项目
        EventUtil.addHandler(ndTodoList[i], 'mouseover', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            console.log('target');
            // target.innerHTML = ''
        })
    }

    function update() {
        todoListComplete = 0;
        for (var i=0; i<ndTodoList.childNodes.length; i++) {
            var ndCheckbox = ndTodoList.childNodes[i].querySelector('input');
            if (ndCheckbox.type == 'checkbox' && ndCheckbox.checked == true) {
                todoListComplete++;
            }
        }
        todoListLength = ndTodoList.childNodes.length - todoListComplete;
        ndTodoListLength.innerText = todoListLength;
        ndTodoListComplete.innerText = todoListComplete;

        if (ndTodoList.childNodes.length == 0) {
            ndTodoSelectAll.style.display = 'none';
        }

        var isAllChecked = true;
        for (var i=0; i<ndTodoList.childNodes.length; i++) {
            var ndCheckbox = ndTodoList.childNodes[i].querySelector('input');
            if (ndCheckbox.type == 'checkbox' && ndCheckbox.checked == true) {
            } else {
                isAllChecked = false;
                break;
            }
        }

        if (isAllChecked == true) {
            ndTodoSelectAll.firstChild.checked = true;
        }
    }

});

function $(selector) {
    if (document.querySelector) {
        return document.querySelector(selector);
    }
    if (selector.indexOf('#') === 0) {
        selector = selector.replace('#', '');
        return document.getElementById(selector);
    }
}