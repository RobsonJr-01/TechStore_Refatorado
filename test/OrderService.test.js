const { test, describe } = require("node:test");
const assert = require("node:assert");
const Address = require("../src/domain/Address");
const Customer = require("../src/domain/Customer");
const Order = require("../src/domain/Order");
const OrderItem = require("../src/domain/OrderItem");
const Product = require("../src/domain/Product");
const OrderService = require("../src/services/OrderService");
const ProductRepository = require("../src/repositories/ProductRepository");

describe("OrderService", () => {
  const createBaseOrder = (overrides = {}) => {
    const customer = new Customer(
      "c1",
      "Ana Souza",
      "ana.souza@example.com",
      "18999990000",
      "vip",
      new Address("Rua das Palmeiras", "120", "Presidente Prudente", "SP", "19000-000", "sudeste")
    );

    const notebook = new Product("p1", "Notebook Pro 14", "notebook", 6200, 2.1, 8);
    const mouse = new Product("p2", "Mouse Sem Fio", "peripheral", 120, 0.2, 30);

    const order = new Order(
      "o1001",
      customer,
      [new OrderItem(notebook, 1), new OrderItem(mouse, 2)],
      "TECH10",
      "credit_card",
      3
    );

    return Object.assign(order, overrides);
  };

  test("deve processar pedido padrao com calculo exato de subtotal, desconto, frete e taxa", () => {
    const service = new OrderService();
    const order = createBaseOrder();

    const result = service.process(order);

    assert.strictEqual(result.id, "o1001");
    assert.strictEqual(result.customerName, "Ana Souza");
    assert.strictEqual(result.subtotal, 6440);
    assert.strictEqual(result.discount, 1159.2);
    assert.strictEqual(result.freight, 30);
    assert.strictEqual(result.paymentFee, 161);
    assert.strictEqual(result.total, 5471.8);
    assert.strictEqual(result.status, "confirmed");
  });

  test("deve processar pedido via PIX com status confirmado e desconto adicional de 3%", () => {
    const service = new OrderService();
    const order = createBaseOrder({ paymentMethod: "pix", installments: 1 });

    const result = service.process(order);

    assert.strictEqual(result.status, "confirmed");
    assert.strictEqual(result.discount, 1352.4);
    assert.strictEqual(result.paymentFee, 0);
  });

  test("deve processar pedido via Boleto com status waiting_payment", () => {
    const service = new OrderService();
    const order = createBaseOrder({ paymentMethod: "boleto", installments: 1 });

    const result = service.process(order);

    assert.strictEqual(result.status, "waiting_payment");
    assert.strictEqual(order.status, "waiting_payment");
  });

  test("deve suportar injecao de dependencias para repositorios e notificadores (DIP)", () => {
    let notificationSent = false;
    const mockNotifier = {
      sendOrderConfirmation: () => {
        notificationSent = true;
      }
    };

    let orderSaved = null;
    const mockOrderRepo = {
      save: (summary) => {
        orderSaved = summary;
      }
    };

    const service = new OrderService({
      notificationService: mockNotifier,
      orderRepository: mockOrderRepo
    });

    const order = createBaseOrder();
    service.process(order);

    assert.strictEqual(notificationSent, true);
    assert.ok(orderSaved !== null);
    assert.strictEqual(orderSaved.id, "o1001");
  });
});
