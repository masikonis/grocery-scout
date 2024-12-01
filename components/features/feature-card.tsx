import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export function FeatureCard({ title, description, Icon }: FeatureCardProps) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-orange-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}