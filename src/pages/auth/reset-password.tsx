import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPasswordBegin, resetPasswordVerify, resetPasswordCommit } from '../../services/auth-service';
import { ArrowLeft, CheckCircle, Mail, Eye, EyeOff } from 'lucide-react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/components/ui/toast-config";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

// Define the form schemas with Zod
const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const codeFormSchema = z.object({
  code: z.string().min(4, { message: "Verification code is required" }),
});

const passwordFormSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Define the form values types
type EmailFormValues = z.infer<typeof emailFormSchema>;
type CodeFormValues = z.infer<typeof codeFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Initialize email form with react-hook-form and zod validation
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Initialize code form with react-hook-form and zod validation
  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  // Initialize password form with react-hook-form and zod validation
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitEmail = async (data: EmailFormValues) => {
    setIsLoadingEmail(true);

    try {
      const response = await resetPasswordBegin(data.email);

      if (!response.success) {
        throw new Error(response.message || 'Failed to send reset password email');
      }

      setEmail(data.email);
      setShowCodeVerification(true);
      showToast.success('Verification code sent to your email');
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const onSubmitCode = async (data: CodeFormValues) => {
    setIsLoadingCode(true);

    try {
      const response = await resetPasswordVerify(email, data.code);

      if (!response.success) {
        throw new Error(response.message || 'Failed to verify code');
      }

      const token = response.data?.token || '';
      
      // Set the token in the password form
      passwordForm.setValue('token', token);
      
      setShowCodeVerification(false);
      setShowPasswordReset(true);
      showToast.success('Code verified successfully');
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingCode(false);
    }
  };

  const onSubmitNewPassword = async (data: PasswordFormValues) => {
    setIsLoadingReset(true);

    try {
      // Use the token from the form data
      const response = await resetPasswordCommit(data.token, data.newPassword);

      if (!response.success) {
        throw new Error(response.message || 'Failed to reset password');
      }

      setResetComplete(true);
      showToast.success('Password reset successfully');
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingReset(false);
    }
  };

  const handleTryAgain = () => {
    setShowCodeVerification(false);
    emailForm.reset();
  };

  // Initial step: Enter email
  if (!showCodeVerification && !showPasswordReset && !resetComplete) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email and we'll send you a verification code
            </CardDescription>
          </CardHeader>
          
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-5">
              <CardContent className="space-y-4">              
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoadingEmail}
                  className="w-full text-white"
                >
                  {isLoadingEmail ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </CardContent>
            </form>
          </Form>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              <Link to="/auth/login" className="text-primary hover:underline flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Second step: Enter verification code
  if (showCodeVerification && !resetComplete) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification code to your email
            </CardDescription>
          </CardHeader>
          
          <Form {...codeForm}>
            <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="space-y-5">
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check your email <strong>{email}</strong> for the verification code
                  </p>
                </div>
                
                <FormField
                  control={codeForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter verification code"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoadingCode}
                  className="w-full text-white"
                >
                  {isLoadingCode ? 'Verifying...' : 'Verify Code'}
                </Button>
              </CardContent>
            </form>
          </Form>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Didn't receive the code?{" "}
              <button 
                type="button"
                onClick={handleTryAgain}
                className="text-primary hover:underline bg-transparent border-none p-0"
              >
                Try again
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Third step: Set new password
  if (showPasswordReset && !resetComplete) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password
            </CardDescription>
          </CardHeader>
          
          <Form {...passwordForm}>
  <form onSubmit={passwordForm.handleSubmit(onSubmitNewPassword)} className="space-y-5">
    <CardContent className="space-y-4">
      
      {/* Hidden token */}
      <FormField
        control={passwordForm.control}
        name="token"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />

      {/* New password */}
      <FormField
        control={passwordForm.control}
        name="newPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  placeholder="Enter new password"
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
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Confirm password */}
      <FormField
        control={passwordForm.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  placeholder="Confirm new password"
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
        disabled={isLoadingReset}
        className="w-full text-white"
      >
        {isLoadingReset ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </CardContent>
  </form>
</Form>
        </Card>
      </div>
    );
  }

  // Final step: Reset successful
  if (resetComplete) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Password Reset Successful</CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully reset
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              className="w-full text-white" 
              onClick={() => navigate('/auth/login')}
            >
              Go to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // This should never happen but adding a fallback
  return null;
};

export default ResetPassword;