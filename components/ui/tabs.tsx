"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { cn } from "@/lib/utils"

// Tabs Context
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

// Tabs Root Component
interface TabsProps {
  defaultValue: string
  className?: string
  children: ReactNode
  onValueChange?: (value: string) => void
}

export function Tabs({ defaultValue, className, children, onValueChange }: TabsProps) {
  const [value, setValue] = useState(defaultValue)

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// Tabs List Component
interface TabsListProps {
  className?: string
  children: ReactNode
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}>
      {children}
    </div>
  )
}

// Tabs Trigger Component
interface TabsTriggerProps {
  value: string
  className?: string
  children: ReactNode
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component")
  }

  const { value: selectedValue, onValueChange } = context
  const isSelected = selectedValue === value

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected 
          ? "bg-background text-foreground shadow-sm" 
          : "hover:bg-background/50",
        className
      )}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  )
}

// Tabs Content Component
interface TabsContentProps {
  value: string
  className?: string
  children: ReactNode
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component")
  }

  const { value: selectedValue } = context
  
  if (selectedValue !== value) {
    return null
  }

  return (
    <div className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}>
      {children}
    </div>
  )
}
