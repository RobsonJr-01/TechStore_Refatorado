class PixPaymentStrategy {
  process(order, subtotal) {
    return {
      status: "approved",
      discount: subtotal * 0.03,
      fee: 0
    };
  }
}

module.exports = PixPaymentStrategy;
