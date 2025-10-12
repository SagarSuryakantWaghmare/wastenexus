import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal | WasteNexus',
  description: 'Administrative dashboard for comprehensive system management and analytics',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}