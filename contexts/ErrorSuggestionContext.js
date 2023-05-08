import React, { createContext, useState } from 'react';

const ErrorSuggestionContext = createContext();

export const ErrorSuggestionProvider = ({ children }) => {
  const [errorSuggestions, setErrorSuggestions] = useState([]);

  return (
    <ErrorSuggestionContext.Provider value={{ errorSuggestions, setErrorSuggestions }}>
      {children}
    </ErrorSuggestionContext.Provider>
  );
};

export default ErrorSuggestionContext;