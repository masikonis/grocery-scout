import { ShoppingBasket, Clock, ListChecks } from 'lucide-react';
import { FeatureCard } from './feature-card';

const features = [
    {
      title: 'Quality Meets Value',
      description: 'Find great deals on fresh, minimally processed foods and essentials.',
      Icon: ShoppingBasket
    },
    {
      title: 'Save Time and Money',
      description: 'Compare deals at different grocery stores easily to save time and effort.',
      Icon: Clock
    },
    {
      title: 'Simplify Your Shopping',
      description: 'Create a custom shopping list and get it sent to your inbox in seconds.',
      Icon: ListChecks
    }
] as const;  

export function WhyChooseSection() {
  return (
    <section className="py-16 bg-gray-50">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Why Choose Grocery Scout?
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => (
            <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                Icon={feature.Icon}
            />
            ))}
        </div>
    </section>
  );
}