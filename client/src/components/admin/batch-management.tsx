import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Batch, InsertBatch, Product, healthBenefits } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BadgePill from "@/components/ui/badge-pill";
import { formatDate } from "@/lib/utils";

const batchFormSchema = z.object({
  batchCode: z.string().min(1, "Batch code is required"),
  productId: z.coerce.number().min(1, "Product is required"),
  productionDate: z.string().min(1, "Production date is required"),
  alcoholPercentage: z.coerce.number().min(0, "Must be a positive number").max(100, "Maximum 100%"),
  organicCertification: z.string().optional(),
  notes: z.string().optional(),
});

export default function BatchManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<Batch | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: batches, isLoading: isBatchesLoading } = useQuery<Batch[]>({
    queryKey: ['/api/batches'],
  });
  
  const { data: products, isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  const createMutation = useMutation({
    mutationFn: async (batchData: InsertBatch) => {
      const res = await apiRequest('POST', '/api/batches', batchData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batches'] });
      toast({ title: "Batch created successfully" });
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create batch",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBatch> }) => {
      const res = await apiRequest('PUT', `/api/batches/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batches'] });
      toast({ title: "Batch updated successfully" });
      setEditingBatch(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update batch",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/batches/${id}`, undefined);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batches'] });
      toast({ title: "Batch deleted successfully" });
      setDeletingBatch(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete batch",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const addForm = useForm<z.infer<typeof batchFormSchema>>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      batchCode: "",
      productId: 0,
      productionDate: new Date().toISOString().split('T')[0],
      alcoholPercentage: 35,
      organicCertification: "",
      notes: "",
    },
  });
  
  const editForm = useForm<z.infer<typeof batchFormSchema>>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      batchCode: "",
      productId: 0,
      productionDate: "",
      alcoholPercentage: 35,
      organicCertification: "",
      notes: "",
    },
  });
  
  const handleAddSubmit = (data: z.infer<typeof batchFormSchema>) => {
    createMutation.mutate({
      ...data,
      productionDate: new Date(data.productionDate),
    });
  };
  
  const handleEditSubmit = (data: z.infer<typeof batchFormSchema>) => {
    if (!editingBatch) return;
    updateMutation.mutate({ 
      id: editingBatch.id, 
      data: {
        ...data,
        productionDate: new Date(data.productionDate),
      }
    });
  };
  
  const handleDeleteBatch = () => {
    if (!deletingBatch) return;
    deleteMutation.mutate(deletingBatch.id);
  };
  
  const getProductName = (productId: number) => {
    const product = products?.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };
  
  const filteredBatches = batches?.filter(batch => {
    const matchesQuery = batch.batchCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct = productFilter ? batch.productId.toString() === productFilter : true;
    return matchesQuery && matchesProduct;
  });
  
  if (isBatchesLoading || isProductsLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded w-full max-w-md"></div>
        <div className="h-64 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-neutral-900">Batch Management</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Add New Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Batch</DialogTitle>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="batchCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="CL220423" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        value={field.value.toString()} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products?.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="productionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Production Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="alcoholPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alcohol Percentage</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" max="100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="organicCertification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organic Certification</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="USDA Organic" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Additional batch information" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Saving..." : "Save Batch"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Search batches..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
        </div>
        <Select 
          value={productFilter} 
          onValueChange={setProductFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Products</SelectItem>
            {products?.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="overflow-x-auto bg-white border border-neutral-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Code</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Production Date</TableHead>
              <TableHead>Alcohol %</TableHead>
              <TableHead>Certification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches && filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-mono font-medium">{batch.batchCode}</TableCell>
                  <TableCell>{getProductName(batch.productId)}</TableCell>
                  <TableCell>{formatDate(batch.productionDate)}</TableCell>
                  <TableCell>{batch.alcoholPercentage}%</TableCell>
                  <TableCell>{batch.organicCertification || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={editingBatch?.id === batch.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditingBatch(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingBatch(batch);
                          editForm.reset({
                            batchCode: batch.batchCode,
                            productId: batch.productId,
                            productionDate: new Date(batch.productionDate).toISOString().split('T')[0],
                            alcoholPercentage: batch.alcoholPercentage || 0,
                            organicCertification: batch.organicCertification || '',
                            notes: batch.notes || '',
                          });
                        }}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Batch</DialogTitle>
                        </DialogHeader>
                        <Form {...editForm}>
                          <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                            <FormField
                              control={editForm.control}
                              name="batchCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Batch Code</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={editForm.control}
                              name="productId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Product</FormLabel>
                                  <Select 
                                    onValueChange={(value) => field.onChange(parseInt(value))} 
                                    value={field.value.toString()} 
                                    defaultValue={field.value.toString()}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a product" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {products?.map((product) => (
                                        <SelectItem key={product.id} value={product.id.toString()}>
                                          {product.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={editForm.control}
                                name="productionDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Production Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="alcoholPercentage"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Alcohol Percentage</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} min="0" max="100" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={editForm.control}
                              name="organicCertification"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Organic Certification</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={editForm.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Notes</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter className="gap-2 sm:gap-0">
                              <DialogClose asChild>
                                <Button type="button" variant="outline">
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Saving..." : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog
                      open={deletingBatch?.id === batch.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setDeletingBatch(null);
                        }
                      }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setDeletingBatch(batch)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Batch</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete batch <span className="font-mono font-medium">{batch.batchCode}</span>? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500 hover:bg-red-700" 
                            onClick={handleDeleteBatch}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-neutral-500">
                  {batches && batches.length === 0 
                    ? "No batches found. Add your first batch!" 
                    : "No batches match your search criteria."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-neutral-700">
          Showing <span className="font-medium">{filteredBatches?.length || 0}</span> of <span className="font-medium">{batches?.length || 0}</span> batches
        </div>
      </div>
    </div>
  );
}
