
import { useState } from "react";
import { Copy, Key, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
}

export const ApiKeySection = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const generateApiKey = () => {
    const newKey = {
      id: Math.random().toString(36).substring(7),
      key: `mk_${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success("API key generated successfully");
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    toast.success("API key deleted successfully");
  };

  return (
    <DashboardLayout>

      <Card className="p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">API Keys</h2>
          <Button onClick={generateApiKey} className="bg-accent hover:bg-accent/90">
            <Key className="w-4 h-4 mr-2" />
            Generate New Key
          </Button>
        </div>
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-secondary animate-slideIn"
            >
              <div className="flex flex-col">
                <span className="font-mono text-sm text-slate-600">{apiKey.key}</span>
                <span className="text-xs text-slate-500">
                  Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(apiKey.key)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteKey(apiKey.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {apiKeys.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No API keys generated yet. Click the button above to create one.
            </div>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
};
