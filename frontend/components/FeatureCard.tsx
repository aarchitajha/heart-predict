import React from 'react';

interface FeatureCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  impact?: 'high' | 'medium' | 'low';
}

export default function FeatureCard({ title, value, icon, impact }: FeatureCardProps) {
  const getImpactColor = () => {
    switch(impact) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-800 border-gray-700 text-gray-300';
    }
  };

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between ${getImpactColor()}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="p-2 rounded-lg bg-black/20">{icon}</div>}
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
      {impact && (
        <span className="text-xs uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-black/20">
          {impact} impact
        </span>
      )}
    </div>
  );
}
