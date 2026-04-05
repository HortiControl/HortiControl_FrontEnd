import { Button } from './Button';
import { Plus } from 'lucide-react';

export function PageHeader({ title, subtitle, buttonText }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
        <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>
      </div>
      
      {/* Só renderiza o botão se passarmos um texto para ele */}
      {buttonText && (
        <div className="mt-4 sm:mt-0">
          <Button icon={Plus}>{buttonText}</Button>
        </div>
      )}
    </div>
  );
}