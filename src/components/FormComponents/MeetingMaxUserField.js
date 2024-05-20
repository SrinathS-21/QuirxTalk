import React from 'react';
import { EuiFormRow, EuiFieldNumber } from '@elastic/eui';

export default function MeetingMaxUserField({ value, setSize }) {
  return (
    <EuiFormRow label="Maximum People">
      <EuiFieldNumber
        min={1}
        max={50}
        placeholder="Maximum People"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          if (!isNaN(newValue)) {
            if (newValue === 0) setSize(1);
            else if (newValue > 50) setSize(50);
            else setSize(newValue);
          }
        }}
      />
    </EuiFormRow>
  );
}
