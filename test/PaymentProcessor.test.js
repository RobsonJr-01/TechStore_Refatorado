const { test, describe } = require("node:test");
const assert = require("node:assert");
const PaymentProcessor = require("../src/services/payments/PaymentProcessor");

describe("PaymentProcessor", () => {
  const processor = new PaymentProcessor();

  test("deve processar pagamento via PIX com status aprovado e 3% de desconto", () => {
    const order = { paymentMethod: "pix" };
    const result = processor.process(order, 1000);
    assert.strictEqual(result.status, "approved");
    assert.strictEqual(result.discount, 30);
    assert.strictEqual(result.fee, 0);
  });

  test("deve processar cartao de credito a vista sem taxa adicional", () => {
    const order = { paymentMethod: "credit_card", installments: 1 };
    const result = processor.process(order, 1000);
    assert.strictEqual(result.status, "approved");
    assert.strictEqual(result.discount, 0);
    assert.strictEqual(result.fee, 0);
  });

  test("deve processar cartao de credito parcelado com taxa de 2.5%", () => {
    const order = { paymentMethod: "credit_card", installments: 3 };
    const result = processor.process(order, 1000);
    assert.strictEqual(result.status, "approved");
    assert.strictEqual(result.discount, 0);
    assert.strictEqual(result.fee, 25);
  });

  test("deve processar boleto com status aguardando pagamento e sem taxas/descontos", () => {
    const order = { paymentMethod: "boleto" };
    const result = processor.process(order, 1000);
    assert.strictEqual(result.status, "waiting_payment");
    assert.strictEqual(result.discount, 0);
    assert.strictEqual(result.fee, 0);
  });

  test("deve lancar erro para metodo de pagamento invalido", () => {
    const order = { paymentMethod: "cripto" };
    assert.throws(
      () => processor.process(order, 1000),
      /Forma de pagamento invalida\./
    );
  });

  test("deve permitir estensao com nova estrategia de pagamento sem alterar codigo existente (OCP)", () => {
    const customProcessor = new PaymentProcessor();
    customProcessor.registerStrategy("voucher", {
      process: (order, subtotal) => ({
        status: "approved",
        discount: 50,
        fee: 0
      })
    });

    const result = customProcessor.process({ paymentMethod: "voucher" }, 500);
    assert.strictEqual(result.status, "approved");
    assert.strictEqual(result.discount, 50);
  });
});
