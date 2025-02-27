import { useEffect, useState } from "react";
import { Globe, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { webhookQueries } from "@/lib/supabase";

interface Webhook {
  id: string;
  url: string;
  is_active: boolean;
}

export const WebhookSection = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [update, setUpdate] = useState(0);
  useEffect(() => {
    const getWebHooks = async () => {
      console.log(update)

      try {
        const response = await webhookQueries.getWebhooks();
        setWebhooks(response);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load webhooks");
      }
    }
    getWebHooks()
  }, [update])

  const addWebhook = async () => {
    if (!newWebhookUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }

    const response = await webhookQueries.createWebhook(newWebhookUrl);
    if (!response) {
      toast.error("Failed to add webhook");
      return;
    }
    setUpdate(Math.random());
    setNewWebhookUrl("");
    toast.success("Webhook added successfully");
  };

  const toggleWebhook = async (id: string, active:boolean) => {
    const response = await webhookQueries.updateWebhookStatus(id, !active );

    if (!response) {
      toast.error("Failed to update webhook status");
      return;
    }
    setUpdate(Math.random());
    toast.success("Webhook status updated");
  };

  const deleteWebhook = async (id: string) => {
    const response = await webhookQueries.deleteWebhook(id);
    if (!response) {
      toast.error("Failed to delete webhook");
      return;
    }
    setUpdate(Math.random());
    toast.success("Webhook deleted successfully");
  };

  return (
    <DashboardLayout>

      <Card className="p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">Webhooks</h2>
        </div>
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter webhook URL"
            value={newWebhookUrl}
            onChange={(e) => setNewWebhookUrl(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={addWebhook} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Webhook
          </Button>
        </div>
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-secondary animate-slideIn"
            >
              <div className="flex items-center space-x-4">
                <Globe className="w-5 h-5 text-slate-600" />
                <span className="font-mono text-sm text-slate-600">
                  {webhook.url}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Switch
                  checked={webhook.is_active}
                  onCheckedChange={() => toggleWebhook(webhook.id, webhook.is_active)}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteWebhook(webhook.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {webhooks.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No webhooks configured yet. Add one above to get started.
            </div>
          )}
        </div>
      </Card>
    </DashboardLayout>

  );
};
