import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";

test("Deve lançar uma exception se o peso for negativo", function () {
	expect(() => new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), -3)).toThrow(new Error("Invalid weight"));
});
