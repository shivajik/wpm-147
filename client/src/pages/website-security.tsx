import { useParams } from "wouter";
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/app-layout';
import { MaintenanceSidebar } from '@/components/maintenance/maintenance-sidebar';
import { SecurityScan } from '@/components/security/security-scan-new';
import type { Website } from '@shared/schema';

export default function WebsiteSecurityPage() {
  const { id } = useParams<{ id: string }>();
  const websiteId = parseInt(id || '0');

  const { data: website } = useQuery<Website>({
    queryKey: ['/api/websites', id],
    enabled: !!id,
  });

  return (
    <AppLayout defaultOpen={false}>
      <div className="flex gap-6">
        {/* Left Sidebar - Maintenance Sidebar */}
        <MaintenanceSidebar 
          websiteId={websiteId}
          websiteName={website?.name || 'Loading...'}
          websiteUrl={website?.url || ''}
        />

        {/* Main Content - Security Scan */}
        <div className="flex-1">
          <SecurityScan websiteId={websiteId} />
        </div>
      </div>
    </AppLayout>
  );
}