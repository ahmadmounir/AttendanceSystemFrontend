"use client"

import { Toaster as HotToaster } from "react-hot-toast"

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      containerClassName="react-hot-toast-container"
      toastOptions={{
        duration: 4000,
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
        loading: {
          duration: 2000,
        },
      }}
    />
  )
}
