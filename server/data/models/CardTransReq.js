module.exports = {
  ssl_transaction_type: 'ccsale',
  ssl_merchant_id: process.env.ACCOUNT_ID,
  ssl_user_id: process.env.USER_ID,
  ssl_pin: process.env.PASSWORD,
  ssl_first_name: 'Kyle',
  ssl_card_number: '4124939999999990',
  ssl_exp_date: '1220',
  ssl_amount: 1.0,
  ssl_test_mode: true,
  ssl_cvv2cvc2: 123
};

/*
<txn>
    <ssl_merchant_id>007572</ssl_merchant_id>
    <ssl_user_id>webpage</ssl_user_id>
    <ssl_pin>EZF3RH</ssl_pin>
    <ssl_test_mode>true</ssl_test_mode>
    <ssl_transaction_type>ccsale</ssl_transaction_type>
    <ssl_card_number>4124939999999990</ssl_card_number>
    <ssl_exp_date>1220</ssl_exp_date>
    <ssl_amount>1.00</ssl_amount>
    <ssl_cvv2cvc2>123</ssl_cvv2cvc2>
</txn>
*/
