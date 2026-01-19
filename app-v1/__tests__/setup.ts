import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn().mockImplementation((target, vars) => {
        if (vars.onComplete) vars.onComplete();
        return { kill: vi.fn() };
    }),
    fromTo: vi.fn().mockReturnValue({ kill: vi.fn() }),
    timeline: vi.fn().mockReturnValue({
        to: vi.fn(),
        fromTo: vi.fn(),
        play: vi.fn(),
    }),
    registerPlugin: vi.fn(),
  },
}));

vi.mock('@gsap/react', () => ({
  useGSAP: (callback: any) => callback(),
}));

// Mock window methods
window.scrollTo = vi.fn();
window.open = vi.fn().mockReturnValue({
    document: {
        write: vi.fn(),
    },
    location: {
        href: '',
    },
    close: vi.fn(),
});
