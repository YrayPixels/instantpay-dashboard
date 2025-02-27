
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Receipt, Search, Calendar, DollarSign } from "lucide-react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"

const Transactions = () => {
  return (
    <DashboardLayout>

      <div className="min-h-screen bg-slate-50">
        <div className="container py-8">
          <div className="space-y-6">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Transactions
              </h1>
              <p className="text-slate-600">
                View and manage your transaction history
              </p>
            </header>

            {/* Search and Filter Section */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Calendar className="mr-2" />
                    Filter by Date
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Example transactions - replace with real data */}
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Receipt className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Transaction #{index}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium flex items-center">
                          <DollarSign className="h-4 w-4" />
                          {(Math.random() * 1000).toFixed(2)}
                        </span>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Transactions