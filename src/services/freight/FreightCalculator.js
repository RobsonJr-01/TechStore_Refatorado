class FreightCalculator {
  constructor(regionRates = {
    sudeste: { baseRate: 20, weightRate: 4 },
    sul: { baseRate: 28, weightRate: 5 },
    "centro-oeste": { baseRate: 35, weightRate: 6 },
    nordeste: { baseRate: 45, weightRate: 7 },
    norte: { baseRate: 60, weightRate: 9 },
    default: { baseRate: 50, weightRate: 8 }
  }) {
    this.regionRates = regionRates;
  }

  calculate(order) {
    if (order.couponCode === "FRETEGRATIS") {
      return 0;
    }

    const totalWeight = typeof order.getTotalWeight === "function"
      ? order.getTotalWeight()
      : 0;

    const region = typeof order.getDeliveryRegion === "function"
      ? order.getDeliveryRegion()
      : order.customer?.address?.region;

    const rate = this.regionRates[region] || this.regionRates.default;

    return rate.baseRate + totalWeight * rate.weightRate;
  }
}

module.exports = FreightCalculator;
