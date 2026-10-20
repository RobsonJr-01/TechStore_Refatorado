const PixPaymentStrategy = require("./PixPaymentStrategy");
const CreditCardPaymentStrategy = require("./CreditCardPaymentStrategy");
const BoletoPaymentStrategy = require("./BoletoPaymentStrategy");

class PaymentProcessor {
  constructor(strategies = {
    pix: new PixPaymentStrategy(),
    credit_card: new CreditCardPaymentStrategy(),
    boleto: new BoletoPaymentStrategy()
  }) {
    this.strategies = strategies;
  }

  registerStrategy(method, strategy) {
    this.strategies[method] = strategy;
  }

  process(order, subtotal) {
    const strategy = this.strategies[order.paymentMethod];

    if (!strategy) {
      throw new Error("Forma de pagamento invalida.");
    }

    return strategy.process(order, subtotal);
  }
}

module.exports = PaymentProcessor;
