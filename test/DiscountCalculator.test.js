const { test, describe } = require("node:test");
const assert = require("node:assert");
const DiscountCalculator = require("../src/services/discounts/DiscountCalculator");
const CustomerDiscountRule = require("../src/services/discounts/CustomerDiscountRule");
const CouponDiscountRule = require("../src/services/discounts/CouponDiscountRule");
const HighValueDiscountRule = require("../src/services/discounts/HighValueDiscountRule");

describe("DiscountCalculator", () => {
  const calculator = new DiscountCalculator();

  test("deve aplicar 8% de desconto para cliente VIP", () => {
    const order = { getCustomerType: () => "vip", couponCode: null };
    const discount = calculator.calculate(order, 1000);
    assert.strictEqual(discount, 80);
  });

  test("deve aplicar 15% de desconto para cliente colaborador (employee)", () => {
    const order = { getCustomerType: () => "employee", couponCode: null };
    const discount = calculator.calculate(order, 1000);
    assert.strictEqual(discount, 150);
  });

  test("deve aplicar 10% de desconto para cupom TECH10", () => {
    const order = { getCustomerType: () => "regular", couponCode: "TECH10" };
    const discount = calculator.calculate(order, 1000);
    assert.strictEqual(discount, 100);
  });

  test("deve aplicar R$ 250 de desconto adicional para pedidos com subtotal acima de R$ 8000", () => {
    const order = { getCustomerType: () => "regular", couponCode: null };
    const discount = calculator.calculate(order, 8500);
    assert.strictEqual(discount, 250);
  });

  test("deve acumular descontos VIP + TECH10 + valor alto (> 8000)", () => {
    const order = { getCustomerType: () => "vip", couponCode: "TECH10" };
    const discount = calculator.calculate(order, 10000);
    assert.strictEqual(discount, 2050);
  });

  test("deve retornar 0 quando nenhuma regra de desconto for aplicavel", () => {
    const order = { getCustomerType: () => "regular", couponCode: null };
    const discount = calculator.calculate(order, 500);
    assert.strictEqual(discount, 0);
  });
});
