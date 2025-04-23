import React, { useEffect, useState } from 'react';
import Results from '../components/Results';
import { Button } from '@swc-react/button';
import { DocumentSandboxApi } from '../../models/DocumentSandboxApi';

type ResultsPageProps = {
  sandboxProxy: DocumentSandboxApi;
  rows: number;
  columns: number;
  onBackClick: () => void; // Callback to navigate back to AddTable page
  onResetClick: () => void; // Callback to reset the app state
};

const ResultsPage: React.FC<ResultsPageProps> = ({ 
  sandboxProxy, 
  rows, 
  columns, 
  onBackClick,
  onResetClick 
}) => {
  // Add state to track if table exists
  const [tableExists, setTableExists] = useState<boolean>(true);
  const [checkingTable, setCheckingTable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if the table still exists when component mounts
  useEffect(() => {
    const verifyTableExists = async () => {
      setCheckingTable(true);
      try {
        // Try to select the entire table to verify it exists
        const tableSelected = await sandboxProxy.selectEntireTable();
        setTableExists(tableSelected);
        
        if (!tableSelected) {
          setErrorMessage("The table appears to have been deleted from the document.");
          // Auto-redirect after a short delay
          setTimeout(() => {
            onBackClick();
          }, 3000);
        }
      } catch (error) {
        console.error("Error verifying table existence:", error);
        setTableExists(false);
        setErrorMessage("The table appears to have been deleted from the document.");
        // Auto-redirect after a short delay
        setTimeout(() => {
          onBackClick();
        }, 3000);
      } finally {
        setCheckingTable(false);
      }
    };

    verifyTableExists();
  }, [sandboxProxy, onBackClick]);

  return (
    <div className='results-page' style={{ maxWidth: '250px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Table Results</h2>
        <Button variant="secondary" onClick={onBackClick}>
          Back
        </Button>
      </div>
      
      {checkingTable ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Checking table status...
        </div>
      ) : tableExists ? (
        // Results component with table selection tools
        <Results 
          sandboxProxy={sandboxProxy} 
          rows={rows} 
          columns={columns} 
          generated={true} 
        />
      ) : (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#FFF4F4', 
          border: '1px solid #FFCDD2',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          <h3 style={{ color: '#D32F2F', margin: '0 0 8px 0' }}>Table Not Found</h3>
          <p>{errorMessage}</p>
          <p>Redirecting to the data tab...</p>
        </div>
      )}
      
      <div style={{ marginTop: '16px' }}>
        <Button variant='primary' treatment='outline' onClick={onResetClick} style={{ width: '100%' }}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;