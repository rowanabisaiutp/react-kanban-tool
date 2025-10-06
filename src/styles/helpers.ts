import { css } from 'styled-components';

// Helper para estados disabled
export const disabled = css`
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;