import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create the mock server using your defined handlers
export const server = setupServer(...handlers);