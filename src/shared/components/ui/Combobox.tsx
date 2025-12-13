import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/shared/utils/cn"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Button } from "./Button"
import { Input } from "./Input"
export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  disabled?: boolean
  showSearch?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  showSearch = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.value.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue)
    setOpen(false)
    setSearchValue("")
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="z-50 w-[--radix-popover-trigger-width] rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          sideOffset={4}
          onWheel={(e) => e.stopPropagation()}
        >
          {showSearch && (
            <div className="p-1">
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-8"
              />
            </div>
          )}
          <div 
            className="max-h-[200px] p-1 overflow-y-auto overflow-x-hidden"
            onWheel={(e) => e.stopPropagation()}
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center ">No results found.</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5  outline-none hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </button>
              ))
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}