$(function() {

    var todo = new Object();

    todo.ndTodoSync = $('#j-todo-sync');
    todo.ndTodoInputBox = $('#j-todo-input-box');
    todo.ndTodoSelectAll = $('#j-select-all');
    todo.ndTodoList = $('#j-todo-list');
    todo.ndFooter = $('footer');
    todo.ndTodoListLength = $('#j-todo-list-length');
    todo.ndTodoClearComplete = $('#j-todo-clear-complete');
    todo.ndTodoListCompleteLength = $('#j-todo-complete-length');

    todo.todoListLength = 0;
    todo.todoListComplete = 0;
    todo.ndTodoItem = null;

    // todo.createXHR = function() {
    //     if (typeof XMLHttpRequest != 'undefined') {
    //         return new XMLHttpRequest();
    //     } else if (typeof ActiveXObject != 'undefined') {
    //         if (typeof arguments.callee.activeXString != 'string') {
    //             var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0','MSXML.XMLHttp'];
    //             for (var i=0,len=versions.length; i<len; i++) {
    //                 try {
    //                     var xhr = new ActiveXObject(versions[i]);
    //                     arguments.callee.activeXString = versions[i];
    //                     return xhr;
    //                 } catch (ex) {
    //                     //
    //                 }
    //             }
    //         }
    //         return new ActiveXObject(arguments.callee.activeXString);
    //     }
    // }

    // todo.request = function(url, method, data, callback) {

    //     todo.ndTodoSync[0].style.display = 'block';
    //     var xhr = todo.createXHR();

    //     // 在准备状态变化时执行
    //     xhr.onreadystatechange = function() {
    //         if (xhr.readyState === 4 && xhr.status === 200) {
    //             todo.ndTodoSync[0].style.display = 'none';
    //             // console.log(url);
    //             // console.log(data);
    //             var response = JSON.parse(xhr.responseText);
    //             callback(response);
    //         }
    //     }

    //     // NOTE POST请求需要设置额外的Header
    //     xhr.open(method, url, true);
    //     if (method.toLowerCase() == 'post') {
    //         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //     }
    //     xhr.send(data);
    // }

    todo.initTodo = function() {

        // 获取全部数据并添加到页面
        $.get('/cakephp-2.3.7/todos', null, function (response) {
            for (var i=0; i<response.length; i++) {
                // console.log(response[i]);
                todo.addTodoItem(response[i]);
            }

            todo.update();
            todo.setFooterDisplay();
            todo.clearAllComplete();
            todo.selectAll();
        });

        EventUtil.addHandler(document.forms[0], 'submit', function(event) {
            event = EventUtil.getEvent(event);
            EventUtil.preventDefault(event);

            // 添加一个todoItem
            var todoInputValue = encodeURIComponent(todo.ndTodoInputBox[0].value);
            todo.ndTodoInputBox[0].value = '';
            $.post('/cakephp-2.3.7/todos/add', 'data[content]=' + todoInputValue, function(response) {
                if (response.status == true) {
                    todo.addTodoItem(response.data);
                }
            });
            
        });
    },
    
    todo.addTodoItem = function(todoItem) {
        // console.log(todoItem);
        // 创建一个todoItem
        todo.ndTodoItem = $('<li></li>');
        todo.ndTodoItem.attr('class', 'todo__item');
        todo.ndTodoItem.attr('id', todoItem.Todo.id);
        todo.ndTodoItem.html('<div class="todo__item__view"><input type="checkbox" name="todoChecked" class="todo__item__checked">' + '<span class="todo__item__content" id="j-todo-list-value">' + todoItem.Todo.content + '</span>' + '<a class="todo__item__delete"></a></div><input type="text" class="todo__item__edit" maxlength="25">');
        // console.log(todo.ndTodoItem);
        
        // 在加载完毕判断todoItem是否完成
        if (todoItem.Todo.completed == true) {
            todo.ndTodoItem.find('input[type=checkbox]').attr('checked', true);
            todo.ndTodoItem.find('span').attr('class', 'todo__item__complete');
        } else {
            todo.ndTodoItem.find('span').attr('class', 'todo__item__content');
        }

        // console.log(todo.ndTodoList.first());
        todo.ndTodoItem.prependTo(todo.ndTodoList);

        // 显示footer和项目条数
        todo.update();
        todo.setFooterDisplay();

        // 编辑todoItem
        EventUtil.addHandler(todo.ndTodoItem, 'dblclick', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            todo.editTodoItem(target);
        });

        // 获取todoItem的复选框和删除按钮
        // console.log(todo.ndTodoItem.html());
        var $ndTodoCheckbox = todo.ndTodoItem.find('div>input[type=checkbox]');
        var $ndTodoDelete = todo.ndTodoItem.find('a');

        // console.log($ndTodoCheckbox[0]);
        if ($ndTodoCheckbox.length > 0) {
            $ndTodoCheckbox.click(changeStyle);
            // EventUtil.addHandler($ndTodoCheckbox, 'click', changeStyle);
        }

        if ($ndTodoDelete.length > 0) {
            $ndTodoDelete.click(deleteTodoItem);
            // EventUtil.addHandler($ndTodoDelete, 'click', deleteTodoItem);
        }

        function changeStyle(event) {
            event = EventUtil.getEvent(event);
            var $target = $(EventUtil.getTarget(event));

            console.log($target);

            var completed = $target.prop('checked') ? 1 : 0;
            var $ndLi = $target.parents('li');

            console.log($ndLi);

            var todoItemId = encodeURIComponent($ndLi.attr('id'));
            $.get('/cakephp-2.3.7/todos/complete/' + todoItemId + '/' + completed, null, function(response) {
                if (response.status == true) {
                    if (completed) {
                        $ndLi.find('span').attr('class', 'todo__item__complete');
                    } else {
                        $ndLi.find('span').attr('class', 'todo__item__content');
                    }
                }

                todo.update();
                todo.setClearButtonDisplay();
            });
            
        }

        function deleteTodoItem(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            EventUtil.preventDefault(event);

            // 在删除todoItem时删除其绑定删除事件和改变样式事件
            EventUtil.removeHandler($ndTodoDelete, 'click', deleteTodoItem);
            EventUtil.removeHandler($ndTodoCheckbox, 'click', changeStyle);

            var todoItemId = encodeURIComponent(target.parentNode.parentNode.id);

            $.get('/cakephp-2.3.7/todos/delete/' + todoItemId, null, function(response) {
                if (response.status == true) {
                    target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
                }

                todo.update();
                todo.setFooterDisplay();
                todo.setClearButtonDisplay();
            });     
        }
    },

    todo.editTodoItem = function(element) {

        // 在编辑时将显示元素替换成输入框
        var ndEditInput = element.parentNode.nextSibling;
        ndEditInput.value = element.innerText;
        element.parentNode.style.display = 'none';
        ndEditInput.style.display = 'block';
        ndEditInput.focus();

        function changeText() {
            // 将编辑输入框的文本显示出来
            element.innerText = ndEditInput.value;
            element.parentNode.style.display = 'block';
            ndEditInput.style.display = 'none';

            var todoItemId = encodeURIComponent(element.parentNode.parentNode.id);
            todo.request('/cakephp-2.3.7/todos/edit/' + todoItemId, 'post', 'data[content]=' + ndEditInput.value, function(response) {});
        }

        EventUtil.addHandler(ndEditInput, 'blur', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            changeText();
        });

        EventUtil.addHandler(ndEditInput, 'keydown', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            if (event.keyCode == 13) {
               changeText();
            }
        });
    },

    todo.clearAllComplete = function() {

        // 清空所有已完成项目
        EventUtil.addHandler(todo.ndTodoClearComplete, 'click', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            var todoLists = document.getElementsByTagName('li');

            for (var i=0; i<todoLists.length; i++) {
                if (todoLists[i].querySelector('input[type=checkbox]').checked) {
                    todo.request('/cakephp-2.3.7/todos/delete/' + todoLists[i].id, 'get', null, (function(element) {
                        return function(response) {
                            if (response.status == true) {
                                // console.log(element);
                                element.parentNode.removeChild(element);

                                todo.update();
                                todo.setClearButtonDisplay();
                                todo.setFooterDisplay();
                            }
                        };
                    })(todoLists[i]));
                }
            }
        });
    },

    todo.selectAll = function() {

        // 给全选按钮添加事件
        EventUtil.addHandler(todo.ndTodoSelectAll, 'click', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            var completed = target.checked ? 1 : 0;

            if (completed) {
                for (var i=0; i<todo.ndTodoList.childNodes.length; i++) {
                    if (todo.ndTodoList.childNodes[i].querySelector('input[type=checkbox]').checked == false) {
                        todo.request('/cakephp-2.3.7/todos/complete/' + todo.ndTodoList.childNodes[i].id + '/' + completed, 'get', null, (function(element) {
                            return function(response) {
                                if (response.status == true) {
                                    element.querySelector('input[type=checkbox]').checked = true;
                                    element.querySelector('span').setAttribute('class', 'todo__item__complete');
                                }
                                todo.update();
                                todo.setClearButtonDisplay();
                            } 
                        })(todo.ndTodoList.childNodes[i]));
                    }
                }
            } else {
                for (var i=0; i<todo.ndTodoList.childNodes.length; i++) {
                    todo.request('/cakephp-2.3.7/todos/complete/' + todo.ndTodoList.childNodes[i].id + '/' + completed, 'get', null, (function(element) {
                        return function(response) {
                            if (response.status == true) {
                                element.querySelector('input[type=checkbox]').checked = false;
                                element.querySelector('span').setAttribute('class', 'todo__item__content');
                            }
                            todo.update();
                            todo.setClearButtonDisplay();
                        } 
                    })(todo.ndTodoList.childNodes[i]));
                }
            }
        });
    },

    // 设置footer显示
    todo.setFooterDisplay = function() {
        var $lis = todo.ndTodoList.find('li');
        if ($lis.length == 0) {
            todo.ndFooter[0].style.display = 'none';
            todo.ndTodoSelectAll[0].style.display = 'none';
        } else {
            todo.ndFooter[0].style.display = 'block';
            todo.ndTodoSelectAll[0].style.display = 'block';
        }
    },

    // 设置清空按钮显示
    todo.setClearButtonDisplay = function() {
        var hasCompletedTodo = false;

        var $lis = todo.ndTodoList.find('li');

        for (var i=0; i<$lis.length; i++) {
            if ($($lis[i]).find('input[type=checkbox]').prop('checked')) {
                hasCompletedTodo = true;
                break;
            }
        }

        if (hasCompletedTodo) {
            todo.ndTodoClearComplete[0].style.display = 'block';
        } else {
            todo.ndTodoClearComplete[0].style.display = 'none';
        }
    },

    // 更新数据
    todo.update = function() {
        // 计算选中个数和未选中的个数
        todo.todoListComplete = 0;
        var $lis = todo.ndTodoList.find('li');
        for (var i=0; i<$lis.length; i++) {
            // console.log($lis[i]);
            if ($($lis[i]).find('input[type=checkbox]').prop('checked')) {
                todo.todoListComplete++;
            }
        }
        todo.ndTodoListLength.text($lis.length - todo.todoListComplete);
        todo.ndTodoListCompleteLength.text(todo.todoListComplete);

        // 判断是否全选
        var isAllChecked = true;
        for (var i=0; i<$lis.length; i++) {
            if ($($lis[i]).find('input[type=checkbox]').prop('checked')) {
            } else {
                isAllChecked = false;
                break;
            }
        }

        if (isAllChecked == true) {
            todo.ndTodoSelectAll.find('input[type=checkbox]').attr('checked', true);
        } else {
            todo.ndTodoSelectAll.find('input[type=checkbox]').attr('checked', true);
        }
    }

    window['todo'] = todo;
    todo.initTodo();
})
