class NotificationService {
  sendOrderConfirmation(customer, orderId, total) {
    console.log(`[NOTIFICACAO] Pedido ${orderId} confirmado para ${customer.name} (${customer.email}). Total: R$ ${total.toFixed(2)}`);
  }
}

module.exports = NotificationService;
