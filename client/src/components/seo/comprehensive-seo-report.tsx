import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Globe,
  Smartphone,
  Clock,
  Search,
  FileText,
  Image,
  Link2,
  Target,
  BarChart3,
  TrendingUp,
  Eye,
  Accessibility,
  Share2,
  Download,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  Users,
  Code,
  Zap,
  BookOpen,
  Settings
} from "lucide-react";
import { useState } from "react";

interface ComprehensiveSeoReportProps {
  report: any;
  websiteName: string;
  websiteUrl: string;
}

export function ComprehensiveSeoReport({ report, websiteName, websiteUrl }: ComprehensiveSeoReportProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'critical': return "text-red-600 bg-red-50 border-red-200";
      case 'high': return "text-orange-600 bg-orange-50 border-orange-200";
      case 'medium': return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case 'low': return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch(impact) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Extract detailed findings from report data
  const detailedFindings = report.reportData?.detailedFindings || {
    criticalIssues: [],
    warnings: [],
    recommendations: [],
    positiveFindings: []
  };

  const technicalData = report.reportData || {};

  const renderFindingCard = (finding: any, index: number) => (
    <Card key={index} className={`border-l-4 ${getImpactColor(finding.impact)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getImpactIcon(finding.impact)}
            <div>
              <CardTitle className="text-base font-semibold">{finding.title}</CardTitle>
              <Badge variant="outline" className="mt-1 text-xs">
                {finding.category}
              </Badge>
            </div>
          </div>
          <Badge className={getImpactColor(finding.impact)}>
            {finding.impact.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{finding.description}</p>
        
        {finding.technicalDetails && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Technical Details:</p>
            <code className="text-xs text-gray-800 dark:text-gray-200">{finding.technicalDetails}</code>
          </div>
        )}

        {finding.recommendation && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Recommendation:</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">{finding.recommendation}</p>
            </div>
          </div>
        )}

        {finding.howToFix && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto font-normal">
                <Settings className="h-3 w-3 mr-1" />
                How to Fix
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                <p className="text-xs text-green-800 dark:text-green-200">{finding.howToFix}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {finding.resources && finding.resources.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Resources:</p>
            <div className="flex flex-wrap gap-1">
              {finding.resources.map((resource: string, idx: number) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  asChild
                >
                  <a href={resource} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Learn More
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 bg-white dark:bg-gray-900" data-testid="comprehensive-seo-report">
      {/* Report Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-3xl font-bold">Comprehensive SEO Analysis Report</CardTitle>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{websiteName}</h2>
            <p className="text-blue-600 flex items-center justify-center gap-1">
              <Globe className="h-4 w-4" />
              {websiteUrl}
            </p>
            <p className="text-sm text-muted-foreground">Generated on {formatDate(report.generatedAt)}</p>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(report.overallScore)}`}>
                {report.overallScore}/100
              </div>
              <p className="text-sm text-muted-foreground mb-3">Overall SEO Score</p>
              <Progress value={report.overallScore} className="h-3" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Critical Issues</span>
                </div>
                <Badge variant="destructive">{detailedFindings.criticalIssues.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">High Priority</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">{detailedFindings.warnings.length}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Warnings</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">{detailedFindings.recommendations.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Passed</span>
                </div>
                <Badge className="bg-green-100 text-green-800">{detailedFindings.positiveFindings.length}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Technical SEO</span>
                <div className="flex items-center gap-2">
                  <Progress value={report.metrics?.technicalSeo || 0} className="w-16 h-2" />
                  <span className="text-sm font-medium">{report.metrics?.technicalSeo || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Content Quality</span>
                <div className="flex items-center gap-2">
                  <Progress value={report.metrics?.contentQuality || 0} className="w-16 h-2" />
                  <span className="text-sm font-medium">{report.metrics?.contentQuality || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Experience</span>
                <div className="flex items-center gap-2">
                  <Progress value={report.metrics?.userExperience || 0} className="w-16 h-2" />
                  <span className="text-sm font-medium">{report.metrics?.userExperience || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Findings */}
      <Tabs defaultValue="critical" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="critical" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Critical ({detailedFindings.criticalIssues.length})
          </TabsTrigger>
          <TabsTrigger value="warnings" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Warnings ({detailedFindings.warnings.length})
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Opportunities ({detailedFindings.recommendations.length})
          </TabsTrigger>
          <TabsTrigger value="positive" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Passed ({detailedFindings.positiveFindings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="critical" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold">Critical Issues Requiring Immediate Attention</h3>
          </div>
          {detailedFindings.criticalIssues.length > 0 ? (
            <div className="space-y-4">
              {detailedFindings.criticalIssues.map((finding: any, index: number) => 
                renderFindingCard(finding, index)
              )}
            </div>
          ) : (
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="flex items-center gap-2 p-6">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800 dark:text-green-200">No critical issues found! Your website follows essential SEO best practices.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="warnings" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">High Priority Issues</h3>
          </div>
          {detailedFindings.warnings.length > 0 ? (
            <div className="space-y-4">
              {detailedFindings.warnings.map((finding: any, index: number) => 
                renderFindingCard(finding, index)
              )}
            </div>
          ) : (
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="flex items-center gap-2 p-6">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800 dark:text-green-200">No high priority warnings found!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Optimization Opportunities</h3>
          </div>
          {detailedFindings.recommendations.length > 0 ? (
            <div className="space-y-4">
              {detailedFindings.recommendations.map((finding: any, index: number) => 
                renderFindingCard(finding, index)
              )}
            </div>
          ) : (
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="flex items-center gap-2 p-6">
                <Info className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800 dark:text-blue-200">All optimization opportunities have been addressed!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="positive" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">SEO Best Practices Implemented</h3>
          </div>
          {detailedFindings.positiveFindings.length > 0 ? (
            <div className="space-y-4">
              {detailedFindings.positiveFindings.map((finding: any, index: number) => 
                renderFindingCard(finding, index)
              )}
            </div>
          ) : (
            <Card className="border-gray-200 bg-gray-50 dark:bg-gray-900/20">
              <CardContent className="flex items-center gap-2 p-6">
                <Info className="h-5 w-5 text-gray-600" />
                <p className="text-gray-800 dark:text-gray-200">Complete the critical and high priority fixes to see positive findings here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Technical Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Technical Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Security & Protocol</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>SSL: {technicalData.technicalSeo?.hasSSL ? '✓ Enabled' : '✗ Disabled'}</p>
                <p>Protocol: {technicalData.technicalSeo?.hasSSL ? 'HTTPS' : 'HTTP'}</p>
                <p>Status: {technicalData.technicalSeo?.statusCode || 'Unknown'}</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">Crawlability</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Robots.txt: {technicalData.technicalSeo?.hasRobotsTxt ? '✓ Found' : '✗ Missing'}</p>
                <p>Sitemap: {technicalData.technicalSeo?.hasSitemap ? '✓ Found' : '✗ Missing'}</p>
                <p>Mobile: {technicalData.technicalSeo?.isResponsive ? '✓ Responsive' : '✗ Not Responsive'}</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-sm">Performance</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Response: {technicalData.technicalSeo?.responseTime || 0}ms</p>
                <p>Size: {technicalData.performance?.pageSize || 0}KB</p>
                <p>Requests: {technicalData.performance?.requests || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}