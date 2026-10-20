class Order {
  constructor(id, customer, items, couponCode, paymentMethod, installments) {
    this.id = id;
    this.customer = customer;
    this.items = items || [];
    this.couponCode = couponCode;
    this.paymentMethod = paymentMethod;
    this.installments = installments;
    this.status = "created";
    this.createdAt = new Date();
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  getTotalWeight() {
    return this.items.reduce((total, item) => total + item.getTotalWeight(), 0);
  }

  getCustomerName() {
    return this.customer ? this.customer.name : "";
  }

  getCustomerEmail() {
    return this.customer ? this.customer.email : "";
  }

  getCustomerType() {
    return this.customer ? this.customer.type : null;
  }

  getDeliveryCity() {
    return this.customer && typeof this.customer.getCity === "function"
      ? this.customer.getCity()
      : this.customer?.address?.city;
  }

  getDeliveryState() {
    return this.customer && typeof this.customer.getState === "function"
      ? this.customer.getState()
      : this.customer?.address?.state;
  }

  getDeliveryRegion() {
    return this.customer && typeof this.customer.getRegion === "function"
      ? this.customer.getRegion()
      : this.customer?.address?.region;
  }
}

module.exports = Order;

