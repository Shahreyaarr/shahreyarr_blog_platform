import { useShopStore } from '@/store/shopStore';
import AdminLayout from './AdminLayout';
import { CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const AdminPaymentSettings = () => {
  const { paymentGateways, updatePaymentGateway } = useShopStore();

  return (
    <AdminLayout title="Payment Settings">
      <div className="max-w-3xl">
        <p className="text-gray-500 mb-6">
          Configure payment gateways for your shop. Enable test mode for development.
        </p>

        <div className="space-y-6">
          {paymentGateways.map((gateway) => (
            <Card key={gateway.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-blue-500" />
                    <CardTitle>{gateway.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-4">
                    {gateway.isEnabled && (
                      <Badge variant="default" className="bg-green-500">
                        Enabled
                      </Badge>
                    )}
                    <Switch
                      checked={gateway.isEnabled}
                      onCheckedChange={(checked) =>
                        updatePaymentGateway(gateway.id, { isEnabled: checked })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={gateway.testMode}
                    onCheckedChange={(checked) =>
                      updatePaymentGateway(gateway.id, { testMode: checked })
                    }
                    id={`test-${gateway.id}`}
                  />
                  <Label htmlFor={`test-${gateway.id}`}>Test Mode</Label>
                  {gateway.testMode && (
                    <Badge variant="secondary" className="text-xs">
                      Test
                    </Badge>
                  )}
                </div>

                {gateway.isEnabled && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label>API Key</Label>
                      <Input
                        type="password"
                        value={gateway.apiKey || ''}
                        onChange={(e) =>
                          updatePaymentGateway(gateway.id, { apiKey: e.target.value })
                        }
                        placeholder={`Enter ${gateway.name} API Key`}
                      />
                    </div>
                    {gateway.id !== 'paypal' && (
                      <div>
                        <Label>Secret Key</Label>
                        <Input
                          type="password"
                          value={gateway.secretKey || ''}
                          onChange={(e) =>
                            updatePaymentGateway(gateway.id, { secretKey: e.target.value })
                          }
                          placeholder={`Enter ${gateway.name} Secret Key`}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Payment Integration Note</h4>
          <p className="text-blue-700 text-sm">
            This is a demo setup. For production, integrate actual payment SDKs:
          </p>
          <ul className="text-blue-700 text-sm mt-2 list-disc list-inside">
            <li>Razorpay: npm install razorpay</li>
            <li>Stripe: npm install @stripe/stripe-js</li>
            <li>PayPal: npm install @paypal/react-paypal-js</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentSettings;
