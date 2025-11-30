const nodemailer = require('nodemailer');
const Order = require('../models/Order');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate invoice HTML
const generateInvoiceHTML = (order) => {
  const date = new Date(order.purchaseDate).toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .invoice { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .details { margin: 20px 0; }
        .details table { width: 100%; border-collapse: collapse; }
        .details td { padding: 10px; border-bottom: 1px solid #eee; }
        .details td:first-child { font-weight: bold; width: 40%; }
        .total { background: #f5f5f5; font-size: 1.2em; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <h1>Invoice</h1>
          <p>Thank you for your purchase!</p>
        </div>
        <div class="details">
          <table>
            <tr>
              <td>Order ID:</td>
              <td>${order._id}</td>
            </tr>
            <tr>
              <td>Customer Name:</td>
              <td>${order.customerName}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${order.customerEmail}</td>
            </tr>
            <tr>
              <td>Product:</td>
              <td>${order.productName}</td>
            </tr>
            <tr>
              <td>Purchase Date:</td>
              <td>${date}</td>
            </tr>
            <tr class="total">
              <td>Total Amount:</td>
              <td>$${order.price.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <p>This is an automated invoice. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send invoice email
const sendInvoice = async (order, isRetry = false) => {
  try {
    const transporter = createTransporter();
    const invoiceHTML = generateInvoiceHTML(order);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.customerEmail,
      subject: `Invoice for Order #${order._id}`,
      html: invoiceHTML
    };

    await transporter.sendMail(mailOptions);

    // Update order status
    await Order.findByIdAndUpdate(order._id, {
      invoiceSent: true,
      emailStatus: 'sent'
    });

    console.log(`Invoice sent successfully to ${order.customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending invoice:', error);

    // Update order status to failed
    await Order.findByIdAndUpdate(order._id, {
      emailStatus: 'failed'
    });

    // Retry once if this is the first attempt
    if (!isRetry) {
      console.log('Retrying email send...');
      return await sendInvoice(order, true);
    }

    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInvoice,
  generateInvoiceHTML
};
