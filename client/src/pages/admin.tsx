import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/admin/login-form";
import { ArrowLeft, LogOut, Settings, Beaker, Box, FileDown } from "lucide-react";
import { Link } from "wouter";
import { AdminAuthProvider, useAdminAuth } from "@/hooks/use-admin-auth";

type AdminTab = "products" | "batches" | "export" | "settings";

function AdminDashboard() {
  const { adminUser, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-amber-700 hover:text-amber-900">
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-800">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold gradient-text">Admin Portal</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right mr-4">
            <p className="text-sm font-medium text-amber-900">{adminUser?.username}</p>
            <p className="text-xs text-amber-600">{adminUser?.role}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="border-amber-300 text-amber-800"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as AdminTab)}>
        <TabsList className="mb-6 bg-amber-100 p-1">
          <TabsTrigger 
            value="products" 
            className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
          >
            <Box className="mr-2 h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger 
            value="batches"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
          >
            <Beaker className="mr-2 h-4 w-4" /> Batches
          </TabsTrigger>
          <TabsTrigger 
            value="export"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
          >
            <FileDown className="mr-2 h-4 w-4" /> Export
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
          >
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card className="mycelium-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                <Box className="mr-2 h-5 w-5 text-amber-600" />
                Product Management
              </h2>
              <div className="bg-amber-50/50 p-4 rounded-md border border-[rgba(198,156,78,0.15)]">
                <p className="text-amber-700">
                  Product management feature coming soon. Here you'll be able to:
                </p>
                <ul className="list-disc list-inside mt-2 text-amber-700 space-y-1 text-sm">
                  <li>Create and edit product formulations</li>
                  <li>Manage ingredient profiles</li>
                  <li>Update product descriptions and health benefits</li>
                  <li>Upload product images and documentation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="batches">
          <Card className="mycelium-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                <Beaker className="mr-2 h-5 w-5 text-amber-600" />
                Batch Management
              </h2>
              <div className="bg-amber-50/50 p-4 rounded-md border border-[rgba(198,156,78,0.15)]">
                <p className="text-amber-700">
                  Batch management feature coming soon. Here you'll be able to:
                </p>
                <ul className="list-disc list-inside mt-2 text-amber-700 space-y-1 text-sm">
                  <li>Create new production batches</li>
                  <li>Track ingredient sources and lot numbers</li>
                  <li>Generate QR codes for product labels</li>
                  <li>Upload lab test results and certificates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card className="mycelium-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                <FileDown className="mr-2 h-5 w-5 text-amber-600" />
                Export Options
              </h2>
              <div className="bg-amber-50/50 p-4 rounded-md border border-[rgba(198,156,78,0.15)]">
                <p className="text-amber-700">
                  Export feature coming soon. Here you'll be able to:
                </p>
                <ul className="list-disc list-inside mt-2 text-amber-700 space-y-1 text-sm">
                  <li>Generate label PDFs with batch QR codes</li>
                  <li>Export product catalog for e-commerce platforms</li>
                  <li>Create batch reports for compliance and record keeping</li>
                  <li>Download customer-facing documentation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="mycelium-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-amber-600" />
                Settings
              </h2>
              <div className="bg-amber-50/50 p-4 rounded-md border border-[rgba(198,156,78,0.15)]">
                <p className="text-amber-700">
                  Settings feature coming soon. Here you'll be able to:
                </p>
                <ul className="list-disc list-inside mt-2 text-amber-700 space-y-1 text-sm">
                  <li>Manage admin user accounts and permissions</li>
                  <li>Configure email notifications</li>
                  <li>Customize product label templates</li>
                  <li>Set up integrations with other systems</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AdminPortal() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center mb-8 text-amber-700 hover:text-amber-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <LoginForm onSuccess={() => {}} />
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

export default function Admin() {
  return (
    <AdminAuthProvider>
      <AdminPortal />
    </AdminAuthProvider>
  );
}