import React, { useState } from 'react';
import { Button } from '@swc-react/button';
import { Picker } from '@swc-react/picker';
import { Divider } from '@swc-react/divider';
import { DocumentSandboxApi } from '../../models/DocumentSandboxApi';
import '@spectrum-web-components/menu/sp-menu-item.js';
import { MenuItem } from '@swc-react/menu';

// Styles for our replacement components
const styles = {
  flexColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spectrum-global-dimension-size-200)'
  },
  flexAlignCenter: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    height: 'var(--spectrum-global-dimension-size-5000)'
  },
  heading4: {
    fontSize: 'var(--spectrum-heading-4-text-size)',
    fontWeight: 'var(--spectrum-heading-4-text-font-weight)',
    marginBottom: 'var(--spectrum-heading-4-margin-bottom)'
  },
  heading5: {
    fontSize: 'var(--spectrum-heading-5-text-size)',
    fontWeight: 'var(--spectrum-heading-5-text-font-weight)',
    marginBottom: 'var(--spectrum-heading-5-margin-bottom)'
  },
  smallGap: {
    gap: 'var(--spectrum-global-dimension-size-100)'
  },
  container: {
    padding: 'var(--spectrum-global-dimension-size-200)'
  }
};

interface ResultsProps {
  sandboxProxy: DocumentSandboxApi;
  rows: number;
  columns: number;
  generated: boolean;
}

const Results: React.FC<ResultsProps> = ({ sandboxProxy, rows, columns, generated }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [selectionStatus, setSelectionStatus] = useState<string>('');

  // Generate options for row and column pickers
  const rowOptions = Array.from({ length: rows }, (_, i) => ({
    label: `Row ${i + 1}`,
    value: `${i + 1}`
  }));

  const columnOptions = Array.from({ length: columns }, (_, i) => ({
    label: `Column ${i + 1}`,
    value: `${i + 1}`
  }));

  const handleRowSelect = async (event: any) => {
    // Debug logging to inspect the event object
    console.log('Row Select Event:', event);
    console.log('Event type:', event.type);
    console.log('Event target:', event.target);
    console.log('Event currentTarget:', event.currentTarget);
    
    if (event.target) {
      console.log('Target value:', event.target.value);
      console.log('Target selected:', event.target.selected);
    }
    
    // Try different ways to access the value
    if (event.detail) {
      console.log('Event detail:', event.detail);
    }
    
    // Try with React Spectrum patterns
    if (event.target && event.target.value !== undefined) {
      const rowIndex = parseInt(event.target.value);
      if (!isNaN(rowIndex)) {
        setSelectedRow(rowIndex);
        try {
          await sandboxProxy.selectTableRow(rowIndex - 1); // Convert to 0-indexed
          setSelectionStatus(`Selected row ${rowIndex}`);
        } catch (error) {
          console.error('Error selecting row:', error);
          setSelectionStatus(`Failed to select row: ${error.message}`);
        }
      }
    }
  };

  const handleColumnSelect = async (event: any) => {
    // Debug logging to inspect the event object
    console.log('Column Select Event:', event);
    console.log('Event type:', event.type);
    console.log('Event target:', event.target);
    console.log('Event currentTarget:', event.currentTarget);
    
    if (event.target) {
      console.log('Target value:', event.target.value);
      console.log('Target selected:', event.target.selected);
    }
    
    // Try different ways to access the value
    if (event.detail) {
      console.log('Event detail:', event.detail);
    }
    
    // Try with React Spectrum patterns
    if (event.target && event.target.value !== undefined) {
      const columnIndex = parseInt(event.target.value);
      if (!isNaN(columnIndex)) {
        setSelectedColumn(columnIndex);
        try {
          await sandboxProxy.selectTableColumn(columnIndex - 1); // Convert to 0-indexed
          setSelectionStatus(`Selected column ${columnIndex}`);
        } catch (error) {
          console.error('Error selecting column:', error);
          setSelectionStatus(`Failed to select column: ${error.message}`);
        }
      }
    }
  };

  const handleSelectAll = async () => {
    try {
      await sandboxProxy.selectEntireTable();
      setSelectionStatus('Selected entire table');
    } catch (error) {
      console.error('Error selecting all:', error);
      setSelectionStatus(`Failed to select all: ${error.message}`);
    }
  };

  const handleClearSelection = async () => {
    try {
      await sandboxProxy.clearTableSelection();
      setSelectedRow(null);
      setSelectedColumn(null);
      setSelectionStatus('Selection cleared');
    } catch (error) {
      console.error('Error clearing selection:', error);
      setSelectionStatus(`Failed to clear selection: ${error.message}`);
    }
  };

  if (!generated) {
    return (
      <div style={styles.flexAlignCenter}>
        <h4 style={styles.heading4}>Generate a table first to see results</h4>
      </div>
    );
  }

  return (
    <div style={{...styles.flexColumn, ...styles.container}}>
      <h4 style={styles.heading4}>Select Table Elements</h4>
      
      <div style={{...styles.flexColumn, ...styles.smallGap}}>
        <h5 style={styles.heading5}>Row Selection</h5>
        <Picker 
          label="Select Row" 
          placeholder="Choose a row to select" 
          change={handleRowSelect}
          value={selectedRow ? String(selectedRow) : ''}
        >
          {rowOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Picker>
      </div>

      <div style={{...styles.flexColumn, ...styles.smallGap}}>
        <h5 style={styles.heading5}>Column Selection</h5>
        <Picker 
          label="Select Column" 
          placeholder="Choose a column to select" 
          change={handleColumnSelect}
          value={selectedColumn ? String(selectedColumn) : ''}
        >
          {columnOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Picker>
      </div>

      <Divider size="s" />

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 'var(--spectrum-global-dimension-size-100)'
      }}>
        <Button variant="primary" onClick={handleSelectAll}>Select All</Button>
        <Button variant="secondary" onClick={handleClearSelection}>Clear Selection</Button>
      </div>

      {selectionStatus && (
        <div style={{...styles.flexColumn, ...styles.smallGap}}>
          <Divider size="s" />
          <h5 style={styles.heading5}>Status</h5>
          <div>{selectionStatus}</div>
        </div>
      )}
    </div>
  );
};

export default Results;