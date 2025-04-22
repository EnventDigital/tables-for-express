import React from 'react';
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
  return (
    <div className='results-page' style={{ maxWidth: '250px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Table Results</h2>
        <Button variant="secondary" onClick={onBackClick}>
          Back
        </Button>
      </div>
      
      {/* Results component with table selection tools */}
      <Results 
        sandboxProxy={sandboxProxy} 
        rows={rows} 
        columns={columns} 
        generated={true} 
      />
      
      <div style={{ marginTop: '16px' }}>
        <Button variant='primary' treatment='outline' onClick={onResetClick} style={{ width: '100%' }}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;