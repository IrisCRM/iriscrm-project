<?php$iriscrmKernelPath = dirname(dirname(dirname(dirname(__FILE__)))) . '/vendor/iriscrm/source-core/src/Iris/';require_once $iriscrmKernelPath . 'core/engine/bootstrap.php';require realpath("./../payment.php");$contact_id = $_GET['user_id'];$con = db_connect();$cmd = $con->prepare("select email from iris_contact where id=:id");$cmd->execute(array(":id" => $contact_id));$res = $cmd->fetchAll();$contact_email = $res[0][0];?><html><body>	<form action="http://sprypay.ru/sppi/" method="post">		<!--		Номер магазина продавца		-->		<input type="hidden" name="spShopId" value="1328"/>		<!--		Внутренний номер покупки продавца задает номер покупки в соответствии со своей системой учета.		Желательно использовать уникальный номер для каждого платежа, что позволит быстро получить относящуюся к нему информацию через другие интерфейсы системы "SpryPay".		формат: до 12 символов, цифры и латинские символы (cs)		-->		<!-- <input type="hidden" name="spShopPaymentId" value="1"/> -->		<!-- -->		<input type="text" name="spAmount" value="0.1"/>		<!-- -->		<input type="hidden" name="spCurrency" value="rur"/>		<!-- -->		<input type="hidden" name="spPurpose" value="пополнение баланса"/>		<!-- -->		<input type="hidden" name="spSuccessUrl" value="http://testing.iris-integrator.ru/sprypay/success.php"/>				<!--		E-mail адрес покупателя, на который высылается полная информация по совершаемому им платежу. 		Данный параметр не является обязательным. Может быть заранее определен продавцом ( допустим из собственной базы покупателей ), чтобы избавить покупателя от его ввода		-->		<input type="hidden" name="spUserEmail" value="<?php echo $contact_email ?>"/>		<input type="hidden" name="spUserData_contactid" value="<?php echo $contact_id ?>"/>		<!--		<input type="hidden" name="spUserData_paymdid" value=""/>		URL оповещения		URL на вашем сайте, на который будет приходить полная информация о платеже ( см. "Форма оповещения о платеже" ). Данный параметр является не обязательным, а в случае необходимости переопределяет подобный параметр в настройках магазина.		<input type="hidden" name="spIpnUrl" value=""/>				метод для URL оповещения		spIpnMethod		формат значения параметра: '1' для POST, '0' для GET метода.				URL удачного платежа		spSuccessUrl				URL неудачного платежа		spFailUrl				-->								<input type="submit" value="Оплатить"/>		</form></body></html>