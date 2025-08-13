import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { ComprehensiveSeoReport } from "@/components/seo/comprehensive-seo-report";
import type { SeoReport, SeoMetrics, SeoPageAnalysis, SeoKeywords } from "@shared/schema";

type SeoReportWithDetails = SeoReport & {
  metrics?: SeoMetrics;
  pageAnalysis?: SeoPageAnalysis[];
  keywords?: SeoKeywords[];
};

export default function SeoReportPage() {
  const params = useParams();
  const reportId = params.id;

  const { data: report, isLoading, error } = useQuery<SeoReportWithDetails>({
    queryKey: ['/api/seo-reports', reportId],
    enabled: !!reportId,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Convert report to PDF or export functionality
    // This would need additional implementation
    console.log('Download report functionality to be implemented');
  };

  const handleClose = () => {
    window.close();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading SEO report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Report Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The requested SEO report could not be found or has been deleted.
            </p>
            <Button onClick={handleClose} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get website info from report
  const reportData = report.reportData as any;
  const websiteName = reportData?.websiteName || reportData?.url || 'Website';
  const websiteUrl = reportData?.url || '#';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with actions - hidden in print */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              SEO Analysis Report
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {websiteName} • Generated on {new Date(report.generatedAt || report.createdAt || new Date()).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            <Button onClick={handleClose} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6 print:p-0">
        <ComprehensiveSeoReport 
          report={report}
          websiteName={websiteName}
          websiteUrl={websiteUrl}
        />
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          body {
            background: white !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}