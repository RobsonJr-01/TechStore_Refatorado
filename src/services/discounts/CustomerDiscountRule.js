class CustomerDiscountRule {
  calculate(order, subtotal) {
    const customerType = typeof order.getCustomerType === "function"
      ? order.getCustomerType()
      : order.customer?.type;

    if (customerType === "vip") {
      return subtotal * 0.08;
    }

    if (customerType === "employee") {
      return subtotal * 0.15;
    }

    return 0;
  }
}

module.exports = CustomerDiscountRule;
