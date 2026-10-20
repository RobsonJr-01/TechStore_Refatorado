class OrderItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  getSubtotal() {
    return this.product.price * this.quantity;
  }

  getProductId() {
    return this.product ? this.product.id : null;
  }

  getProductName() {
    return this.product ? this.product.name : "";
  }

  getProductPrice() {
    return this.product ? this.product.price : 0;
  }

  getTotalWeight() {
    return (this.product && this.product.weight ? this.product.weight : 0) * this.quantity;
  }
}

module.exports = OrderItem;

