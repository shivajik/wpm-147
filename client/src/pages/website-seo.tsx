import { useParams } from "wouter";
import type { Website } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  RefreshCw, 
  TrendingUp,
  TrendingDown,
  Globe,
  FileText,
  Image,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  BarChart3,
  Link,
  Clock,
  Shield
} from "lucide-react";
import AppLayout from "@/components/layout/app-layout";
import { MaintenanceSidebar } from "@/components/maintenance/maintenance-sidebar";
import { useToast } from '@/hooks/use-toast';
import { apiCall } from '@/lib/queryClient';
import { useState } from "react";
import { SeoAnalysisProgress } from "@/components/seo/seo-analysis-progress";
import { ReportHistoryTable } from "@/components/seo/report-history-table";
import { DetailedSeoReport } from "@/components/seo/detailed-seo-report";
import { ProfessionalSeoReport } from "@/components/seo/professional-seo-report";

export default function WebsiteSEO() {
  const params = useParams();
  const websiteId = params.id;
  const { toast } = useToast();
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [latestReport, setLatestReport] = useState<any>(null);

  const { data: website, isLoading } = useQuery<Website>({
    queryKey: ['/api/websites', websiteId],
    enabled: !!websiteId,
  });

  // Fetch real SEO reports
  const { data: seoReports, isLoading: reportsLoading, refetch: refetchReports } = useQuery<any[]>({
    queryKey: ['/api/websites', websiteId, 'seo-reports'],
    enabled: !!websiteId,
  });

  // Get the latest report if available
  const realLatestReport = seoReports && Array.isArray(seoReports) && seoReports.length > 0 ? seoReports[0] : null;

  // Mock SEO data - in real implementation this would come from actual SEO analysis
  const seoData = {
    overall_score: 72,
    last_analysis: "2024-01-15T10:30:00Z",
    issues: {
      critical: 2,
      warnings: 5,
      notices: 3
    },
    keywords: [
      { keyword: "college admission", position: 3, change: +2, volume: 2400, difficulty: 65 },
      { keyword: "engineering college", position: 7, change: -1, volume: 1800, difficulty: 78 },
      { keyword: "education india", position: 12, change: 0, volume: 3200, difficulty: 45 },
      { keyword: "higher education", position: 15, change: +3, volume: 1500, difficulty: 52 }
    ],
    technical_seo: {
      page_speed: { score: 78, status: "good" },
      mobile_friendly: { score: 85, status: "excellent" },
      https_enabled: { score: 100, status: "excellent" },
      xml_sitemap: { score: 90, status: "excellent" },
      robots_txt: { score: 85, status: "excellent" },
      structured_data: { score: 45, status: "needs_work" }
    },
    content_analysis: {
      title_tags: { optimized: 12, missing: 2, duplicate: 1 },
      meta_descriptions: { optimized: 10, missing: 4, duplicate: 1 },
      headings: { proper_structure: 8, missing_h1: 2, multiple_h1: 0 },
      images: { with_alt: 15, missing_alt: 5, oversized: 3 }
    },
    backlinks: {
      total: 127,
      dofollow: 89,
      nofollow: 38,
      referring_domains: 45,
      domain_authority: 32
    }
  };

  const handleStartAnalysis = async () => {
    setIsRunningAnalysis(true);
    setShowProgressModal(true);
    
    try {
      const response = await apiCall('POST', `/api/websites/${websiteId}/seo-analysis`, {});
      
      // Poll for completion - the analysis runs asynchronously 
      const pollInterval = setInterval(async () => {
        try {
          await refetchReports();
          const updatedReports = await refetchReports();
          if (updatedReports.data && updatedReports.data.length > 0) {
            const latestReport = updatedReports.data[0];
            if (latestReport.scanStatus === 'completed') {
              clearInterval(pollInterval);
              setIsRunningAnalysis(false);
              setLatestReport(latestReport);
              
              toast({
                title: "SEO Analysis Completed",
                description: `Analysis completed with an overall score of ${latestReport.overallScore}/100`,
              });
              
              setTimeout(() => {
                setShowProgressModal(false);
              }, 2000);
            }
          }
        } catch (error) {
          console.error('Error polling for analysis completion:', error);
        }
      }, 3000);

      // Set timeout to stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isRunningAnalysis) {
          setIsRunningAnalysis(false);
          setShowProgressModal(false);
          toast({
            title: "Analysis Taking Longer",
            description: "The analysis is still running. Please check back in a few minutes.",
            variant: "default"
          });
        }
      }, 300000);
      
    } catch (error) {
      setIsRunningAnalysis(false);
      setShowProgressModal(false);
      toast({
        title: "Analysis Failed", 
        description: "Failed to start SEO analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAnalysisComplete = (report: any) => {
    setLatestReport(report);
    toast({
      title: "SEO Analysis Completed",
      description: `Analysis completed with an overall score of ${report.overallScore}`,
    });
    setTimeout(() => {
      setShowProgressModal(false);
    }, 2000);
  };

  const handleModalClose = () => {
    setShowProgressModal(false);
    setIsRunningAnalysis(false);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading SEO analysis data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!website) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Website not found.</p>
        </div>
      </AppLayout>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "excellent": return "text-green-600";
      case "good": return "text-yellow-600";
      case "needs_work": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "excellent": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "good": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "needs_work": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AppLayout title={`${website.name} - SEO Analysis`} defaultOpen={false}>
      <div className="flex gap-6">
        {/* Maintenance Sidebar */}
        {website && (
          <MaintenanceSidebar 
            websiteId={parseInt(websiteId!)}
            websiteName={website.name}
            websiteUrl={website.url}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Search className="h-6 w-6 text-indigo-600" />
                SEO Analysis
              </h1>
              <p className="text-muted-foreground mt-1">
                Search engine optimization insights and recommendations
              </p>
            </div>
            <Button 
              onClick={handleStartAnalysis}
              disabled={showProgressModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              New SEO Analysis
            </Button>
          </div>

          {/* Professional SEO Report - Show if real analysis is available */}
          {realLatestReport && realLatestReport.scanStatus === 'completed' && (
            <div className="mb-8">
              <ProfessionalSeoReport
                report={realLatestReport}
                websiteName={website.name}
                websiteUrl={website.url}
              />
            </div>
          )}

          {/* SEO Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  SEO Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(latestReport?.overallScore || seoData.overall_score)}`}>
                    {latestReport?.overallScore || seoData.overall_score}
                  </div>
                  <Progress value={latestReport?.overallScore || seoData.overall_score} className="mt-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Last analysis: {latestReport ? new Date(latestReport.generatedAt).toLocaleDateString() : new Date(seoData.last_analysis).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{latestReport?.issues?.critical || seoData.issues.critical}</div>
                <p className="text-sm text-muted-foreground">Need immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{latestReport?.issues?.warnings || seoData.issues.warnings}</div>
                <p className="text-sm text-muted-foreground">Should be addressed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Notices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{seoData.issues.notices}</div>
                <p className="text-sm text-muted-foreground">Optimization opportunities</p>
              </CardContent>
            </Card>
          </div>

          {/* SEO Analysis Tabs */}
          <Tabs defaultValue="rankings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rankings">Keyword Rankings</TabsTrigger>
              <TabsTrigger value="technical">Technical SEO</TabsTrigger>
              <TabsTrigger value="content">Content Analysis</TabsTrigger>
              <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
            </TabsList>

            <TabsContent value="rankings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Keyword Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(seoData.keywords) && seoData.keywords.map((keyword: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold">#{keyword.position}</div>
                          <div>
                            <h4 className="font-medium">{keyword.keyword}</h4>
                            <p className="text-sm text-muted-foreground">
                              Volume: {keyword.volume.toLocaleString()} • Difficulty: {keyword.difficulty}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {keyword.change > 0 ? (
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              +{keyword.change}
                            </div>
                          ) : keyword.change < 0 ? (
                            <div className="flex items-center text-red-600">
                              <TrendingDown className="h-4 w-4 mr-1" />
                              {keyword.change}
                            </div>
                          ) : (
                            <div className="text-gray-500">-</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Technical SEO Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {seoData.technical_seo && Object.entries(seoData.technical_seo || {}).map(([key, data]: [string, any]) => (
                      <div key={key} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          {getStatusIcon(data.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">{data.score}</span>
                          <Badge variant={
                            data.status === 'excellent' ? 'default' :
                            data.status === 'good' ? 'secondary' : 'destructive'
                          }>
                            {data.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Meta Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Title Tags</span>
                        <div className="flex gap-2">
                          <Badge variant="default">{seoData.content_analysis.title_tags.optimized} good</Badge>
                          <Badge variant="destructive">{seoData.content_analysis.title_tags.missing} missing</Badge>
                          <Badge variant="secondary">{seoData.content_analysis.title_tags.duplicate} duplicate</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Meta Descriptions</span>
                        <div className="flex gap-2">
                          <Badge variant="default">{seoData.content_analysis.meta_descriptions.optimized} good</Badge>
                          <Badge variant="destructive">{seoData.content_analysis.meta_descriptions.missing} missing</Badge>
                          <Badge variant="secondary">{seoData.content_analysis.meta_descriptions.duplicate} duplicate</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Content Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Headings Structure</span>
                        <div className="flex gap-2">
                          <Badge variant="default">{seoData.content_analysis.headings.proper_structure} good</Badge>
                          <Badge variant="destructive">{seoData.content_analysis.headings.missing_h1} missing H1</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Images</span>
                        <div className="flex gap-2">
                          <Badge variant="default">{seoData.content_analysis.images.with_alt} with alt</Badge>
                          <Badge variant="destructive">{seoData.content_analysis.images.missing_alt} missing alt</Badge>
                          <Badge variant="secondary">{seoData.content_analysis.images.oversized} oversized</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="backlinks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Backlink Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{seoData.backlinks.total}</div>
                      <p className="text-sm text-muted-foreground">Total Backlinks</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{seoData.backlinks.dofollow}</div>
                      <p className="text-sm text-muted-foreground">DoFollow</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{seoData.backlinks.nofollow}</div>
                      <p className="text-sm text-muted-foreground">NoFollow</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{seoData.backlinks.referring_domains}</div>
                      <p className="text-sm text-muted-foreground">Referring Domains</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{seoData.backlinks.domain_authority}</div>
                      <p className="text-sm text-muted-foreground">Domain Authority</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Report History Section */}
          <div className="mt-8">
            <ReportHistoryTable 
              websiteId={websiteId!}
              websiteName={website?.name || "Website"}
            />
          </div>
        </div>
      </div>

      {/* SEO Analysis Progress Modal */}
      <SeoAnalysisProgress
        isOpen={showProgressModal}
        onClose={handleModalClose}
        websiteId={websiteId!}
        websiteName={website?.name || "Website"}
        onComplete={handleAnalysisComplete}
      />
    </AppLayout>
  );
}