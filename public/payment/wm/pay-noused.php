<!-- pay.html --> 

<?php
require dirname(dirname(__FILE__)) . "/payment.php";
$contact_id = $_GET['user_id'];
?>

<html> 
<head> 
<title>Pay</title> 
</head> 

<body>
	<h1 style="padding: 5px 0px 5px 50px; background: url(logo_blue-small.png) no-repeat top left">Пополнение баланса через Webmoney</h1> 
	<form id=pay name=pay method="POST" action="https://merchant.webmoney.ru/lmi/payment.asp"> 
		<p>Введите сумму, на которую Вы хотите пополнить Ваш баланс</p> 
		<p>  

		<input type="text" name="LMI_PAYMENT_AMOUNT" value="1.0"> р.
		<input type="hidden" name="LMI_PAYMENT_DESC" value="Пополнение баланса">  
		<input type="hidden" name="LMI_PAYMENT_NO" value="">  
		<input type="hidden" name="LMI_PAYEE_PURSE" value="R157324965788">  
		<input type="hidden" name="LMI_SIM_MODE" value="0"> 
		<input type="hidden" name="CONTACT_ID" value="<?php echo $contact_id ?>"> 

		</p> 
		<p> 
		<input type="submit" value="Перейти к оплате"> 
		</p> 
	</form> 
</body> 
</html>