import { Button } from './Button';
import { Plus } from 'lucide-react';

export function PageHeader({ title, subtitle, buttonText, onButtonClick }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl lg:text-3xl">{title}</h1>
        <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">{subtitle}</p>
      </div>
      
      {/* Só renderiza o botão se passarmos um texto para ele */}
      {buttonText && (
        <div className="sm:mt-0 sm:self-start">
          <Button icon={Plus} onClick={onButtonClick} className="w-full sm:w-auto">
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}