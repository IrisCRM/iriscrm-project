function getRadioGroupValue(radioGroupObj) {
  for (var i=0; i < radioGroupObj.length; i++)
    if (radioGroupObj[i].checked)
		return radioGroupObj[i].value;
  return null;
}

function send_request(p_form) {

	var path = window.location.href.slice(0, window.location.href.lastIndexOf('/'));

	$('loading').show();
	$('message').hide();
	try {
		var recaptcha_challenge_field = p_form.recaptcha_challenge_field.value;
		var recaptcha_response_field = p_form.recaptcha_response_field.value;
	} catch (e) {
		var recaptcha_challenge_field = '';
		var recaptcha_response_field = '';
	}
	new Ajax.Request(path + '/bin/request.php', {
		parameters: {
			'email': p_form.email.value, 
			'account': p_form.account.value, 
			'allcount': p_form.allcount.value, 
			'count': p_form.count.value, 
			'comment': p_form.comment.value,
			/*'captcha': p_form.captcha.value,*/
			'recaptcha_challenge_field': recaptcha_challenge_field,
			'recaptcha_response_field': recaptcha_response_field,
			'reqtype': getRadioGroupValue(p_form.reqtype),
			'url': path.slice(0, path.lastIndexOf('/'))
		}, 
		onComplete: function(transport) {
			$('loading').hide();
			try {
				var result = transport.responseText.evalJSON();
			} catch (e) {
				result = new Array();
				result.errflag = 1;
				result.message = 'Не удалось сформировать запрос лицензий';
				if (transport.responseText == 'Could not open socket') {
					result.message += '<br>Ошибка Recaptcha - Could not open socket.';
				}
			}
			
			if (result.errflag == 0) {
				$('message').addClassName('ok');
				p_form.reqbtn.setAttribute('disabled', 'disabled');
			} else
				$('message').removeClassName('ok');
			
			$('message').update(result.message).show();
			
			if (result.errflag == 2) {
				Recaptcha.reload();
				Recaptcha.focus_response_field();
			}
		}
	});

}


function showCaptcha() {
	try {
		Recaptcha.create("6LeHmLoSAAAAADv1Z7rZJeYpZXbDFT-6gVAntJKZ", "recaptcha_cont", {
			lang: "ru",
			theme: "white",
			callback: Recaptcha.focus_response_field
		});
	} catch (e) {
		$('recaptcha_cont').hide();
		$('recaptcha_caption').hide();
		$('rt1').setAttribute('disabled', 'disabled');
		$('rt1').checked = false;
		$('rt2').checked = true;
	}
}

