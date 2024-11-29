import React, { useState } from 'react';
import { InlineMath } from 'react-katex';

interface ResultDisplayProps {
  result: {
    type: string;
    value: any;
  } | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [showSteps, setShowSteps] = useState(false);

  if (!result) return null;

  if (result.type === 'error') {
    return <p className="text-red-600 dark:text-red-400">{result.value}</p>;
  }

  const renderSteps = (steps: string[]) => (
    <div className={`mt-4 overflow-hidden transition-all duration-300 ${showSteps ? 'max-h-[2000px]' : 'max-h-0'}`}>
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700">
        <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">Step by Step Solution:</h4>
        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start space-x-3 text-gray-700 dark:text-gray-300 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm">
                  {index + 1}
                </span>
                <span className="pt-1 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );

  const toggleButton = (steps: string[]) => (
    <button
      onClick={() => setShowSteps(!showSteps)}
      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center space-x-2"
    >
      <span>{showSteps ? 'Hide' : 'Show'} Solution Steps</span>
      <svg
        className={`w-4 h-4 transition-transform duration-200 ${showSteps ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  switch (result.type) {
    case 'prime':
      return (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Prime Factorization:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(result.value.factors).map(([prime, power]) => (
              <span key={prime} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-700 dark:text-indigo-200">
                <InlineMath math={`${prime}^{${power}}`} />
              </span>
            ))}
          </div>
          {toggleButton(result.value.steps)}
          {renderSteps(result.value.steps)}
        </div>
      );
    case 'totient':
      return (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Euler's Totient Value:</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.value.result}</p>
          {toggleButton(result.value.steps)}
          {renderSteps(result.value.steps)}
        </div>
      );
    case 'miller':
      return (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Miller-Rabin Primality Test:</h3>
          <p className={`text-lg font-semibold ${result.value.isPrime ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {result.value.isPrime ? 'Prime' : 'Not Prime'}
          </p>
          {toggleButton(result.value.steps)}
          {renderSteps(result.value.steps)}
        </div>
      );
    case 'fastexp':
      return (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Fast Exponentiation:</h3>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Result: {result.value.result}</p>
          {toggleButton(result.value.steps)}
          {renderSteps(result.value.steps)}
        </div>
      );
    case 'crt':
      return (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Chinese Remainder Theorem:</h3>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            Solution: {result.value.solution} (mod {result.value.modulus})
          </p>
          {toggleButton(result.value.steps)}
          {renderSteps(result.value.steps)}
        </div>
      );
    default:
      return null;
  }
};