import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Government Portal | WasteNexus',
  description: 'City administration and policy management dashboard for environmental sustainability',
};

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}