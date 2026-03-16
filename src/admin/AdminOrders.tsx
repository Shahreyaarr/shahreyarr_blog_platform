import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { fsSubscribe, fsUpdate } from '@/lib/firebase';
import { sendOrderDispatched } from '@/lib/email';

interface Order {
  id: string; orderId: string; items: any[]; total: number;
  customer: any; status: string; paymentMethod: string;
  paymentId?: string; createdAt: string;
}

const STATUS_COLORS: Record<string,string> = {
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  paid:       'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  shipped:    'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
};

export default function AdminOrders() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string|null>(null);
  const [filter, setFilter]     = useState('all');
  const [trackingInputs, setTrackingInputs] = useState<Record<string,string>>({});
  const [sendingEmail, setSendingEmail] = useState<string|null>(null);

  useEffect(() => {
    return fsSubscribe('orders', (data) => { setOrders(data as Order[]); setLoading(false); });
  }, []);

  const filtered = filter==='all' ? orders : orders.filter(o=>o.status===filter);
  const statusCounts: Record<string,number> = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status]||0)+1; });

  const updateStatus = async (order: Order, status: string) => {
    await fsUpdate('orders', order.id, { status });

    // Auto-send dispatch email when status changes to 'shipped'
    if (status === 'shipped' && order.customer?.email) {
      setSendingEmail(order.id);
      const tracking = trackingInputs[order.id] || '';
      await sendOrderDispatched({
        orderId:       order.orderId || order.id,
        customerName:  order.customer.name,
        customerEmail: order.customer.email,
        items:         order.items || [],
        address:       `${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}`,
        trackingId:    tracking || 'Will be updated shortly',
      });
      setSendingEmail(null);
    }
  };

  const resendDispatch = async (order: Order) => {
    if (!order.customer?.email) return;
    setSendingEmail(order.id);
    await sendOrderDispatched({
      orderId:       order.orderId || order.id,
      customerName:  order.customer.name,
      customerEmail: order.customer.email,
      items:         order.items || [],
      address:       `${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}`,
      trackingId:    trackingInputs[order.id] || 'Will be updated shortly',
    });
    setSendingEmail(null);
    alert('Dispatch email sent!');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-charcoal">Orders</h1>
        <p className="text-muted text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {['all','pending','paid','shipped','delivered','cancelled'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`p-3 rounded-xl text-center transition-all ${filter===s?'bg-earth text-white':'bg-white shadow-sm hover:shadow-md'}`}>
            <p className={`font-display text-xl ${filter===s?'text-white':'text-charcoal'}`}>{s==='all'?orders.length:statusCounts[s]||0}</p>
            <p className={`text-xs capitalize mt-0.5 ${filter===s?'text-white/70':'text-muted'}`}>{s}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16"><div className="w-8 h-8 border-2 border-earth/30 border-t-earth rounded-full animate-spin mx-auto"/></div>
      ) : filtered.length===0 ? (
        <div className="text-center py-16 bg-white rounded-xl"><Package className="w-12 h-12 text-muted/40 mx-auto mb-3"/><p className="text-muted">No orders yet</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order=>(
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={()=>setExpanded(expanded===order.id?null:order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-charcoal text-sm">{order.orderId||order.id.slice(0,8)}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs border font-medium capitalize ${STATUS_COLORS[order.status]||STATUS_COLORS.pending}`}>{order.status}</span>
                  </div>
                  <p className="text-xs text-muted">{order.customer?.name} · {order.customer?.email}</p>
                  <p className="text-xs text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display text-lg text-earth">₹{order.total?.toLocaleString()}</p>
                  <p className="text-xs text-muted">{order.items?.length} item{order.items?.length!==1?'s':''}</p>
                </div>
                {expanded===order.id?<ChevronUp className="w-4 h-4 text-muted flex-shrink-0"/>:<ChevronDown className="w-4 h-4 text-muted flex-shrink-0"/>}
              </div>

              {expanded===order.id&&(
                <div className="border-t border-sand/50 p-4 bg-cream/30">
                  <div className="grid sm:grid-cols-2 gap-6 mb-4">
                    <div>
                      <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Items</p>
                      <div className="space-y-1.5">
                        {order.items?.map((item,i)=>(
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-charcoal/80">{item.name} ×{item.qty}</span>
                            <span className="text-muted">₹{(item.price*item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Customer & Delivery</p>
                      <p className="text-sm text-charcoal/80 font-medium">{order.customer?.name}</p>
                      <p className="text-sm text-muted">{order.customer?.email}</p>
                      <p className="text-sm text-muted">{order.customer?.phone}</p>
                      <p className="text-sm text-muted mt-1">{order.customer?.address}</p>
                      <p className="text-sm text-muted">{order.customer?.city} {order.customer?.pincode}</p>
                      {order.paymentId&&<p className="text-xs text-earth mt-2">Payment: {order.paymentId}</p>}
                    </div>
                  </div>

                  {/* Tracking ID input */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-1.5">Tracking ID (optional)</label>
                    <div className="flex gap-2">
                      <input
                        value={trackingInputs[order.id]||''}
                        onChange={e=>setTrackingInputs({...trackingInputs,[order.id]:e.target.value})}
                        placeholder="e.g. DTDC123456789"
                        className="flex-1 px-4 py-2 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm"
                      />
                      {order.status==='shipped'&&(
                        <button onClick={()=>resendDispatch(order)} disabled={sendingEmail===order.id}
                          className="px-3 py-2 rounded-xl bg-earth/10 text-earth text-xs font-medium hover:bg-earth/20 flex items-center gap-1.5 disabled:opacity-50">
                          {sendingEmail===order.id
                            ? <div className="w-3 h-3 border border-earth/30 border-t-earth rounded-full animate-spin"/>
                            : <Send className="w-3 h-3"/>
                          }
                          Resend Email
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status buttons */}
                  <div className="pt-3 border-t border-sand/50">
                    <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {['pending','paid','processing','shipped','delivered','cancelled'].map(s=>(
                        <button key={s} onClick={()=>updateStatus(order,s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all relative ${
                            order.status===s?'bg-earth text-white':'bg-white border border-sand hover:bg-cream text-charcoal/70'
                          }`}>
                          {s}
                          {s==='shipped'&&<span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-blue-400 flex items-center justify-center" title="Sends dispatch email"><Send className="w-1.5 h-1.5 text-white"/></span>}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted mt-2">📧 Setting status to <strong>Shipped</strong> automatically sends dispatch email to customer</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
