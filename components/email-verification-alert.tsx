"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"
import { EmailVerificationDialog } from "@/components/email-verification-dialog"

interface EmailVerificationAlertProps {
  onResendVerification?: () => void
}

export function EmailVerificationAlert({}: EmailVerificationAlertProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  return (
    <>
      <Card className="mb-5">
          <CardHeader className="flex items-center justify-between">
              <div>
              <CardTitle className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="h-5 w-5 text-orange-500" />
                  Email Not Verified
              </CardTitle>
              <CardDescription>
                  Your email address has not been verified yet.
              </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleOpenDialog}>
              Send Verification Email
              </Button>
          </CardHeader>
      </Card>
      
      <EmailVerificationDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </>
  )
}
