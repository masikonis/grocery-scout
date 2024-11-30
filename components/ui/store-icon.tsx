import Image from 'next/image'

interface StoreIconProps {
  storeName: string;
  className?: string;
}

export function StoreIcon({ storeName, className }: StoreIconProps) {
  return (
    <Image
      src={`/stores/${storeName}.png`}
      alt={`${storeName} logo`}
      width={16}
      height={16}
      className={className}
    />
  )
} 