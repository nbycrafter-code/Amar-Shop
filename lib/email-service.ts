// lib/email-service.ts
import nodemailer from "nodemailer";

interface EmailData {
  to: string;
  orderId: string;
  customerName: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    selectedSize?: string;
    selectedColor?: string;
    image?: string; // ✅ Added image field
  }>;
  address?: string;
  phone?: string;
  paymentMethod?: string;
}

export async function sendOrderConfirmationEmail(data: EmailData) {
  try {
    
    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Generate items HTML with images
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <table style="width: 100%;">
            <tr>
              ${item.image ? `
              <td style="width: 60px; padding-right: 10px;">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" />
              </td>
              ` : ''}
              <td>
                <strong>${item.name}</strong><br/>
                <small style="color: #666;">
                  ${item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                  ${item.selectedSize && item.selectedColor ? ' | ' : ''}
                  ${item.selectedColor ? `Color: ${item.selectedColor}` : ''}
                </small>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">৳ ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    // HTML email template with improved design and images
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #0f5c54 0%, #0a403a 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .header p {
            margin: 10px 0 0;
            opacity: 0.9;
          }
          .content {
            padding: 30px 25px;
            background: #f9f9f9;
          }
          .order-details {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .order-id {
            background: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 16px;
            text-align: center;
            margin: 15px 0;
          }
          .info-row {
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .total {
            font-size: 20px;
            font-weight: bold;
            color: #ef553f;
            text-align: right;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #ef553f;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th {
            background: #0f5c54;
            color: white;
            padding: 12px;
            text-align: left;
          }
          td {
            padding: 12px;
          }
          .product-image {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 8px;
          }
          .footer {
            background: #333;
            color: #999;
            text-align: center;
            padding: 20px;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            background: #ef553f;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .summary-box {
            background: #f8f8f8;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
          }
          @media only screen and (max-width: 480px) {
            .content {
              padding: 20px 15px;
            }
            th, td {
              padding: 8px;
            }
            .product-image {
              width: 40px;
              height: 40px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for shopping with us</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${data.customerName}</strong>,</p>
            <p>Your order has been placed successfully. We're excited to process your order and will notify you once it's shipped.</p>
            
            <div class="order-details">
              <h3 style="margin-top: 0;">Order Details</h3>
              <div class="order-id">
                <strong>Order ID:</strong> ${data.orderId}
              </div>
              
              <div class="info-row">
                <strong>Order Date:</strong> ${new Date().toLocaleString()}
              </div>
              
              <div class="info-row">
                <strong>Payment Method:</strong> ${data.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Online Payment'}
              </div>
              
              ${data.address ? `<div class="info-row"><strong>Delivery Address:</strong> ${data.address}</div>` : ''}
              ${data.phone ? `<div class="info-row"><strong>Contact Number:</strong> ${data.phone}</div>` : ''}
              
              <h3>Items Ordered:</h3>
              <table style="width: 100%;">
                <thead>
                  <tr>
                    <th style="padding: 12px;">Product</th>
                    <th style="padding: 12px; text-align: center;">Qty</th>
                    <th style="padding: 12px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div class="summary-box">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Subtotal:</span>
                  <span>৳ ${data.total.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Delivery Charge:</span>
                  <span>৳ 0</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #ef553f; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
                  <span>Total Amount:</span>
                  <span>৳ ${data.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <p style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/my-account/orders/${data.orderId}" class="button">
                View Order Status
              </a>
            </p>
            
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>✅ We'll process your order within 24 hours</li>
              <li>📦 You'll receive a shipping confirmation email once dispatched</li>
              <li>🚚 Delivery typically takes 3-5 business days</li>
            </ul>
            
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #2e7d32;">
                <strong>📞 Need Help?</strong><br/>
                Contact our support team at 
                <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #0f5c54;">${process.env.SUPPORT_EMAIL}</a> 
                or call us at ${process.env.SUPPORT_PHONE}
              </p>
            </div>
            
            <p>Thank you for choosing us!</p>
            <p>Best regards,<br><strong>Your Store Team</strong></p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Store. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Your Store" <${process.env.EMAIL_FROM}>`,
      to: data.to,
      subject: `Order Confirmation - ${data.orderId}`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}