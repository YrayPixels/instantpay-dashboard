
import { useEffect, useState } from "react";
import { Copy, CreditCard, Key, Plus, QrCode, Trash, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { merchantQueries } from "@/lib/supabase";
import { PublicKey } from "@solana/web3.js"




const Settings = () => {
  const [settlementAddress, setSettlementAddress] = useState(null)
  const [userInput, setUserInput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [update, setUpdate] = useState(0)
  const { user } = useAuth()

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  useEffect(() => {
    (async () => {
      setLoading(true)
      const response = await merchantQueries.getMerchantAddress();

      if (!response) {
        toast.error("Failed to load merchant address")
        setLoading(false)
        return;
      }
      setSettlementAddress(response)
      setLoading(false)
    })()
  }, [user, update])

  const updateWalletAddress = async () => {
    setLoading(true)
    if (!userInput) {
      toast.error("Please enter a wallet address")
      setLoading(false)
      return
    }

    try {
      new PublicKey(userInput)

    } catch (e) {
      toast.error("Invalid wallet address")
      setLoading(false)
      return
    }

    const response = await merchantQueries.updateMerchantAddress(settlementAddress.id, userInput)
    if (!response) {
      toast.error("Failed to update wallet address")
      setLoading(false)
      return;
    }
    setUserInput("")
    toast.success("Wallet address updated successfully")
    setLoading(false)
    setUpdate(Math.random())
  }

  const addWalletAddress = async () => {
    setLoading(true)

    if (!userInput) {
      toast.error("Please enter a wallet address")
      setLoading(false)

      return
    }

    try {
      new PublicKey(userInput)

    } catch (e) {
      toast.error("Invalid wallet address")
      setLoading(false)

      return
    }

    const response = await merchantQueries.createMerchantAddress(userInput)
    if (!response) {
      toast.error("Failed to add wallet address")
      return;
    }
    setUserInput(null)
    toast.success("Wallet address added successfully")
    setLoading(false)

    setUpdate(Math.random())
  }

  return (
    <DashboardLayout>
      <Card className="p-6 animate-fadeIn mb-5">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Profile Details
        </h2>
        <div className="flex flex-col gap-4">
          <h2>Id : {user.id} </h2>
          <h2>Email : {user.email} </h2>
        </div>
      </Card>

      <Card className="p-6 animate-fadeIn">
        <div className="flex flex-col justify-between items-start mb-6 space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Settlement Address</h2>
          <div className="flex w-full gap-2 mb-6">
            <Input
              placeholder={`${settlementAddress ? "Update Wallet Address" : "Enter wallet Address"}`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={() =>settlementAddress ? updateWalletAddress() : addWalletAddress()} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              {loading ? "Loading..." :
                `${settlementAddress ? "Update Wallet Address" : "Add wallet Address"}`}
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {settlementAddress && (
            <div
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-secondary animate-slideIn"
            >
              <div className="flex flex-col">
                <span className="font-mono text-sm text-slate-600">{settlementAddress.wallet_address.slice(0, 13) + "...."}</span>
                <span className="text-xs text-slate-500">
                  Created: {new Date(settlementAddress.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(settlementAddress.wallet_address)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                {/* <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteAddress(settlementAddress.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button> */}
              </div>
            </div>
          )}
          {setSettlementAddress && (
            <div className="text-center py-8 text-slate-500">
              No Settlement has been added yet. Click the button above to create one.
            </div>
          )}
        </div>
      </Card>
    </DashboardLayout>

  );
};


export default Settings;