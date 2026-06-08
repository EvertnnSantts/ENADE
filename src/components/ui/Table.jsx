import React from 'react';
import './Table.css';

export default function Table({ 
  headers = [], 
  children, 
  className = '', 
  emptyMessage = 'Nenhum dado encontrado',
  isEmpty = false,
  ...props 
}) {
  return (
    <div className={`table-container ${className}`} {...props}>
      <table className="custom-table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                style={header.width ? { width: header.width } : {}}
                className={header.align ? `text-${header.align}` : ''}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="table-empty-state">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
