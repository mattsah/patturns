window.addEventListener('DOMContentLoaded', function(e) {
    var html_editor  = ace.edit('html-code');
    var css_editor   = ace.edit('css-code');
	var result       = document.querySelector('#result');
	var preview      = document.querySelector('#preview');
	var pattern_list = document.querySelector('#patterns');
	var style        = document.createElement('style');
	var patterns     = JSON.parse(localStorage.getItem('patterns') ? localStorage.getItem('patterns') : 'null');
	var active       = null;
	var hasStyle     = false;

    html_editor.setTheme('ace/theme/clouds');
    html_editor.getSession().setMode('ace/mode/html');

    css_editor.setTheme('ace/theme/clouds');
    css_editor.getSession().setMode('ace/mode/css');

	var refreshResult = function() {
		var html_content = html_editor.getSession().getValue();
		var css_content  = css_editor.getSession().getValue();
		var body         = preview.contentDocument.body;
		var head         = preview.contentDocument.head;

		style.innerHTML  = css_content;
		body.innerHTML   = html_content;

		if (hasStyle) {
			head.removeChild(style);
		}

		head.appendChild(style);
		hasStyle = true;
	};

	var loadPattern = function(name) {
		active = name.toUpperCase();

		html_editor.setValue(patterns[active].html);
		css_editor.setValue(patterns[active].css);

		refreshResult();
	}

	var addPattern = function(name) {
		var li      = document.createElement('li');
		var a       = document.createElement('a');
		a.innerHTML = name.toUpperCase();

		a.addEventListener('click', function(e) {
			loadPattern(e.target.innerHTML);
		});

		li.appendChild(a);
		pattern_list.appendChild(li);
	};

	var save = function(e) {
	    if (!(String.fromCharCode(e.charCode) == 's' && e.ctrlKey)) {
			return true;
		}

		window.alertify.prompt('Give Your Pattern a Name', function (e, name) {
		    if (e) {
                name = name.toUpperCase();

                if (patterns[name] == undefined || !patterns[name]) {
                    addPattern(name);
                }

				patterns[name] = {
				 	"html": html_editor.getSession().getValue(),
					"css":  css_editor.getSession().getValue()
				};

				localStorage.setItem('patterns', JSON.stringify(patterns));
		    }

		}, active ? active : 'Pattern Name');

	    e.preventDefault();
	    return false;
	};

	if (patterns) {
		for (var name in patterns) {
			addPattern(name);
		}

	} else {
		patterns = {};
	}

	result.addEventListener('click', function(e) {
		refreshResult();
	});

	window.addEventListener('keypress', function(e) {
		return save(e);
	}, false);

	preview.addEventListener('keypress', function(e) {
		return save(e);
	}, false);


}, false);
