import { useState } from 'react';
import { useShopStore } from '@/store/shopStore';
import type { Order } from '@/types/shop';
import AdminLayout from './AdminLayout';
import { Package, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useShopStore();
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No orders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{order.id}</span>
                      <Badge className={getStatusBadge(order.status)}>{order.status}</Badge>
                      <Badge className={getPaymentBadge(order.paymentStatus)}>{order.paymentStatus}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer.name}</p>
                    <p className="text-sm text-gray-500">{order.customer.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{order.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{order.items.length} items</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                      <Eye className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex gap-2">
                <Badge className={getStatusBadge(selectedOrder.status)}>{selectedOrder.status}</Badge>
                <Badge className={getPaymentBadge(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</Badge>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-2">Customer</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-gray-600">{selectedOrder.customer.email}</p>
                  <p className="text-gray-600">{selectedOrder.customer.phone}</p>
                  <p className="text-gray-500 mt-2">
                    {selectedOrder.customer.address}<br />
                    {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}<br />
                    {selectedOrder.customer.country}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t pt-4">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl">₹{selectedOrder.total.toLocaleString()}</span>
              </div>

              {/* Actions */}
              <div>
                <h4 className="font-semibold mb-2">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, status as Order['status'])}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
