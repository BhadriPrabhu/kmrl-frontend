export interface WhatsAppMessage {
  to: string;
  summary: string;
  dashboardLink: string;
  documentTitle: string;
  department: string;
  priority: string;
}

export const whatsappService = {
  sendCriticalAlert(message: WhatsAppMessage): boolean {
    const phoneNumber = '+919876543210';

    const text = `🚨 CRITICAL DOCUMENT ALERT\n\n` +
      `Title: ${message.documentTitle}\n` +
      `Department: ${message.department}\n` +
      `Priority: ${message.priority}\n\n` +
      `Summary: ${message.summary}\n\n` +
      `View Dashboard: ${message.dashboardLink}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    console.log('WhatsApp Alert:', {
      message,
      url: whatsappUrl
    });

    const alertData = {
      timestamp: new Date().toISOString(),
      message,
      sent: true
    };

    const alerts = JSON.parse(localStorage.getItem('whatsapp_alerts') || '[]');
    alerts.unshift(alertData);
    localStorage.setItem('whatsapp_alerts', JSON.stringify(alerts.slice(0, 50)));

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }

    return true;
  },

  formatMessageForWhatsApp(documentTitle: string, summary: string, department: string): string {
    return `🚨 Critical Document Alert\n\n` +
      `📄 ${documentTitle}\n` +
      `🏢 ${department}\n\n` +
      `📝 Summary:\n${summary}\n\n` +
      `🔗 View: ${window.location.origin}/dashboard`;
  },

  getAlertHistory(): any[] {
    return JSON.parse(localStorage.getItem('whatsapp_alerts') || '[]');
  }
};
