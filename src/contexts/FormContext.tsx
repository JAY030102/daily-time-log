import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface FormState {
  date: string;
  morningIn: string;
  lunchOut: string;
  afternoonIn: string;
  eveningOut: string;
}

interface FormContextType {
  formData: FormState;
  setFormData: (data: FormState | ((prev: FormState) => FormState)) => void;
  updateField: (field: keyof FormState, value: string) => void;
  clearForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialFormState: FormState = {
  date: new Date().toISOString().split('T')[0],
  morningIn: '',
  lunchOut: '',
  afternoonIn: '',
  eveningOut: '',
};

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormDataState, clearStorage] = useLocalStorage<FormState>(
    'dtr-form-draft',
    initialFormState
  );

  const setFormData = (data: FormState | ((prev: FormState) => FormState)) => {
    if (typeof data === 'function') {
      setFormDataState((prev) => data(prev));
    } else {
      setFormDataState(data);
    }
  };

  const updateField = (field: keyof FormState, value: string) => {
    setFormDataState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearForm = () => {
    setFormDataState(initialFormState);
    clearStorage();
  };

  const value: FormContextType = {
    formData,
    setFormData,
    updateField,
    clearForm,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
