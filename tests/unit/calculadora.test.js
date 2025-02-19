const calculadora = require("../../models/calculadora");

test("somar 2 + 2 deveria retornar 4", () => {
  const sum = calculadora.somar(2, 2);
  expect(sum).toBe(4);
});

test("somar 5 + 100 deveria retornar 105", () => {
  const sum = calculadora.somar(5, 100);
  expect(sum).toBe(105);
});

test("somar 'banana' + 100 deveria retornar 'Erro'", () => {
  const sum = calculadora.somar("banana", 100);
  expect(sum).toBe("Erro");
});
