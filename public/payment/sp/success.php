<!-- success.html -->
<?php
// так как sprypay не возвращает contactid, то вычислить баланс на этой странице нельзя
//require realpath("./../payment.php");
//$balance = GetBalance($_POST['spUserData_contactid']);
?>
 
<html> 
<head> 
<title>Платеж проведен успешно</title> 
</head> 
<body> 

<h1>Платеж был успешно выполнен</h1>
<p>В ближайшие 10 минут платеж будет зачислен на Ваш кошелек</p>
<p>Проверить свой баланс Вы можете в разделе "Кошелек"</p>

<br>
<?php
//echo print_r($_POST);
?>

</body> 
</html>