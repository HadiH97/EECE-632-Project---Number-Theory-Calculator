import { useState, useEffect } from 'react';
import { Calculation, getRecentCalculations, saveCalculation, clearHistory, deleteCalculation } from '../db/database';

export const useCalculationHistory = () => {
  const [history, setHistory] = useState<Calculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const calculations = await getRecentCalculations();
      setHistory(calculations.reverse());
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const addCalculation = async (operation: string, input: string, result: string) => {
    try {
      await saveCalculation(operation, input, result);
      await loadHistory();
    } catch (error) {
      console.error('Failed to save calculation:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleDeleteCalculation = async (id: number) => {
    try {
      await deleteCalculation(id);
      await loadHistory();
    } catch (error) {
      console.error('Failed to delete calculation:', error);
    }
  };

  return {
    history,
    isLoading,
    addCalculation,
    clearHistory: handleClearHistory,
    deleteCalculation: handleDeleteCalculation
  };
};