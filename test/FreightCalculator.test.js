const { test, describe } = require("node:test");
const assert = require("node:assert");
const FreightCalculator = require("../src/services/freight/FreightCalculator");

describe("FreightCalculator", () => {
  const calculator = new FreightCalculator();

  test("deve zerar o frete quando houver cupom FRETEGRATIS", () => {
    const order = {
      couponCode: "FRETEGRATIS",
      getTotalWeight: () => 10,
      getDeliveryRegion: () => "sudeste"
    };
    const freight = calculator.calculate(order);
    assert.strictEqual(freight, 0);
  });

  test("deve calcular corretamente o frete para a regiao Sudeste", () => {
    const order = {
      couponCode: null,
      getTotalWeight: () => 2.5,
      getDeliveryRegion: () => "sudeste"
    };
    const freight = calculator.calculate(order);
    assert.strictEqual(freight, 30);
  });

  test("deve calcular corretamente o frete para a regiao Sul", () => {
    const order = {
      couponCode: null,
      getTotalWeight: () => 2,
      getDeliveryRegion: () => "sul"
    };
    const freight = calculator.calculate(order);
    assert.strictEqual(freight, 38);
  });

  test("deve calcular corretamente o frete para a regiao Centro-Oeste", () => {
    const order = {
      couponCode: null,
      getTotalWeight: () => 1,
      getDeliveryRegion: () => "centro-oeste"
    };
    const freight = calculator.calculate(order);
    assert.strictEqual(freight, 41);
  });

  test("deve calcular corretamente o frete para a regiao Nordeste", () => {
    const order = {
      couponCode: null,
      getTotalWeight: () => 1,
      getDeliveryRegion: () => "nordeste"
    };
    const freight = calculator.calculate(order);
    assert.strictEqual(freight, 52);
  });

  test("deve calcular corretamente o frete para a regiao Norte", () => {
    const order = {
      couponCode: null,
      getTotalWeight: () => 1,
      getDeliveryRegion: () => "norte"
    };
    const freight = calculator.calculate(order);
    assert.strictEqual(freight, 69);
  });

  test("deve aplicar a taxa padrao caso a regiao nao seja informada ou seja desconhecida", () => {
    const order = {
      couponCode: null,
      getTotalWeight: () => 2,
      getDeliveryRegion: () => "exterior"
    };
    const freight = calculator.calculate(order);
    assert.strictEqual(freight, 66);
  });
});
