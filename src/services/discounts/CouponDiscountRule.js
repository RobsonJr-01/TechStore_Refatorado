class CouponDiscountRule {
  calculate(order, subtotal) {
    if (order.couponCode === "TECH10") {
      return subtotal * 0.1;
    }

    if (order.couponCode === "FRETEGRATIS") {
      return 0;
    }

    return 0;
  }
}

module.exports = CouponDiscountRule;
