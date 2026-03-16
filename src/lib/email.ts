import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE      as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY   as string;
const TPL_ORDER_CONFIRM  = import.meta.env.VITE_EMAILJS_TPL_CONFIRM  as string;
const TPL_ORDER_DISPATCH = import.meta.env.VITE_EMAILJS_TPL_DISPATCH as string;

emailjs.init(PUBLIC_KEY);

export async function sendOrderConfirmation(order: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  address: string;
}) {
  const itemsText = order.items.map(i => `${i.name} x${i.qty} — ₹${(i.price * i.qty).toLocaleString()}`).join('\n');
  try {
    await emailjs.send(SERVICE_ID, TPL_ORDER_CONFIRM, {
      customer_name:    order.customerName,
      customer_email:   order.customerEmail,
      order_id:         order.orderId,
      order_items:      itemsText,
      order_total:      order.total.toLocaleString(),
      delivery_address: order.address,
    });
  } catch (err) {
    console.error('Order confirmation email failed:', err);
  }
}

export async function sendOrderDispatched(order: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; qty: number; price: number }[];
  address: string;
  trackingId?: string;
}) {
  const itemsText = order.items.map(i => `${i.name} x${i.qty}`).join(', ');
  try {
    await emailjs.send(SERVICE_ID, TPL_ORDER_DISPATCH, {
      customer_name:    order.customerName,
      customer_email:   order.customerEmail,
      order_id:         order.orderId,
      order_items:      itemsText,
      delivery_address: order.address,
      tracking_id:      order.trackingId || 'Will be updated shortly',
    });
  } catch (err) {
    console.error('Dispatch email failed:', err);
  }
}
