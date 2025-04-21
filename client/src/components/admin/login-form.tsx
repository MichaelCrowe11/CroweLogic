import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Microscope, Key, Eye, EyeOff, LogIn } from "lucide-react";

const loginSchema = z.object({
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const success = await login(values.username, values.password);
      if (success) {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mycelium-card p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="relative w-16 h-16 bg-gradient-to-r from-amber-700 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Microscope className="w-8 h-8 text-white" />
          <div className="absolute -inset-1 rounded-full border border-amber-300 opacity-50"></div>
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Admin Portal</h2>
        <p className="text-amber-700 text-sm">
          Please log in with your administrative credentials
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-amber-800">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="admin@crowelogic.com"
                      className="pl-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                      {...field}
                      disabled={isLoading}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">
                      <Microscope className="h-4 w-4" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-amber-800">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="pl-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                      {...field}
                      disabled={isLoading}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">
                      <Key className="h-4 w-4" />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 text-amber-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white mycelium-button"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              <div className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </div>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 pt-6 border-t border-[rgba(198,156,78,0.2)] text-center">
        <p className="text-amber-600 text-sm">
          The admin portal is for authorized personnel only.
          <br />
          <strong className="text-amber-700">Note:</strong> Admin credentials for demo: 
          <br />
          <code className="bg-amber-50 px-1 py-0.5 rounded text-amber-800 text-xs">
            admin@crowelogic.com
          </code> / <code className="bg-amber-50 px-1 py-0.5 rounded text-amber-800 text-xs">
            CroweLogic2025!
          </code>
        </p>
      </div>
    </div>
  );
}