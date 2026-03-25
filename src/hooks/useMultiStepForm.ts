import { useState, useCallback, ChangeEvent } from 'react';

export interface Step {
  key: string;
  question: string;
  type?: 'input' | 'options';
  options?: string[];
  placeholder?: string;
  validate?: (value: string) => string | null;
  mask?: (value: string) => string;
}

export function useMultiStepForm<T extends Record<string, any>>(
  steps: Step[],
  onComplete?: (data: T) => void
) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<T>({} as T);
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [validationTimeout, setValidationTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const currentStep = steps[step];

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (currentStep?.mask) {
      value = currentStep.mask(value);
    }
    setInputValue(value);
    
    if (error) setError(null);
    setIsValid(false);
    
    if (validationTimeout) clearTimeout(validationTimeout);
    
    if (value.trim().length > 0) {
      setIsValidating(true);
      const timeout = setTimeout(() => {
        setIsValidating(false);
        const validationError = currentStep?.validate ? currentStep.validate(value) : null;
        setIsValid(!validationError);
      }, 400);
      setValidationTimeout(timeout);
    } else {
      setIsValidating(false);
      setIsValid(false);
    }
  }, [currentStep, error, validationTimeout]);

  const handleNext = useCallback((value: string) => {
    const validationError = currentStep?.validate ? currentStep.validate(value) : null;
    if (validationError) {
      setError(validationError);
      return;
    }

    const newData = { ...data, [currentStep.key]: value };
    setData(newData);
    setInputValue("");
    setError(null);
    setIsValid(false);
    setIsValidating(false);
    if (validationTimeout) clearTimeout(validationTimeout);
    
    if (step === steps.length - 1) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep(step + 1);
        if (onComplete) onComplete(newData);
      }, 2500);
    } else {
      setStep(step + 1);
    }
  }, [currentStep, data, step, steps.length, validationTimeout, onComplete]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      const prevStepIndex = step - 1;
      const prevStep = steps[prevStepIndex];
      setStep(prevStepIndex);
      setInputValue(data[prevStep.key] || "");
      setError(null);
      setIsValid(false);
      setIsValidating(false);
    }
  }, [step, data, steps]);

  return {
    step,
    currentStep,
    data,
    inputValue,
    isAnalyzing,
    error,
    isValidating,
    isValid,
    handleInputChange,
    handleNext,
    handleBack,
    isFirstStep: step === 0,
    isLastStep: step === steps.length - 1,
    isCompleted: step === steps.length,
    totalSteps: steps.length
  };
}
