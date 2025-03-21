import { Check } from "@phosphor-icons/react"

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({ checked=false, onChange }: CheckboxProps) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-6 h-6 rounded-[4px] text-gray-100 flex cursor-pointer items-center justify-center ${
        checked ? "bg-green-500" : "bg-gray-900"
      }`}
    >
      {checked && <Check size={16} weight="bold" />}
    </div>
  )
}