import React from 'react';
import AppNavigator from './AppNavigator';
import { ErrorSuggestionProvider } from './contexts/ErrorSuggestionContext';

const App = () => {
  return (
    <AppNavigator />
  );
};

export default App;