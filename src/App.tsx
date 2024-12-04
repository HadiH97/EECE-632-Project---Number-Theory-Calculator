import React, { useState } from 'react';
import { Calculator, ChevronRight, Binary, Hash, Divide, Sigma } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { NumberTheory } from './utils/numberTheory';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { useCalculationHistory } from './hooks/useCalculationHistory';
import { TabType } from './types';

const tabs = [
  { id: 'prime' as TabType, name: 'Prime Factorization', icon: Divide },
  { id: 'totient' as TabType, name: 'Totient Function', icon: Sigma },
  { id: 'miller' as TabType, name: 'Miller-Rabin', icon: Binary },
  { id: 'fastexp' as TabType, name: 'Fast Exponentiation', icon: ChevronRight },
  { id: 'crt' as TabType, name: 'Chinese Remainder', icon: Hash },
];

function App() {
  const [number, setNumber] = useState('');
  const [exponent, setExponent] = useState('');
  const [modulus, setModulus] = useState('');
  const [remainders, setRemainders] = useState('');
  const [moduli, setModuli] = useState('');
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('prime');
  const { history, isLoading, addCalculation, clearHistory, deleteCalculation } = useCalculationHistory();

  const validateNumber = (value: string): boolean => {
    return /^\d*$/.test(value);
  };

  const validateCommaSeparatedNumbers = (value: string): boolean => {
    return /^(\d+\s*,\s*)*\d*$/.test(value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const value = e.target.value;
    if (validateNumber(value)) {
      setter(value);
    }
  };

  const handleCommaSeparatedChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const value = e.target.value;
    if (validateCommaSeparatedNumbers(value)) {
      setter(value);
    }
  };

  const handleCompute = async () => {
    try {
      let input = '';
      let operation = '';
      let resultValue = '';

      switch (activeTab) {
        case 'prime':
        case 'totient':
        case 'miller': {
          const n = parseInt(number);
          if (!number || isNaN(n) || n <= 0) {
            setResult({ type: 'error', value: 'Please enter a valid positive number' });
            return;
          }
          
          input = `n = ${n}`;
          
          switch (activeTab) {
            case 'prime': {
              operation = 'Prime Factorization';
              const res = NumberTheory.primeFactorization(n);
              resultValue = Object.entries(res.factors)
                .map(([prime, power]) => `${prime}^{${power}}`)
                .join(' × ');
              setResult({ type: 'prime', value: res });
              break;
            }
            case 'totient': {
              operation = 'Euler\'s Totient';
              const res = NumberTheory.totient(n);
              resultValue = res.result.toString();
              setResult({ type: 'totient', value: res });
              break;
            }
            case 'miller': {
              operation = 'Miller-Rabin Test';
              const res = NumberTheory.millerRabin(n);
              resultValue = res.isPrime ? 'Prime' : 'Not Prime';
              setResult({ type: 'miller', value: res });
              break;
            }
          }
          break;
        }
        case 'fastexp': {
          const base = parseInt(number);
          const exp = parseInt(exponent);
          const mod = parseInt(modulus);

          if (!number || !exponent || !modulus || isNaN(base) || isNaN(exp) || isNaN(mod)) {
            setResult({ type: 'error', value: 'Please enter valid numbers for base, exponent, and modulus' });
            return;
          }

          if (mod <= 0) {
            setResult({ type: 'error', value: 'Modulus must be positive' });
            return;
          }

          operation = 'Fast Exponentiation';
          input = `${base}^{${exp}} \\bmod ${mod}`;
          const res = NumberTheory.fastExponentiation(base, exp, mod);
          resultValue = res.result.toString();
          setResult({ type: 'fastexp', value: res });
          break;
        }
        case 'crt': {
          if (!remainders.trim() || !moduli.trim()) {
            setResult({ type: 'error', value: 'Please enter both remainders and moduli as comma-separated values (e.g., "2,3,4")' });
            return;
          }

          const remainderArray = remainders.split(',').map(x => parseInt(x.trim()));
          const moduliArray = moduli.split(',').map(x => parseInt(x.trim()));
          
          if (remainderArray.some(isNaN) || moduliArray.some(isNaN)) {
            setResult({ type: 'error', value: 'Please enter valid numbers separated by commas' });
            return;
          }

          if (moduliArray.some(x => x <= 0)) {
            setResult({ type: 'error', value: 'All moduli must be positive' });
            return;
          }
          
          operation = 'Chinese Remainder Theorem';
          input = `Remainders: [${remainders}], Moduli: [${moduli}]`;
          const res = NumberTheory.chineseRemainderTheorem(remainderArray, moduliArray);
          resultValue = `${res.solution} (mod ${res.modulus})`;
          setResult({ type: 'crt', value: res });
          break;
        }
      }

      if (result?.type !== 'error') {
        await addCalculation(operation, input, resultValue);
      }
    } catch (error) {
      setResult({ type: 'error', value: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const renderInputs = () => {
    const inputClasses = "block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium text-gray-900 dark:text-gray-100 px-4 py-3 shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400";
    
    switch (activeTab) {
      case 'fastexp':
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="number" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Base</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                id="number"
                value={number}
                onChange={(e) => handleNumberChange(e, setNumber)}
                className={inputClasses}
                placeholder="Enter base number"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="exponent" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Exponent</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                id="exponent"
                value={exponent}
                onChange={(e) => handleNumberChange(e, setExponent)}
                className={inputClasses}
                placeholder="Enter exponent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="modulus" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Modulus</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                id="modulus"
                value={modulus}
                onChange={(e) => handleNumberChange(e, setModulus)}
                className={inputClasses}
                placeholder="Enter modulus"
              />
            </div>
          </>
        );
      case 'crt':
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="remainders" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Remainders (comma-separated)
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Example: 2,3,4</span>
              </label>
              <input
                type="text"
                id="remainders"
                value={remainders}
                onChange={(e) => handleCommaSeparatedChange(e, setRemainders)}
                className={inputClasses}
                placeholder="Enter remainders (e.g., 2,3,4)"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="moduli" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Moduli (comma-separated)
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Example: 3,5,7</span>
              </label>
              <input
                type="text"
                id="moduli"
                value={moduli}
                onChange={(e) => handleCommaSeparatedChange(e, setModuli)}
                className={inputClasses}
                placeholder="Enter moduli (e.g., 3,5,7)"
              />
            </div>
          </>
        );
      default:
        return (
          <div className="space-y-2">
            <label htmlFor="number" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Enter a number</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              id="number"
              value={number}
              onChange={(e) => handleNumberChange(e, setNumber)}
              className={inputClasses}
              placeholder="Enter a positive integer"
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700">
          <div className="bg-indigo-600 dark:bg-indigo-900 px-6 py-4 border-b-2 border-indigo-500 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Calculator className="text-indigo-100 h-8 w-8" />
              <h1 className="text-2xl font-bold text-white">Number Theory Calculator</h1>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex overflow-x-auto border-b-2 border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setResult(null);
                  setNumber('');
                  setExponent('');
                  setModulus('');
                  setRemainders('');
                  setModuli('');
                }}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {renderInputs()}
              <button
                onClick={handleCompute}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Calculate
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-700">
              <ResultDisplay result={result} />
            </div>

            <HistoryPanel 
              history={history} 
              onClearHistory={clearHistory} 
              onDeleteCalculation={deleteCalculation}
              isLoading={isLoading} 
            />

            <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Learn More</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {activeTab === 'prime' && "Prime factorization breaks down a number into its prime components. For example, 12 = 2² × 3"}
                {activeTab === 'totient' && "Euler's totient function counts numbers up to n that are coprime to n"}
                {activeTab === 'miller' && "Miller-Rabin is a probabilistic primality test - very accurate for large numbers"}
                {activeTab === 'fastexp' && "Fast exponentiation efficiently computes large powers using the square-and-multiply method"}
                {activeTab === 'crt' && "Chinese Remainder Theorem solves systems of linear congruences with coprime moduli"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;