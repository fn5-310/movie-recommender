import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './server';

beforeAll(() => {
    vi.stubEnv("VITE_MOVIE_API_KEY", "test-key")
    server.listen()
});
afterEach(() => server.resetHandlers());
afterAll(() => {
    vi.unstubAllEnvs();
    server.close()
});