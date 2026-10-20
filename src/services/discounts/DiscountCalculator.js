const CustomerDiscountRule = require("./CustomerDiscountRule");
const CouponDiscountRule = require("./CouponDiscountRule");
const HighValueDiscountRule = require("./HighValueDiscountRule");

class DiscountCalculator {
  constructor(rules = [
    new CustomerDiscountRule(),
    new CouponDiscountRule(),
    new HighValueDiscountRule()
  ]) {
    this.rules = rules;
  }

  calculate(order, subtotal) {
    return this.rules.reduce((totalDiscount, rule) => {
      return totalDiscount + rule.calculate(order, subtotal);
    }, 0);
  }
}

module.exports = DiscountCalculator;
