import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn()
      }
    }
  };

  return {
    create: jest.fn(() => instance)
  };
});

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
  Polyline: () => null
}));

jest.mock('leaflet', () => {
  const markerPrototype = { options: {} };

  return {
    icon: jest.fn(() => ({})),
    Marker: {
      prototype: markerPrototype
    }
  };
});

test('renders the admin login screen when unauthenticated', () => {
  localStorage.clear();

  render(<App />);

  expect(screen.getByRole('heading', { name: /CleanSL Admin/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Login to Dashboard/i })).toBeInTheDocument();
});
