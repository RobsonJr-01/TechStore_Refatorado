class Customer {
  constructor(id, name, email, phone, type, address) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.type = type;
    this.address = address;
  }

  hasValidEmail() {
    return Boolean(this.email && this.email.includes("@"));
  }

  getCity() {
    return this.address ? this.address.city : null;
  }

  getState() {
    return this.address ? this.address.state : null;
  }

  getRegion() {
    return this.address ? this.address.region : null;
  }

  isVip() {
    return this.type === "vip";
  }

  isEmployee() {
    return this.type === "employee";
  }
}

module.exports = Customer;

