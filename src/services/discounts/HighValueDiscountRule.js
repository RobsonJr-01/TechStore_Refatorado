class HighValueDiscountRule {
  calculate(order, subtotal) {
    if (subtotal > 8000) {
      return 250;
    }
    return 0;
  }
}

module.exports = HighValueDiscountRule;
