import AdminSidebar from '@/components/admin/AdminSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row bg-paperdim min-h-screen font-body">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  );
}
