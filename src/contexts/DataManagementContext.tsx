import React, { createContext, useContext, ReactNode } from 'react';
import { useApp } from './AppContext';

interface DataManagementContextType {
  saveProgress: () => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  backupToCloud: () => void;
}

const DataManagementContext = createContext<DataManagementContextType | null>(null);

export const DataManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, dispatch } = useApp();

  const saveProgress = () => {
    try {
      const dataToSave = {
        user: state.user,
        approvals: state.approvals,
        events: state.events,
        schemes: state.schemes,
        chatHistory: state.chatHistory,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('launchmate_full_backup', JSON.stringify(dataToSave));
      
      // Show success notification
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Progress saved successfully!', type: 'success' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Failed to save progress', type: 'error' }
      });
      window.dispatchEvent(event);
    }
  };

  const exportData = () => {
    try {
      const dataToExport = {
        user: state.user,
        approvals: state.approvals,
        events: state.events,
        schemes: state.schemes,
        chatHistory: state.chatHistory,
        exportDate: new Date().toISOString(),
        version: '1.0',
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `launchmate-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const event = new CustomEvent('show-toast', {
        detail: { message: 'Data exported successfully!', type: 'success' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Failed to export data', type: 'error' }
      });
      window.dispatchEvent(event);
    }
  };

  const importData = async (file: File): Promise<void> => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      // Validate the data structure
      if (!importedData.version) {
        throw new Error('Invalid data format');
      }

      // Update the app state
      if (importedData.user) {
        dispatch({ type: 'SET_USER', payload: importedData.user });
      }
      if (importedData.approvals) {
        dispatch({ type: 'SET_APPROVALS', payload: importedData.approvals });
      }
      if (importedData.schemes) {
        dispatch({ type: 'SET_SCHEMES', payload: importedData.schemes });
      }
      if (importedData.chatHistory) {
        // Clear existing chat and add imported messages
        importedData.chatHistory.forEach((message: any) => {
          dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
        });
      }
      if (importedData.events) {
        importedData.events.forEach((event: any) => {
          dispatch({ type: 'ADD_EVENT', payload: event });
        });
      }

      const event = new CustomEvent('show-toast', {
        detail: { message: 'Data imported successfully!', type: 'success' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Failed to import data. Please check the file format.', type: 'error' }
      });
      window.dispatchEvent(event);
    }
  };

  const backupToCloud = () => {
    const event = new CustomEvent('show-toast', {
      detail: { message: 'Cloud backup coming soon! 🚀', type: 'info' }
    });
    window.dispatchEvent(event);
  };

  return (
    <DataManagementContext.Provider value={{
      saveProgress,
      exportData,
      importData,
      backupToCloud,
    }}>
      {children}
    </DataManagementContext.Provider>
  );
};

export const useDataManagement = () => {
  const context = useContext(DataManagementContext);
  if (!context) {
    throw new Error('useDataManagement must be used within a DataManagementProvider');
  }
  return context;
};