export default class RightsRequestReceiptService {
  static generateRequestId() {
    return `rr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  static createReceipt(request) {
    return {
      receipt_id: `receipt_${request.request_id}`,
      request_id: request.request_id,
      received_at: request.submitted_at,
      message: "Solicitud recibida correctamente",
    };
  }
}
