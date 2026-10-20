const ProductRepository = require("../repositories/ProductRepository");
const OrderRepository = require("../repositories/OrderRepository");
const NotificationService = require("./NotificationService");
const Logger = require("../utils/Logger");
const OrderValidator = require("./OrderValidator");
const DiscountCalculator = require("./discounts/DiscountCalculator");
const FreightCalculator = require("./freight/FreightCalculator");
const PaymentProcessor = require("./payments/PaymentProcessor");

class OrderService {
  constructor({
    productRepository = new ProductRepository(),
    orderRepository = new OrderRepository(),
    notificationService = new NotificationService(),
    logger = new Logger(),
    validator = null,
    discountCalculator = new DiscountCalculator(),
    freightCalculator = new FreightCalculator(),
    paymentProcessor = new PaymentProcessor()
  } = {}) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.notificationService = notificationService;
    this.logger = logger;
    this.validator = validator || new OrderValidator(this.productRepository);
    this.discountCalculator = discountCalculator;
    this.freightCalculator = freightCalculator;
    this.paymentProcessor = paymentProcessor;
  }

  process(order) {
    this.logger.info(`Iniciando processamento do pedido ${order.id}.`);

    this.validator.validate(order);

    const subtotal = order.getSubtotal();

    let discount = this.discountCalculator.calculate(order, subtotal);
    const freight = this.freightCalculator.calculate(order);
    const paymentResult = this.paymentProcessor.process(order, subtotal);

    discount += paymentResult.discount;
    const paymentFee = paymentResult.fee;
    const paymentStatus = paymentResult.status;

    const total = Number((subtotal - discount + freight + paymentFee).toFixed(2));

    if (total <= 0) {
      throw new Error("Total do pedido invalido.");
    }

    this.updateStock(order.items);

    order.status = paymentStatus === "approved" ? "confirmed" : "waiting_payment";

    const orderSummary = this.buildOrderSummary(
      order,
      subtotal,
      discount,
      freight,
      paymentFee,
      total
    );

    this.orderRepository.save(orderSummary);

    this.notifyCustomer(order, total);
    this.printSummary(order, subtotal, discount, freight, paymentFee, total);

    return orderSummary;
  }

  updateStock(items) {
    for (const item of items) {
      const productId = typeof item.getProductId === "function"
        ? item.getProductId()
        : item.product.id;

      this.productRepository.updateStock(productId, item.quantity);
    }
  }

  notifyCustomer(order, total) {
    if (order.status === "confirmed") {
      this.notificationService.sendOrderConfirmation(order.customer, order.id, total);
    } else {
      this.logger.warn(`Pedido ${order.id} aguardando pagamento.`);
    }
  }

  buildOrderSummary(order, subtotal, discount, freight, paymentFee, total) {
    const customerName = typeof order.getCustomerName === "function"
      ? order.getCustomerName()
      : order.customer.name;

    const customerEmail = typeof order.getCustomerEmail === "function"
      ? order.getCustomerEmail()
      : order.customer.email;

    const city = typeof order.getDeliveryCity === "function"
      ? order.getDeliveryCity()
      : order.customer.address.city;

    const state = typeof order.getDeliveryState === "function"
      ? order.getDeliveryState()
      : order.customer.address.state;

    return {
      id: order.id,
      customerName,
      customerEmail,
      city,
      state,
      items: order.items.map((item) => ({
        productId: typeof item.getProductId === "function" ? item.getProductId() : item.product.id,
        name: typeof item.getProductName === "function" ? item.getProductName() : item.product.name,
        quantity: item.quantity,
        subtotal: item.getSubtotal()
      })),
      subtotal,
      discount: Number(discount.toFixed(2)),
      freight: Number(freight.toFixed(2)),
      paymentFee: Number(paymentFee.toFixed(2)),
      total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt
    };
  }

  printSummary(order, subtotal, discount, freight, paymentFee, total) {
    const customerName = typeof order.getCustomerName === "function"
      ? order.getCustomerName()
      : order.customer.name;

    const city = typeof order.getDeliveryCity === "function"
      ? order.getDeliveryCity()
      : order.customer.address.city;

    const state = typeof order.getDeliveryState === "function"
      ? order.getDeliveryState()
      : order.customer.address.state;

    console.log("Resumo do pedido");
    console.log(`Cliente: ${customerName}`);
    console.log(`Cidade: ${city}/${state}`);
    console.log(`Itens: ${order.getTotalItems()}`);
    console.log(`Subtotal: R$ ${subtotal.toFixed(2)}`);
    console.log(`Desconto: R$ ${discount.toFixed(2)}`);
    console.log(`Frete: R$ ${freight.toFixed(2)}`);
    console.log(`Taxas: R$ ${paymentFee.toFixed(2)}`);
    console.log(`Total: R$ ${total.toFixed(2)}`);
  }
}

module.exports = OrderService;
