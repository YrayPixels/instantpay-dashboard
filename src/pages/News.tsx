import { useEffect, useState } from "react";
import { Globe, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Editor from 'react-simple-wysiwyg';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { webhookQueries } from "@/lib/supabase";
import AppSettings from "@/lib/store/settingsstore";
import Modal from '@mui/material/Modal';
import { queries } from "@/lib/queries";
import { Box, TextField, useMediaQuery } from "@mui/material";



export const News = () => {
  const isMobile = useMediaQuery("(max-width:600px)")
  const { update, systemUpdate } = AppSettings();
  const [news, setNews] = useState([]);
  const [addNews, setAddNews] = useState(true);

  const [newItem, setNewItem] = useState({
    title: "",
    preview_image: "",
    video_url: "",
    caption: "",
    content: ""
  })


  const [html, setHtml] = useState('my <b>HTML</b>');

  function onChange(e) {
    setHtml(e.target.value);
  }

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await queries.getAllNewsEvents();
        setNews(response);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load webhooks");
      }
    }
    getNews()
  }, [update])

  const addNewsEvents = async () => {
    if (newItem.caption == "" || newItem.content == "" || newItem.content == "") {
      toast.error("Please fill all fields");
      return;
    }

    const response = await queries.createNewsEvent({
      title: newItem.title,
      preview_image: newItem.preview_image,
      video_url: newItem.video_url,
      caption: newItem.caption,
      content: newItem.content
    });
    if (!response) {
      toast.error("Failed to add news");
      return;
    }
    systemUpdate()
    // set("");
    toast.success("News/Events added successfully");
  };

  const toggleWebhook = async (id: string, active: boolean) => {
    const response = await webhookQueries.updateWebhookStatus(id, !active);

    if (!response) {
      toast.error("Failed to update webhook status");
      return;
    }
    systemUpdate();
    toast.success("News/Events  updated");
  };

  const deleteWebhook = async (id: string) => {
    const response = await webhookQueries.deleteWebhook(id);
    if (!response) {
      toast.error("Failed to delete webhook");
      return;
    }
    systemUpdate();
    toast.success("Webhook deleted successfully");
  };

  return (
    <DashboardLayout>

      <Card className="p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">News/Events</h2>
          <Button onClick={() => setAddNews(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add News/Events
          </Button>
        </div>
        <div className="flex gap-2 mb-6">
          {/* <Input
            placeholder="Enter webhook URL"
            value={newWebhookUrl}
            onChange={(e) => setNewWebhookUrl(e.target.value)}
            className="flex-grow"
          /> */}


        </div>
        <div className="space-y-4">
          {news.map((data) => (
            <div
              key={data.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-secondary animate-slideIn"
            >
              {/* <div className="flex items-center space-x-4">
                <Globe className="w-5 h-5 text-slate-600" />
                <span className="font-mono text-sm text-slate-600">
                  {data.}
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
              </div> */}
            </div>
          ))}
          {news.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No news or events added yet!
            </div>
          )}


          <Modal
            open={addNews}
            sx={{ height: '100%', width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClose={() => setAddNews(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box component="form"
              sx={{
                backgroundColor: 'white', height: isMobile ? "95%" : '70%', width: isMobile ? "95%" : "70%", p: 4, borderRadius: 5,
                '& .MuiTextField-root': {
                  m: 1, width: '100%'
                }, overflow: 'scroll'
              }}
              noValidate
              autoComplete="off"
            >
              <Button onClick={() => setAddNews(false)} className="bg-red-500  hover:bg-red-500/90">
                Close
              </Button>
              <TextField
                required
                id="outlined"
                label="Title"
                value={(newItem.title)}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}

              />
              <TextField
                required
                id="outlined"
                label="Caption"
                placeholder="Please enter caption for post"
                value={newItem.caption}
                onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
              />
              <TextField
                id="outlined-password-input"
                label="Add Image"
                type="file"
              />
              <TextField
                id="outlined-password-input"
                label="Video"
                type="file"
              />
              <div className="h-[50%]">
                <Editor value={html} onChange={onChange} />
              </div>

            </Box>
          </Modal>
        </div>
      </Card>
    </DashboardLayout>

  );
};
