import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/features/auth/api/authApi";
import { isAdminRole } from "@/shared/utils/roles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/shared/components/ui/toast-config";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/components/ui";

// Define the form values type
interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Define the form schema
  const formSchema = z.object({
    email: z.string().min(1, { message: "Required" }),
    password: z.string().min(6, {
      message: "Required",
    }),
  });

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const response = await login({
        username: data.email,
        password: data.password,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to login");
      }

      // Route based on user role
      if (response.data && isAdminRole(response.data.role)) {
        // Admin users go to portal dashboard
        navigate("/portal/dashboard", { replace: true });
      } else {
        // Members go to their profile page
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />
      <div className="flex flex-col min-h-screen w-full items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md flex-col gap-6">
          <Card className="bg-card text-card-foreground">
            <CardHeader className="space-y-1">
              <CardTitle className={`text-xl font-bold text-center `}>
                Login
              </CardTitle>
              <CardDescription className={`text-center text-muted-foreground `}>
                Sign in to your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <FormLabel className="font-semibold">Email</FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            type="text"
                            autoComplete="username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type="password"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Loading..." : "Login"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
