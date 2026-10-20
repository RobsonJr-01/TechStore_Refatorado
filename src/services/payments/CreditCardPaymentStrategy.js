class CreditCardPaymentStrategy {
  process(order, subtotal) {
    const fee = order.installments > 1 ? subtotal * 0.025 : 0;
    return {
      status: "approved",
      discount: 0,
      fee
    };
  }
}

module.exports = CreditCardPaymentStrategy;
