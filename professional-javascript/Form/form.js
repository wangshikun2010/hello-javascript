function Form(form) {
    this.form = form;
}

Form.prototype = {

}

EventUtil.addHandler(window, 'load', function(event) {
    var ndForm = $('#j-form');
    var ndTextInput = $('#j-text-input');
    var ndTextarea = document.forms[0].elements['textarea'];

    // var form = new Form(ndForm);

    var colorfields = ndForm.elements['color'];
    console.log(colorfields.length);
    console.log(colorfields[0], ndForm.elements[0]);
    console.log(colorfields[0].disabled);
    console.log(colorfields[0].form);
    console.log(colorfields[0].name);
    console.log(colorfields[0].readOnly);
    console.log(colorfields[0].tabIndex);
    console.log(colorfields[0].type);
    console.log(colorfields[0].value);

    colorfields[0].value = 'green';
    colorfields[0].disabled = true;
    colorfields[0].type = 'checkbox';

    EventUtil.addHandler(ndTextInput, 'focus', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        console.log(event.type);

        if (target.style.background != 'red') {
            target.style.background = 'yellow';
        }
    });

    EventUtil.addHandler(ndTextInput, 'blur', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        console.log(event.type);

        if (/[^\d]/.test(target.value)) {
            target.style.background = 'red';
        } else {
            target.style.background = '';
        }
    });

    EventUtil.addHandler(ndTextInput, 'change', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        console.log(event.type);

        if (/[^\d]/.test(target.value)) {
            target.style.background = 'red';
        } else {
            target.style.background = '';
        }
    });

    // EventUtil.addHandler(ndTextarea, 'focus', function(event) {
    //     event = EventUtil.getEvent(event);
    //     var target = EventUtil.getTarget(event);
    //     console.log(target);s
    //     target.select();
    //     EventUtil.preventDefault(event);
    // });

    EventUtil.addHandler(ndTextarea, 'select', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        console.log(target);
        console.log('select');
        console.log(getSelectText(target));
    });

    ndTextarea.value = 'hello world!';
    console.log(ndTextarea.setSelectionRange(0, ndTextarea.value.length));
    console.log(ndTextarea.setSelectionRange(0, 3));
    ndTextarea.focus();
})

function getSelectText(textbox) {
    if (document.selection) {
        return document.selection.createRange().text;
    } else {
        return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
    }
}

function $(selector) {
    if (document.querySelector) {
        return document.querySelector(selector);
    }
    if (selector.indexOf('#') === 0) {
        selector = selector.replace('#', '');
        return document.getElementById(selector);
    }
}