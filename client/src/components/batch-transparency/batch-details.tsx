import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BatchWithDetails } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Printer, ExternalLink, Download, ArrowLeft } from "lucide-react";

type BatchDetailsProps = {
  batchCode: string;
};

export default function BatchDetails({ batchCode }: BatchDetailsProps) {
  const { data: batch, isLoading, error } = useQuery<BatchWithDetails>({
    queryKey: [`/api/batches/code/${batchCode}`],
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !batch) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-neutral-900">Batch Not Found</h3>
          </div>
          <p className="text-neutral-700 mb-4">
            Sorry, we couldn't find a batch with the code <span className="font-mono">{batchCode}</span>.
          </p>
          <Link href="/#batch-transparency">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Try Another Batch
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-neutral-900">
            Batch Information: <span className="font-mono">{batch.batchCode}</span>
          </h3>
          <Button variant="ghost" onClick={handlePrint} className="no-print">
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
        </div>
        
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Product</h4>
              <p className="font-semibold">{batch.product.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Batch No.</h4>
              <p className="font-mono font-semibold">{batch.batchCode}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Production Date</h4>
              <p>{formatDate(batch.productionDate)}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-neutral-900 mb-3">Ingredient Composition</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Extract Type</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Extraction Ratio</TableHead>
                  <TableHead>Harvest Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batch.ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ingredient.ingredient.name}</div>
                        <div className="text-xs text-neutral-500">{ingredient.ingredient.scientificName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{ingredient.extractType || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{ingredient.percentage}%</TableCell>
                    <TableCell>{ingredient.extractionRatio || 'N/A'}</TableCell>
                    <TableCell>{ingredient.harvestDate ? formatDate(ingredient.harvestDate) : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-medium text-neutral-900 mb-3">Quality Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between bg-neutral-50 p-3 rounded-md">
                <span className="text-sm text-neutral-700">Alcohol Percentage</span>
                <span className="text-sm font-medium">{batch.alcoholPercentage}%</span>
              </div>
              <div className="flex justify-between bg-neutral-50 p-3 rounded-md">
                <span className="text-sm text-neutral-700">Tested for Heavy Metals</span>
                <span className="text-sm font-medium text-green-600">Passed</span>
              </div>
              <div className="flex justify-between bg-neutral-50 p-3 rounded-md">
                <span className="text-sm text-neutral-700">Tested for Microbials</span>
                <span className="text-sm font-medium text-green-600">Passed</span>
              </div>
              <div className="flex justify-between bg-neutral-50 p-3 rounded-md">
                <span className="text-sm text-neutral-700">Organic Certification</span>
                <span className="text-sm font-medium">{batch.organicCertification || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-neutral-900 mb-3">Documents & Research</h4>
            <div className="space-y-3">
              {batch.documents.map((doc) => (
                <a 
                  key={doc.id}
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between bg-neutral-50 p-3 rounded-md hover:bg-neutral-100 transition duration-150"
                >
                  <span className="text-sm text-neutral-700 flex items-center">
                    {doc.type === 'certificate' || doc.type === 'lab_result' ? (
                      <Download className="text-red-500 mr-2 h-4 w-4" />
                    ) : (
                      <ExternalLink className="text-primary mr-2 h-4 w-4" />
                    )}
                    {doc.title}
                  </span>
                  {doc.type === 'certificate' || doc.type === 'lab_result' ? (
                    <Download className="text-neutral-500 h-4 w-4" />
                  ) : (
                    <ExternalLink className="text-neutral-500 h-4 w-4" />
                  )}
                </a>
              ))}
              
              {batch.documents.length === 0 && (
                <div className="bg-neutral-50 p-3 rounded-md text-sm text-neutral-500 text-center">
                  No documents available for this batch
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-neutral-200 no-print">
          <Link href="/#product-discovery">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Products
            </Button>
          </Link>
          <div>
            <Button variant="outline" className="mr-2">
              Share
            </Button>
            <Button>
              Where to Buy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
