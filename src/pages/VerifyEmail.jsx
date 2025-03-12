import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState("verifying"); // verifying, success, error
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmailAddress = async () => {
      const oobCode = searchParams.get("oobCode");
      
      if (!oobCode) {
        setVerificationState("error");
        setError("Invalid verification link. Please request a new verification email from your settings.");
        return;
      }

      try {
        const result = await verifyEmail(oobCode);
        if (result.success) {
          setVerificationState("success");
        } else {
          setVerificationState("error");
          setError(result.error || "Failed to verify email. Please try again.");
        }
      } catch (error) {
        setVerificationState("error");
        setError("An unexpected error occurred. Please try again.");
      }
    };

    verifyEmailAddress();
  }, [searchParams]);

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {verificationState === "verifying" && "Verifying your email address..."}
            {verificationState === "success" && "Your email has been verified!"}
            {verificationState === "error" && "Verification Failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          {verificationState === "verifying" && (
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          )}
          {verificationState === "success" && (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          )}
          {verificationState === "error" && (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {verificationState === "verifying" && "This may take a moment..."}
            {verificationState === "success" && "You can now access all features of your account."}
            {verificationState === "error" && error}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/settings")}>
            Go to Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail; 