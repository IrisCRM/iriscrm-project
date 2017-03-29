<?php

require dirname(dirname(__FILE__)) . "/payment.php";

if (function_exists('file_put_contents') == false) {
	function file_put_contents($filename, $data) {
		$f = @fopen($filename, 'a');
		if (!$f) {
			return false;
		} else {
			$bytes = fwrite($f, $data);
			fclose($f);
			return $bytes;
		}
	}
}


function write_to_log($p_string) {
	file_put_contents('log.txt', $p_string, FILE_APPEND);
}

// -----------------------------------
/*
$_POST['spPaymentId'] = '2009083676';
$_POST['spShopId'] = '1328';
$_POST['spShopPaymentId'] = '0';
$_POST['spBalanceAmount'] = '0.12';
$_POST['spAmount'] = '0.12';
$_POST['spCurrency'] = 'rur';
$_POST['spCustomerEmail'] = 'sidorov.crm@gmail.com';
$_POST['spPurpose'] = 'пополнение баланса';
$_POST['spPaymentSystemId'] = '0';
$_POST['spPaymentSystemAmount'] = '0.12';
$_POST['spPaymentSystemPaymentId'] = '2009083676';
$_POST['spEnrollDateTime'] = '2009-07-29 12:00:13';
$_POST['spUserData_contactid'] = '005405b7-8344-49f6-98a2-e1891cbff803';
$_POST['spHashString'] = '976f2fd7148967f1d9a1f66c7644bf20';
*/
// -----------------------------------


write_to_log('pay '.date('Y-m-d [H:i:s]').' -------------------'.sp_is_hash().'-'.chr(10));
write_to_log(var_export($_POST, true));
write_to_log(chr(10));

if (sp_is_hash() == true) {
	$con = db_connect();
	$h_res = $con->query("select count(id) from iris_payment where hash='".$_POST['spHashString']."'")->fetchAll();
	
	if ((int)$h_res[0][0] == 0) {
		//теперь это делается триггером UpdateBalance($_POST['spUserData_contactid'], $_POST['spBalanceAmount']);
		CreatePayments($_POST['spUserData_contactid'], $_POST['spBalanceAmount'], 'sp');
		echo 'OK';
		write_to_log(chr(10).'+ok'.chr(10));
	} else {
		echo 'Платеж уже был проведен';
		write_to_log(chr(10).'-alerady'.chr(10));
	}
} else {
	echo 'ERR invalid hash';
	write_to_log(chr(10).'-invalid hash'.chr(10));
}

?>