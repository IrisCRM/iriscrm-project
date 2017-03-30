<?php
/* общие функции для пополнения баланса */

$iriscrmKernelPath = dirname(dirname(dirname(__FILE__))) . '/vendor/iriscrm/core/src/Iris/';
require_once $iriscrmKernelPath . 'core/engine/bootstrap.php';
require_once Loader::getLoader()->loadOnce('common/Lib/lib.php');
require_once Loader::getLoader()->loadOnce('common/Lib/access.php');

function wm_is_hash() {
	$SECRET_KEY = GetSystemVariableValue('wm_secret_key', db_connect());

	$hash  = $_POST['LMI_PAYEE_PURSE'];
	$hash .= $_POST['LMI_PAYMENT_AMOUNT'];
	$hash .= $_POST['LMI_PAYMENT_NO'];
	$hash .= $_POST['LMI_MODE'];
	$hash .= $_POST['LMI_SYS_INVS_NO'];
	$hash .= $_POST['LMI_SYS_TRANS_NO'];
	$hash .= $_POST['LMI_SYS_TRANS_DATE'];
	$hash .= $SECRET_KEY;
	$hash .= $_POST['LMI_PAYER_PURSE'];
	$hash .= $_POST['LMI_PAYER_WM'];

	if (strtoupper(md5($hash)) == $_POST['LMI_HASH'])
		return 1;
	else
		return 0;
}

function sp_is_hash() {
	$SECRET_KEY = GetSystemVariableValue('sp_secret_key', db_connect());
	

	$hash  = $_POST['spPaymentId'];
	$hash .= $_POST['spShopId'];
	$hash .= $_POST['spShopPaymentId'];
	$hash .= $_POST['spBalanceAmount'];
	$hash .= $_POST['spAmount'];
	$hash .= $_POST['spCurrency'];
	$hash .= $_POST['spCustomerEmail'];
	$hash .= $_POST['spPurpose'];
	$hash .= $_POST['spPaymentSystemId'];
	$hash .= $_POST['spPaymentSystemAmount'];
	$hash .= $_POST['spPaymentSystemPaymentId'];
	$hash .= $_POST['spEnrollDateTime'];
	$hash .= $SECRET_KEY;

	if (strtolower(md5($hash)) == $_POST['spHashString'])
		return 1;
	else
		return 0;
}

function CreatePayments($p_user_id, $p_amount, $p_ps_name = 'wm') {
	// $p_ps_name - определяет платежную систеиму из  которой был совершен платеж (это нужно для создания номера счета)
	InsertPayment($p_amount, $p_ps_name);
}

function InsertPayment($p_amount, $p_ps_name) {
	$con = db_connect();
	
	// в зависимости от типа платежной системы формируем номер и получаем шв контакта из платежа
	if ($p_ps_name == 'wm') {
		$payment_num = $_POST['LMI_SYS_INVS_NO'].'-'.$_POST['LMI_SYS_TRANS_NO'];
		$contact_id = $_POST['CONTACT_ID'];
		$hash_value = $_POST['LMI_HASH'];
	}
	if ($p_ps_name == 'sp') {
		$payment_num = $_POST['spPaymentId'];
		$contact_id = $_POST['spUserData_contactid'];
		$hash_value = $_POST['spHashString'];
	}

	// получаем id вашей компании
	$res = $con->query("select T0.id from iris_account T0 left join iris_accounttype T1 on T0.accounttypeid = T1.id where T1.code='Your'")->fetchAll();
	$account_id_your = $res[0][0];

	// любой платеж пополнения баланса должен быть виден высшему руководству и пользователю, пополнившему баланс
	$role_res = $con->query("select id from iris_accessrole where code='leader'")->fetchAll();
	$permissions[] = array('userid' => '', 'roleid' => $role_res[0][0], 'r' => 1, 'w' => 1, 'd' => 1, 'a' => 1);
	$permissions[] = array('userid' => $contact_id, 'roleid' => '', 'r' => 1, 'w' => 0, 'd' => 0, 'a' => 0); // добавим пользователя в доступ на чтения на платеж

	$payment_name = $payment_num.' Пополнение баланса';
	
	$ins_sql = "insert into iris_payment (id, Number, Name, AccountID, ContactID, PaymentTypeID, PaymentStateID, PaymentDate, CurrencyID, Amount, hash, iscash) values (:id, :Number, :Name, :AccountID, :ContactID, (select id from iris_Paymenttype where code='In'), (select id from iris_PaymentState where code='Completed'), now(), (select id from iris_currency where code='RUB'), :Amount, :hash, 0)";
	$cmd = $con->prepare($ins_sql);
	$rec_id = create_guid();
	$cmd->BindParam(":id", $rec_id);
	$cmd->BindParam(":Number", $payment_num);
	$cmd->BindParam(":Name", $payment_name);
	$cmd->BindParam(":AccountID", $account_id_your);
	$cmd->BindParam(":ContactID", $contact_id);
	$cmd->BindParam(":Amount", $p_amount);
	$cmd->BindParam(":hash", $hash_value);
	$cmd->execute();

	// проставим права на эти платежи
	$res = ChangeRecordPermissions('iris_payment', $rec_id, $permissions);

	if ($cmd->errorCode() == '00000')
		return 0;
	else
		return 1;
}

function UpdateBalance($p_user_id, $p_amount) {
	include_once realpath(dirname(__FILE__)."/./../").'/core/engine/applib.php';

	$con = db_connect();
	$cmd = $con->prepare("update iris_contact set balance=balance + :amount where id=:id");
	$cmd->execute(array(":amount" => $p_amount, ":id" => $p_user_id));
}

function GetBalance($p_user_id) {
	include_once realpath(dirname(__FILE__)."/./../").'/core/engine/applib.php';

	$con = db_connect();
	$cmd = $con->prepare("select balance from iris_contact where id=:id");
	$cmd->execute(array(":id" => $p_user_id));
	$res = $cmd->fetchAll();
	return $res[0][0];
}

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
