const { test, describe } = require("node:test");
const assert = require("node:assert");
const OrderValidator = require("../src/services/OrderValidator");

describe("OrderValidator", () => {
  const fakeProductRepository = {
    findById: (id) => {
      if (id === "p1") return { id: "p1", name: "Notebook", stock: 5 };
      return null;
    }
  };

  const validator = new OrderValidator(fakeProductRepository);

  test("deve lancar erro quando pedido nao possui cliente", () => {
    const order = { customer: null };
    assert.throws(() => validator.validate(order), /Cliente obrigatorio\./);
  });

  test("deve lancar erro quando e-mail do cliente e invalido", () => {
    const order = {
      customer: { email: "email-invalido" },
      items: [{ product: { id: "p1" }, quantity: 1 }]
    };
    assert.throws(() => validator.validate(order), /E-mail do cliente invalido\./);
  });

  test("deve lancar erro quando pedido nao possui itens", () => {
    const order = {
      customer: { email: "cliente@teste.com" },
      items: []
    };
    assert.throws(() => validator.validate(order), /Pedido sem itens\./);
  });

  test("deve lancar erro quando item nao possui produto", () => {
    const order = {
      customer: { email: "cliente@teste.com" },
      items: [{ product: null, quantity: 1 }]
    };
    assert.throws(() => validator.validate(order), /Item sem produto\./);
  });

  test("deve lancar erro quando quantidade for menor ou igual a zero", () => {
    const order = {
      customer: { email: "cliente@teste.com" },
      items: [{ product: { id: "p1" }, quantity: 0 }]
    };
    assert.throws(() => validator.validate(order), /Quantidade invalida\./);
  });

  test("deve lancar erro quando produto nao for encontrado no repositorio", () => {
    const order = {
      customer: { email: "cliente@teste.com" },
      items: [{ product: { id: "inexistente" }, quantity: 1 }]
    };
    assert.throws(() => validator.validate(order), /Produto inexistente nao encontrado\./);
  });

  test("deve lancar erro quando estoque for insuficiente", () => {
    const order = {
      customer: { email: "cliente@teste.com" },
      items: [{ product: { id: "p1" }, quantity: 10 }]
    };
    assert.throws(() => validator.validate(order), /Estoque insuficiente para Notebook\./);
  });

  test("deve validar com sucesso quando todos os dados estiverem corretos", () => {
    const order = {
      customer: { email: "cliente@teste.com", hasValidEmail: () => true },
      items: [{ product: { id: "p1" }, quantity: 2, getProductId: () => "p1" }]
    };
    assert.doesNotThrow(() => validator.validate(order));
  });
});
