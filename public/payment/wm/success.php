<!-- success.html -->
<?php
require dirname(dirname(__FILE__)) . "/payment.php";
$balance = GetBalance($_GET['CONTACT_ID']);
?>
 
<html> 
<head> 
<title>Платеж проведен успешно</title> 
</head> 
<body> 

<h1>Платеж был успешно выполнен</h1> 
<p>Ваш текущий баланс: <?php echo $balance; ?> р.</p> 
</body> 
</html>