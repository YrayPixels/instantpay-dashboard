
import { useState } from "react";
import { CreditCard, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstantPayDocs from "@/components/dashboard/DocsPage";



interface PaymentMethod {
  id: 'instant' | 'qr';
  title: string;
  description: string;
  icon: typeof CreditCard | typeof QrCode;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'instant',
    title: 'Instant Pay API',
    description: 'Direct payment processing for immediate transactions',
    icon: CreditCard,
  },
  {
    id: 'qr',
    title: 'QR Code',
    description: 'Generate QR codes for contactless payments',
    icon: QrCode,
  },
];



const PaymentInterfaceSection = () => {
  const [selectedMethod, setSelectedMethod] = useState<'instant' | 'qr'>('instant');

  const handleMethodSelect = (method: 'instant' | 'qr') => {
    setSelectedMethod(method);
    toast.success(`Payment method updated to ${method === 'instant' ? 'Instant Pay' : 'QR Code'}`);
  };

  return (
    <DashboardLayout>
      <Card className="p-6 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Payment Interface
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedMethod === method.id
                ? 'border-primary bg-primary/5'
                : 'border-secondary hover:border-accent/50'
                }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-full ${selectedMethod === method.id
                    ? 'bg-primary text-white'
                    : 'bg-secondary'
                    }`}
                >
                  <method.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{method.title}</h3>
                  <p className="text-sm text-slate-500">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="py-5 h-[100vh] overflow-scroll">
          {selectedMethod === "instant" ?
            <InstantPayDocs />
            :
            <p>Coming soon!</p>
          }
        </div>
      </Card>
    </DashboardLayout>

  );
};


export default PaymentInterfaceSection;