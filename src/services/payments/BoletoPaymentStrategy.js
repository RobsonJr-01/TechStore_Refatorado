class BoletoPaymentStrategy {
  process(order, subtotal) {
    return {
      status: "waiting_payment",
      discount: 0,
      fee: 0
    };
  }
}

module.exports = BoletoPaymentStrategy;
