<?php

require dirname(dirname(__FILE__)) . "/payment.php";

/*
$_POST['LMI_MODE'] = '1';
$_POST['LMI_PAYMENT_AMOUNT'] = '1.00';
$_POST['LMI_PAYEE_PURSE'] = 'R157324965788';
$_POST['LMI_PAYMENT_NO'] = '1';
$_POST['LMI_PAYER_WM'] = '144619064296';
$_POST['LMI_PAYER_PURSE'] = 'R157324965788';
$_POST['LMI_SYS_INVS_NO'] = '199';
$_POST['LMI_SYS_TRANS_NO'] = '162';
$_POST['LMI_SYS_TRANS_DATE'] = '20090722 11:53:50';
$_POST['LMI_HASH'] = '32C57E7C81DC3A06C0C052707EC3BA2E';

$_POST['CONTACT_ID'] = '005405b7-8344-49f6-98a2-e1891cbff803';
*/

// TODO: когда закончится тестовый режим, то установить данное условие
//if ((wm_is_hash() == true) and ($_POST['LMI_MODE'] == 0)) {
if (wm_is_hash() == true) {

	$con = db_connect();
	$h_res = $con->query("select count(id) from iris_payment where hash='".$_POST['LMI_HASH']."'")->fetchAll();
	
	if ((int)$h_res[0][0] == 0) {
		//теперь это делается триггером UpdateBalance($_POST['CONTACT_ID'], $_POST['LMI_PAYMENT_AMOUNT']);
		CreatePayments($_POST['CONTACT_ID'], $_POST['LMI_PAYMENT_AMOUNT']);
		//echo 'баланс увеличен, платежи внесены';
	} else {
		echo 'Платеж уже был проведен';
	}
}

?>



