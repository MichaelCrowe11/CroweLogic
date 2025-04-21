import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  QrCode, 
  FileSpreadsheet, 
  Download 
} from "lucide-react";
import { generateQRUrl } from "@/lib/utils";

type ExportFormat = "shopify" | "qr-codes" | "csv";

export default function ExportOptions() {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);
  const { toast } = useToast();

  const { data: shopifyData, refetch: refetchShopify } = useQuery({
    queryKey: ['/api/export/shopify'],
    enabled: false,
  });

  const { data: qrData, refetch: refetchQRCodes } = useQuery({
    queryKey: ['/api/export/qr-codes'],
    enabled: false,
  });

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(format);
    try {
      let data;
      let filename;
      let content;

      switch (format) {
        case "shopify":
          const shopifyResult = await refetchShopify();
          data = shopifyResult.data;
          if (!data) throw new Error("Failed to fetch Shopify data");
          content = JSON.stringify(data, null, 2);
          filename = `crowe-logic-shopify-export-${new Date().toISOString().split('T')[0]}.json`;
          break;

        case "qr-codes":
          const qrResult = await refetchQRCodes();
          data = qrResult.data;
          if (!data) throw new Error("Failed to fetch QR code data");
          
          // For QR codes, we'll create a CSV with batch codes and their URLs
          content = "Batch Code,QR URL\n";
          data.forEach((item: any) => {
            content += `${item.batchCode},${item.qrUrl}\n`;
          });
          filename = `crowe-logic-qr-codes-${new Date().toISOString().split('T')[0]}.csv`;
          break;

        case "csv":
          // Demo CSV export with product data (in a real scenario, we would have a proper API endpoint)
          const productResult = await fetch('/api/products');
          const products = await productResult.json();
          
          content = "ID,Name,Description,SKU,Health Benefit,Status\n";
          products.forEach((product: any) => {
            // Escape commas in text fields
            const escapedDescription = product.description.replace(/,/g, '","');
            content += `${product.id},"${product.name}","${escapedDescription}",${product.sku},${product.healthBenefit},${product.status}\n`;
          });
          filename = `crowe-logic-products-${new Date().toISOString().split('T')[0]}.csv`;
          break;
      }

      // Create and download the file
      const blob = new Blob([content], { type: format === "shopify" ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `Your ${format} export has been downloaded`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: `There was a problem exporting your ${format} data`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-neutral-900 mb-4">Export Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-neutral-200 hover:border-primary transition-colors">
          <div className="flex items-center mb-2">
            <ShoppingCart className="text-neutral-500 mr-2 h-5 w-5" />
            <h4 className="font-medium">Shopify Export</h4>
          </div>
          <p className="text-sm text-neutral-600 mb-3">
            Export product data in Shopify-compatible JSON format.
          </p>
          <Button 
            className="w-full"
            onClick={() => handleExport("shopify")}
            disabled={isExporting !== null}
          >
            {isExporting === "shopify" ? (
              <>
                <span className="animate-spin mr-2">
                  <i className="fas fa-spinner"></i>
                </span>
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Export to Shopify
              </>
            )}
          </Button>
        </Card>
        
        <Card className="p-4 border border-neutral-200 hover:border-primary transition-colors">
          <div className="flex items-center mb-2">
            <QrCode className="text-neutral-500 mr-2 h-5 w-5" />
            <h4 className="font-medium">QR Code Export</h4>
          </div>
          <p className="text-sm text-neutral-600 mb-3">
            Generate QR codes for batch transparency labels.
          </p>
          <Button 
            className="w-full"
            onClick={() => handleExport("qr-codes")}
            disabled={isExporting !== null}
          >
            {isExporting === "qr-codes" ? (
              <>
                <span className="animate-spin mr-2">
                  <i className="fas fa-spinner"></i>
                </span>
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Generate QR Codes
              </>
            )}
          </Button>
        </Card>
        
        <Card className="p-4 border border-neutral-200 hover:border-primary transition-colors">
          <div className="flex items-center mb-2">
            <FileSpreadsheet className="text-neutral-500 mr-2 h-5 w-5" />
            <h4 className="font-medium">CSV Export</h4>
          </div>
          <p className="text-sm text-neutral-600 mb-3">
            Export all product and batch data as CSV files.
          </p>
          <Button 
            className="w-full"
            onClick={() => handleExport("csv")}
            disabled={isExporting !== null}
          >
            {isExporting === "csv" ? (
              <>
                <span className="animate-spin mr-2">
                  <i className="fas fa-spinner"></i>
                </span>
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Export CSV Data
              </>
            )}
          </Button>
        </Card>
      </div>
      
      <div className="mt-6 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h4 className="font-medium mb-2 flex items-center">
          <QrCode className="h-4 w-4 mr-2" /> QR Code Documentation
        </h4>
        <p className="text-sm text-neutral-600 mb-2">
          QR codes are generated based on the following URL pattern:
        </p>
        <code className="bg-neutral-100 p-2 rounded block text-sm font-mono mb-3">
          {`${window.location.origin}/batch/<BATCH_CODE>`}
        </code>
        <p className="text-sm text-neutral-600">
          Print these QR codes and attach them to your product labels for transparency.
          When scanned, customers will be directed to your batch information page.
        </p>
      </div>
    </div>
  );
}
