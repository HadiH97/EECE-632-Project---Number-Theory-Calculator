import React from 'react';
import { History, Trash2, Loader2, X } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { Calculation } from '../db/database';

interface HistoryPanelProps {
  history: Calculation[];
  onClearHistory: () => void;
  onDeleteCalculation: (id: number) => void;
  isLoading?: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history, 
  onClearHistory, 
  onDeleteCalculation,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          <span className="text-gray-600 dark:text-gray-400">Loading history...</span>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">History</h3>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">No calculations yet</p>
      </div>
    );
  }

  const renderResult = (operation: string, result: string) => {
    if (operation === 'Miller-Rabin Test') {
      return `Result: ${result}`;
    }
    return <span>Result: <InlineMath math={result} /></span>;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">History</h3>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
        {history.map((calc) => (
          <div
            key={calc.id}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg relative group border border-gray-200 dark:border-gray-600"
          >
            <button
              onClick={() => calc.id && onDeleteCalculation(calc.id)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete calculation"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex justify-between items-start pr-8">
              <div>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{calc.operation}</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  <InlineMath math={calc.input} />
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {renderResult(calc.operation, calc.result)}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(calc.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};