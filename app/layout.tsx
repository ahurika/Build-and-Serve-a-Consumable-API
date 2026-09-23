import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Consumable API - Consumer',
  description: 'Minimal consumer application for the public REST API.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
