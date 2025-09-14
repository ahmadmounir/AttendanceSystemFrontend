import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/auth-service';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { showToast } from "@/components/ui/toast-config";
import PasswordStrength from "@/components/ui/password-strength";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters",
  }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timezone, setTimezone] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch timezone from IP API
  useEffect(() => {
    const fetchTimezone = async () => {
      try {
        const response = await fetch('http://ip-api.com/json?fields=status,message,timezone&lang=en');
        const data = await response.json();
        
        if (data.status === 'success' && data.timezone) {
          setTimezone(data.timezone);
        } else {
          const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setTimezone(fallback);
        }
      } catch (error) {
        console.error('Error fetching timezone:', error);
        const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(fallback);
      }
    };

    fetchTimezone();
  }, []);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Adapt the data to match what the API expects
      const response = await register({ 
        username: data.email.split('@')[0], // Use part of email as username
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email, 
        password: data.password,
        phone: data.phone,
        timezoneId: timezone
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to register');
      }

      // Show success toast
      showToast.success('Registration successful!');
      
      // Redirect to login page
      navigate('/auth/login');
    } catch (err) {
      console.error('Registration error:', err);
      showToast.error(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          type="tel"
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
                      <FormLabel className="required">Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Enter password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className="mt-2">
                        <PasswordStrength password={field.value} />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Enter confirm password"
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-semibold"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="text-center mt-4">
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-primary hover:underline">
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;