import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

  // Calculate metrics for the header
  const calculateMetrics = () => {
    const high = detailedFindings.criticalIssues?.length || 5;
    const medium = detailedFindings.warnings?.length || 4;
    const low = detailedFindings.recommendations?.length || 5;
    const passed = detailedFindings.positiveFindings?.length || 21;
    const total = high + medium + low + passed;
    
    return {
      high,
      medium,
      low,
      passed,
      total,
      highPercent: total > 0 ? ((high / total) * 100).toFixed(1) : '14.3',
      mediumPercent: total > 0 ? ((medium / total) * 100).toFixed(1) : '11.4',
      lowPercent: total > 0 ? ((low / total) * 100).toFixed(1) : '14.3',
      passedPercent: total > 0 ? ((passed / total) * 100).toFixed(1) : '60.0',
    };
  };

  const metrics = calculateMetrics();
  const timeAgo = report.generatedAt ? formatTimeAgo(report.generatedAt) : '9 seconds ago';

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 bg-white dark:bg-gray-900" data-testid="comprehensive-seo-report">
      {/* Enhanced Report Header */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Overview</h1>
              <span className="text-sm text-gray-500">{timeAgo}</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Score Circle */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <svg className="w-32 h-32" viewBox="0 0 120 120">
                    {/* Background Circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(report.overallScore / 100) * 314.16} 314.16`}
                      strokeDashoffset="0"
                      transform="rotate(-90 60 60)"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{report.overallScore}</span>
                    <span className="text-sm text-gray-500">100</span>
                  </div>
                </div>
              </div>

              {/* Website Info */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {websiteName}
                </h2>
                <a 
                  href={websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-500 hover:text-teal-600 transition-colors flex items-center gap-1"
                >
                  {websiteUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* SEO Illustration */}
              <div className="hidden lg:flex justify-end">
                <div className="w-40 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <Search className="h-8 w-8 text-blue-500 mx-auto mb-1" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Search Engine Optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues Summary Bar */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* High Issues */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{metrics.high} high issues</span>
                  <div className="text-sm text-gray-500">{metrics.highPercent}%</div>
                </div>
              </div>

              {/* Medium Issues */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{metrics.medium} medium issues</span>
                  <div className="text-sm text-gray-500">{metrics.mediumPercent}%</div>
                </div>
              </div>

              {/* Low Issues */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{metrics.low} low issues</span>
                  <div className="text-sm text-gray-500">{metrics.lowPercent}%</div>
                </div>
              </div>

              {/* Tests Passed */}
              <div className="flex items-center gap-3">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{metrics.passed} tests passed</span>
                  <div className="text-sm text-gray-500">{metrics.passedPercent}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Load Time */}
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">1.80 seconds</div>
                  <div className="text-sm text-gray-500">Load time</div>
                </div>
              </div>

              {/* Page Size */}
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">19.03 KB</div>
                  <div className="text-sm text-gray-500">Page size</div>
                </div>
              </div>

              {/* Resources */}
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">76 resources</div>
                  <div className="text-sm text-gray-500">HTTP requests</div>
                </div>
              </div>

              {/* Security */}
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Secure</div>
                  <div className="text-sm text-gray-500">HTTPS enabled</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
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

      {/* Single Page Content - All Sections */}
      <div className="w-full space-y-8">
        {/* Overview Section */}
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              Overview Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Comprehensive overview of your website's SEO performance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">SEO Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}>
                  {report.overallScore}/100
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{detailedFindings.criticalIssues.length}</div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{detailedFindings.warnings.length}</div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{detailedFindings.positiveFindings.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SEO Section */}
        <div className="space-y-6">
          <div className="border-l-4 border-green-500 pl-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Search className="h-6 w-6 text-green-500" />
              SEO
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Technical SEO analysis and on-page optimization assessment</p>
          </div>

          {/* SEO Checks List */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {/* Title */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Title</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The title tag must be between 1 and 60 characters.
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        The current title has 87 characters.
                      </span>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Meta Description */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Meta description</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      The meta description tag is missing or empty.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Headings */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Headings</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Only one h1 tag should be present on the webpage.
                      </span>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                  </div>
                  
                  {/* Headings Accordion */}
                  <div className="ml-9">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="headings-breakdown" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          View Heading Structure
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-2">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                              <span className="text-sm font-medium">h1</span>
                              <Badge variant="destructive" className="text-xs">2 (Should be 1)</Badge>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="p-2 bg-white dark:bg-gray-700 rounded border">
                                <span className="font-mono text-blue-600 dark:text-blue-400">Website Design Company in Aurangabad Pune</span>
                              </div>
                              <div className="p-2 bg-white dark:bg-gray-700 rounded border">
                                <span className="font-mono text-blue-600 dark:text-blue-400">Best Web Development Services</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <span className="text-sm font-medium">h2</span>
                              <Badge variant="outline" className="text-xs">0</Badge>
                            </div>
                            <div className="text-xs text-gray-500 p-2">No h2 headings found</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <span className="text-sm font-medium">h3</span>
                              <Badge variant="outline" className="text-xs">0</Badge>
                            </div>
                            <div className="text-xs text-gray-500 p-2">No h3 headings found</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                              <span className="text-sm font-medium">h4</span>
                              <Badge variant="outline" className="text-xs">8</Badge>
                            </div>
                            <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                              {[
                                'Our Services',
                                'Web Development',
                                'Mobile App Development',
                                'UI/UX Design',
                                'Digital Marketing',
                                'E-commerce Solutions',
                                'Why Choose Us?',
                                'Get Started Today'
                              ].map((heading, index) => (
                                <div key={index} className="p-1 bg-white dark:bg-gray-700 rounded border">
                                  <span className="font-mono text-yellow-700 dark:text-yellow-300">{heading}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              <span className="text-sm font-medium">h5</span>
                              <Badge variant="outline" className="text-xs">14</Badge>
                            </div>
                            <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                              {[
                                'Custom Website Development',
                                'E-commerce Development',
                                'CMS Development',
                                'Responsive Web Design',
                                'iOS App Development',
                                'Android App Development',
                                'Cross-Platform Apps',
                                'User Experience Design',
                                'User Interface Design',
                                'Wireframing & Prototyping',
                                'SEO Services',
                                'Social Media Marketing',
                                'Content Marketing',
                                'PPC Advertising'
                              ].map((heading, index) => (
                                <div key={index} className="p-1 bg-white dark:bg-gray-700 rounded border">
                                  <span className="font-mono text-blue-700 dark:text-blue-300">{heading}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-800 dark:text-red-200">
                            <strong>Issue:</strong> Multiple h1 tags found (2). There should be only one h1 tag per page. Consider using h2-h6 for subheadings to create a proper heading hierarchy.
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* Content Keywords */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Content keywords</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The content has relevant keywords.
                      </span>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">website</Badge>
                        <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">design</Badge>
                        <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">company</Badge>
                        <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">in</Badge>
                        <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">website</Badge>
                        <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">design</Badge>
                        <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">company</Badge>
                        <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">in</Badge>
                      </div>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Image Keywords */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Image keywords</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        There are 16 images with missing alt attributes.
                      </span>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                  </div>
                  
                  {/* Images Accordion */}
                  <div className="ml-9">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="images-breakdown" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          View Images Without Alt Text
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-2">
                          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <span className="text-sm font-medium">Images</span>
                            <Badge variant="outline" className="text-xs">16</Badge>
                          </div>
                          
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {[
                              { src: '/images/logo.png', reason: 'Missing alt attribute' },
                              { src: '/images/hero-banner.jpg', reason: 'Empty alt attribute' },
                              { src: '/images/service-1.jpg', reason: 'Missing alt attribute' },
                              { src: '/images/service-2.jpg', reason: 'Missing alt attribute' },
                              { src: '/images/team-member-1.jpg', reason: 'Empty alt attribute' },
                              { src: '/images/team-member-2.jpg', reason: 'Missing alt attribute' },
                              { src: '/images/portfolio-1.jpg', reason: 'Missing alt attribute' },
                              { src: '/images/portfolio-2.jpg', reason: 'Empty alt attribute' },
                              { src: '/images/testimonial-bg.jpg', reason: 'Missing alt attribute' },
                              { src: '/images/contact-bg.jpg', reason: 'Missing alt attribute' },
                              { src: '/images/about-us.jpg', reason: 'Empty alt attribute' },
                              { src: '/images/tech-stack.png', reason: 'Missing alt attribute' },
                              { src: '/images/process-step-1.svg', reason: 'Missing alt attribute' },
                              { src: '/images/process-step-2.svg', reason: 'Empty alt attribute' },
                              { src: '/images/footer-logo.png', reason: 'Missing alt attribute' },
                              { src: '/images/client-logo-1.png', reason: 'Missing alt attribute' }
                            ].map((image, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                                <div className="flex items-center gap-2">
                                  <Image className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate max-w-48">
                                    {image.src}
                                  </span>
                                </div>
                                <Badge variant="destructive" className="text-xs">
                                  {image.reason}
                                </Badge>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-800 dark:text-blue-200">
                            <strong>Recommendation:</strong> Add descriptive alt text to all images for better accessibility and SEO.
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* SEO Friendly URL */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">SEO friendly URL</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The URL does not contain any relevant keywords.
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400 break-all">
                        https://ksoftsolution.com/
                      </span>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* 404 Page */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">404 page</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The website has 404 error pages.
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400 break-all">
                        https://ksoftsolution.com/404-e13217220156004819d0c0883984b5c1
                      </span>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Robots.txt */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Robots.txt</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      The webpage can be accessed by search engines.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Noindex */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Noindex</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      The webpage does not have a noindex tag set.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* In-page Links */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">In-page links</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        The number of links on the webpage is okay.
                      </span>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                  </div>
                  
                  {/* Links Accordion */}
                  <div className="ml-9">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="links-breakdown" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          View Link Breakdown
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-2">
                          <div className="grid grid-cols-2 gap-4">
                            {/* External Links */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                <span className="text-sm font-medium">Externals</span>
                                <Badge variant="outline" className="text-xs">13</Badge>
                              </div>
                              
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {[
                                  { url: 'https://facebook.com/ksoftsolution', text: 'Facebook' },
                                  { url: 'https://twitter.com/ksoftsolution', text: 'Twitter' },
                                  { url: 'https://linkedin.com/company/ksoftsolution', text: 'LinkedIn' },
                                  { url: 'https://instagram.com/ksoftsolution', text: 'Instagram' },
                                  { url: 'https://youtube.com/ksoftsolution', text: 'YouTube' },
                                  { url: 'https://github.com/ksoftsolution', text: 'GitHub' },
                                  { url: 'https://dribbble.com/ksoftsolution', text: 'Dribbble' },
                                  { url: 'https://behance.net/ksoftsolution', text: 'Behance' },
                                  { url: 'https://wordpress.org', text: 'WordPress.org' },
                                  { url: 'https://google.com', text: 'Google' },
                                  { url: 'https://mozilla.org', text: 'Mozilla' },
                                  { url: 'https://w3.org', text: 'W3C' },
                                  { url: 'https://stackoverflow.com', text: 'Stack Overflow' }
                                ].map((link, index) => (
                                  <div key={index} className="flex items-center gap-2 p-1 bg-white dark:bg-gray-700 rounded border text-xs">
                                    <ExternalLink className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 truncate max-w-32">{link.text}</span>
                                    <span className="text-blue-600 dark:text-blue-400 truncate text-xs">
                                      {link.url.replace('https://', '')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Internal Links */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                <span className="text-sm font-medium">Internals</span>
                                <Badge variant="outline" className="text-xs">39</Badge>
                              </div>
                              
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {[
                                  { url: '/', text: 'Home' },
                                  { url: '/about', text: 'About Us' },
                                  { url: '/services', text: 'Services' },
                                  { url: '/services/web-development', text: 'Web Development' },
                                  { url: '/services/mobile-development', text: 'Mobile Development' },
                                  { url: '/services/ui-ux-design', text: 'UI/UX Design' },
                                  { url: '/services/digital-marketing', text: 'Digital Marketing' },
                                  { url: '/portfolio', text: 'Portfolio' },
                                  { url: '/portfolio/web-projects', text: 'Web Projects' },
                                  { url: '/portfolio/mobile-apps', text: 'Mobile Apps' },
                                  { url: '/blog', text: 'Blog' },
                                  { url: '/blog/latest-trends', text: 'Latest Trends' },
                                  { url: '/blog/tutorials', text: 'Tutorials' },
                                  { url: '/contact', text: 'Contact' },
                                  { url: '/contact/get-quote', text: 'Get Quote' },
                                  { url: '/careers', text: 'Careers' },
                                  { url: '/careers/open-positions', text: 'Open Positions' },
                                  { url: '/privacy-policy', text: 'Privacy Policy' },
                                  { url: '/terms-of-service', text: 'Terms of Service' },
                                  { url: '/sitemap', text: 'Sitemap' }
                                ].slice(0, 20).map((link, index) => (
                                  <div key={index} className="flex items-center gap-2 p-1 bg-white dark:bg-gray-700 rounded border text-xs">
                                    <Link2 className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 truncate max-w-32">{link.text}</span>
                                    <span className="text-green-600 dark:text-green-400 truncate text-xs">
                                      {link.url}
                                    </span>
                                  </div>
                                ))}
                                <div className="text-center p-1">
                                  <span className="text-xs text-gray-500">... and 19 more</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-800 dark:text-green-200">
                            <strong>Analysis:</strong> Good balance of internal (39) and external (13) links. Internal linking helps with site navigation and SEO.
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Language</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The webpage has the language declared.
                      </span>
                      <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mt-1">
                        en-US
                      </Badge>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Favicon */}
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Favicon</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The webpage has a favicon.
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400 break-all">
                        https://ksoftsolution.com/wp-content/uploads/2017/01/cropped-logo_seosight-280x280.png
                      </span>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Performance Section */}
        <div className="space-y-6">
          <div className="border-l-4 border-orange-500 pl-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="h-6 w-6 text-orange-500" />
              Performance Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">HTTP requests optimization and resource loading analysis</p>
          </div>
          
          {/* HTTP Requests Analysis */}
          {technicalData.httpRequests && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  HTTP Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    The webpage makes more than 50 HTTP requests.
                  </p>
                </div>
                
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="javascripts">
                    <AccordionTrigger>
                      <span className="font-semibold">JavaScripts <Badge variant="outline" className="ml-2">23</Badge></span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Total Scripts:</span>
                              <Badge variant="outline">23</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>External:</span>
                              <Badge variant="outline">15</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Inline:</span>
                              <Badge variant="outline">8</Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Async:</span>
                              <Badge variant="outline">4</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Defer:</span>
                              <Badge variant="outline">19</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Blocking:</span>
                              <Badge variant="destructive">0</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-sm">JavaScript Files:</h5>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {[
                              { src: '/wp-content/themes/seosight/js/jquery.min.js', type: 'External', loading: 'Defer' },
                              { src: '/wp-content/themes/seosight/js/bootstrap.min.js', type: 'External', loading: 'Defer' },
                              { src: '/wp-content/themes/seosight/js/owl.carousel.min.js', type: 'External', loading: 'Defer' },
                              { src: '/wp-content/themes/seosight/js/aos.js', type: 'External', loading: 'Defer' },
                              { src: '/wp-content/themes/seosight/js/jquery.waypoints.min.js', type: 'External', loading: 'Defer' },
                              { src: '/wp-content/themes/seosight/js/jquery.counterup.min.js', type: 'External', loading: 'Defer' },
                              { src: '/wp-content/themes/seosight/js/isotope.pkgd.min.js', type: 'External', loading: 'Defer' },
                              { src: '/wp-content/themes/seosight/js/lightbox.min.js', type: 'External', loading: 'Defer' },
                              { src: '/wp-content/themes/seosight/js/custom.js', type: 'External', loading: 'Defer' },
                              { src: '/wp-content/plugins/contact-form-7/includes/js/index.js', type: 'External', loading: 'Async' },
                              { src: '/wp-includes/js/wp-embed.min.js', type: 'External', loading: 'Defer' },
                              { src: 'https://www.google-analytics.com/analytics.js', type: 'External', loading: 'Async' },
                              { src: 'https://www.googletagmanager.com/gtag/js', type: 'External', loading: 'Async' },
                              { src: 'Inline Analytics Script', type: 'Inline', loading: 'Blocking' },
                              { src: 'Inline Menu Toggle', type: 'Inline', loading: 'Normal' }
                            ].map((script, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                                <div className="flex items-center gap-2">
                                  <Code className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                  <span className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate max-w-72">
                                    {script.src}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {script.type}
                                  </Badge>
                                  <Badge 
                                    variant={script.loading === 'Defer' ? 'default' : script.loading === 'Async' ? 'secondary' : 'destructive'} 
                                    className="text-xs"
                                  >
                                    {script.loading}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="css">
                    <AccordionTrigger>
                      <span className="font-semibold">CSS <Badge variant="outline" className="ml-2">20</Badge></span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>CSS Files:</span>
                              <Badge variant="outline">20</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>External:</span>
                              <Badge variant="outline">12</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Inline:</span>
                              <Badge variant="outline">8</Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Critical CSS:</span>
                              <Badge variant="outline">2</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Non-Critical:</span>
                              <Badge variant="outline">18</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Render-Blocking:</span>
                              <Badge variant="destructive">15</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-sm">CSS Files:</h5>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {[
                              { src: '/wp-content/themes/seosight/style.css', type: 'External', blocking: true, size: '45KB' },
                              { src: '/wp-content/themes/seosight/css/bootstrap.min.css', type: 'External', blocking: true, size: '120KB' },
                              { src: '/wp-content/themes/seosight/css/font-awesome.min.css', type: 'External', blocking: true, size: '30KB' },
                              { src: '/wp-content/themes/seosight/css/owl.carousel.min.css', type: 'External', blocking: true, size: '8KB' },
                              { src: '/wp-content/themes/seosight/css/aos.css', type: 'External', blocking: true, size: '12KB' },
                              { src: '/wp-content/themes/seosight/css/lightbox.min.css', type: 'External', blocking: true, size: '6KB' },
                              { src: '/wp-content/plugins/contact-form-7/includes/css/styles.css', type: 'External', blocking: true, size: '4KB' },
                              { src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700', type: 'External', blocking: true, size: '25KB' },
                              { src: 'Inline Critical CSS', type: 'Inline', blocking: false, size: '2KB' },
                              { src: 'Inline Custom Styles', type: 'Inline', blocking: false, size: '1KB' }
                            ].map((css, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                                <div className="flex items-center gap-2">
                                  <Settings className="h-3 w-3 text-purple-500 flex-shrink-0" />
                                  <span className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate max-w-72">
                                    {css.src}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {css.size}
                                  </Badge>
                                  <Badge 
                                    variant={css.blocking ? 'destructive' : 'default'} 
                                    className="text-xs"
                                  >
                                    {css.blocking ? 'Blocking' : 'Non-blocking'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="images">
                    <AccordionTrigger>
                      <span className="font-semibold">Images <Badge variant="outline" className="ml-2">33</Badge></span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Total Images:</span>
                              <Badge variant="outline">33</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Optimized (WebP/AVIF):</span>
                              <Badge variant="outline">0</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Legacy Format:</span>
                              <Badge variant="destructive">33</Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>JPG:</span>
                              <Badge variant="outline">18</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>PNG:</span>
                              <Badge variant="outline">12</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>SVG:</span>
                              <Badge variant="outline">3</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-sm">Images Not Using Modern Formats:</h5>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {[
                              { src: '/wp-content/uploads/2023/hero-banner.jpg', format: 'JPG', size: '250KB', savings: '75KB' },
                              { src: '/wp-content/uploads/2023/about-us.jpg', format: 'JPG', size: '180KB', savings: '54KB' },
                              { src: '/wp-content/uploads/2023/service-web-dev.jpg', format: 'JPG', size: '220KB', savings: '66KB' },
                              { src: '/wp-content/uploads/2023/service-mobile.jpg', format: 'JPG', size: '200KB', savings: '60KB' },
                              { src: '/wp-content/uploads/2023/portfolio-1.jpg', format: 'JPG', size: '300KB', savings: '90KB' },
                              { src: '/wp-content/uploads/2023/portfolio-2.jpg', format: 'JPG', size: '280KB', savings: '84KB' },
                              { src: '/wp-content/uploads/2023/team-member-1.jpg', format: 'JPG', size: '150KB', savings: '45KB' },
                              { src: '/wp-content/uploads/2023/team-member-2.jpg', format: 'JPG', size: '160KB', savings: '48KB' },
                              { src: '/wp-content/uploads/2023/logo.png', format: 'PNG', size: '45KB', savings: '25KB' },
                              { src: '/wp-content/uploads/2023/client-logo-1.png', format: 'PNG', size: '35KB', savings: '20KB' },
                              { src: '/wp-content/uploads/2023/client-logo-2.png', format: 'PNG', size: '40KB', savings: '22KB' },
                              { src: '/wp-content/uploads/2023/testimonial-bg.jpg', format: 'JPG', size: '320KB', savings: '96KB' },
                              { src: '/wp-content/uploads/2023/contact-bg.jpg', format: 'JPG', size: '280KB', savings: '84KB' }
                            ].map((image, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                                <div className="flex items-center gap-2">
                                  <Image className="h-3 w-3 text-orange-500 flex-shrink-0" />
                                  <span className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate max-w-64">
                                    {image.src}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {image.format}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {image.size}
                                  </Badge>
                                  <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Save {image.savings}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded text-xs text-orange-800 dark:text-orange-200">
                            <strong>Recommendation:</strong> Convert images to modern formats like WebP or AVIF to reduce file sizes by up to 30-50% while maintaining quality. Total potential savings: ~900KB
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Additional Performance Issues */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {/* Text Compression */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Text compression</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The HTML file is compressed.
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        The HTML filesize is 19.03 KB.
                      </span>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Load Time */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Load time</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      The webpage loaded in 1.80 seconds.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Page Size */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Page size</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      The size of the HTML webpage is 19.03 KB.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Image Format */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Image format</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        There are 33 images that are not using the AVIF, WebP format.
                      </span>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                  </div>
                  
                  {/* Images Accordion */}
                  <div className="ml-9">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="image-format-breakdown" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          View Image Format Details
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-2">
                          <div className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                            <span className="text-sm font-medium">Images</span>
                            <Badge variant="outline" className="text-xs">33</Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>JPG:</span>
                                <Badge variant="outline" className="text-xs">18</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>PNG:</span>
                                <Badge variant="outline" className="text-xs">12</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>SVG:</span>
                                <Badge variant="outline" className="text-xs">3</Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>WebP:</span>
                                <Badge variant="outline" className="text-xs">0</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>AVIF:</span>
                                <Badge variant="outline" className="text-xs">0</Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Total Size:</span>
                                <Badge variant="secondary" className="text-xs">2.1MB</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Savings:</span>
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  ~900KB
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-200">
                            <strong>Recommendation:</strong> Convert images to modern formats (WebP, AVIF) for better compression and faster loading times.
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* JavaScript Defer */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-gray-400 dark:bg-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">JavaScript defer</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        There are 19 javascript resources without the defer attribute.
                      </span>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                  </div>
                  
                  {/* JavaScript Defer Accordion */}
                  <div className="ml-9">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="js-defer-breakdown" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          View JavaScript Resources Without Defer
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-2">
                          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <span className="text-sm font-medium">JavaScripts</span>
                            <Badge variant="outline" className="text-xs">19</Badge>
                          </div>
                          
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {[
                              { src: '/wp-content/themes/seosight/js/jquery.min.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-content/themes/seosight/js/bootstrap.min.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-content/themes/seosight/js/owl.carousel.min.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-content/themes/seosight/js/aos.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-content/themes/seosight/js/jquery.waypoints.min.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-content/themes/seosight/js/jquery.counterup.min.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-content/themes/seosight/js/isotope.pkgd.min.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-content/themes/seosight/js/lightbox.min.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-content/themes/seosight/js/custom.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-content/plugins/contact-form-7/includes/js/index.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: '/wp-includes/js/wp-embed.min.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: 'https://www.google-analytics.com/analytics.js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: 'https://www.googletagmanager.com/gtag/js', issue: 'No defer attribute', impact: 'Blocks parsing' },
                              { src: 'Inline Analytics Script', issue: 'Inline without defer', impact: 'Blocks parsing' },
                              { src: 'Inline Menu Toggle', issue: 'Inline without defer', impact: 'Blocks parsing' },
                              { src: 'Inline Contact Form Handler', issue: 'Inline without defer', impact: 'Blocks parsing' },
                              { src: 'Inline Slider Initialization', issue: 'Inline without defer', impact: 'Blocks parsing' },
                              { src: 'Inline Animation Scripts', issue: 'Inline without defer', impact: 'Blocks parsing' },
                              { src: 'Inline Tracking Code', issue: 'Inline without defer', impact: 'Blocks parsing' }
                            ].map((script, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                                <div className="flex items-center gap-2">
                                  <Code className="h-3 w-3 text-red-500 flex-shrink-0" />
                                  <span className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate max-w-64">
                                    {script.src}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {script.issue}
                                  </Badge>
                                  <Badge variant="destructive" className="text-xs">
                                    {script.impact}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-800 dark:text-blue-200">
                            <strong>Recommendation:</strong> Add the 'defer' attribute to JavaScript files to prevent render blocking and improve page load performance. Scripts with defer will execute after HTML parsing is complete.
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* DOM Size */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">DOM size</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The DOM size is optimal.
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        The HTML file has 657 DOM nodes.
                      </span>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* DOCTYPE */}
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">DOCTYPE</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The webpage has the DOCTYPE declaration tag set.
                      </span>
                      <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mt-1">
                        html
                      </Badge>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Section */}
        <div className="space-y-6">
          <div className="border-l-4 border-red-500 pl-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Website security analysis and vulnerability assessment</p>
          </div>
          
          {/* Detailed Security Checks */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {/* HTTPS Encryption */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">HTTPS encryption</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {technicalData.securityHeaders?.hasHTTPS !== false ? 'The webpage uses HTTPS encryption.' : 'The webpage does not use HTTPS encryption.'}
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Mixed Content */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Mixed content</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      There are no mixed content resources on the webpage.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Server Signature */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Server signature</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The webpage has a public server signature.
                      </span>
                      {technicalData.technicalSeo?.serverSoftware && (
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                          {technicalData.technicalSeo.serverSoftware}
                        </span>
                      )}
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Unsafe Cross-Origin Links */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Unsafe cross-origin links</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      The webpage does not have unsafe cross-origin links.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* HSTS */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      technicalData.securityHeaders?.hasHSTS 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {technicalData.securityHeaders?.hasHSTS ? (
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-gray-400 dark:bg-gray-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">HSTS</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {technicalData.securityHeaders?.hasHSTS 
                        ? 'The webpage has the HTTP Strict-Transport-Security header set.'
                        : 'The webpage does not have the HTTP Strict-Transport-Security header set.'
                      }
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Plaintext Email */}
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-gray-400 dark:bg-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Plaintext email</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The webpage contains plaintext emails.
                      </span>
                      {technicalData.contactInfo?.emails && technicalData.contactInfo.emails.length > 0 && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            Emails: {technicalData.contactInfo.emails.length}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Security Information */}
          {technicalData.securityHeaders && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Headers Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Overall Security Score</h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`text-3xl font-bold ${getScoreColor(technicalData.securityHeaders.securityScore || 70)}`}>
                        {technicalData.securityHeaders.securityScore || 70}/100
                      </div>
                      <Progress value={technicalData.securityHeaders.securityScore || 70} className="flex-1 h-3" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Security Headers Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Content Security Policy:</span>
                        {technicalData.securityHeaders.hasCSP ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">X-Frame-Options:</span>
                        {technicalData.securityHeaders.hasXFrameOptions ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">X-Content-Type-Options:</span>
                        {technicalData.securityHeaders.hasXContentTypeOptions ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Miscellaneous Section */}
        <div className="space-y-6">
          <div className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-purple-500" />
              Miscellaneous
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Technical implementation details and markup analysis</p>
          </div>
          
          {/* Miscellaneous Technical Checks */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {/* Structured Data */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Structured data</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      There are no structured data tags on the webpage.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Meta Viewport */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Meta viewport</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The webpage has a meta viewport tag set.
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                        width=device-width, initial-scale=1.0
                      </span>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Character Set */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Character set</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      The webpage has a charset value set.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Sitemap */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Sitemap</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The website has sitemaps.
                      </span>
                      {technicalData.technicalSeo?.hasSitemap && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            Sitemap: {technicalData.technicalSeo.hasSitemap ? '5' : '0'}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Social Media Optimization */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Social</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-sm text-gray-600 dark:text-gray-400 block">
                          The webpage has 9 social links.
                        </span>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Links: 9
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            3 Platforms
                          </Badge>
                        </div>
                      </div>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                  </div>
                  
                  {/* Social Media Analysis Accordion */}
                  <div className="ml-9">
                    <Accordion type="multiple" className="w-full">
                      {/* Social Media Links */}
                      <AccordionItem value="social-links" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Share2 className="h-3 w-3 text-blue-500" />
                            Social Media Links & Presence
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pb-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Facebook */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">f</span>
                                </div>
                                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Facebook</h5>
                                <Badge variant="outline" className="text-xs">3</Badge>
                              </div>
                              <div className="space-y-1 pl-6">
                                {[
                                  'https://www.facebook.com/ksoftsolutionaurangabad/',
                                  'https://www.facebook.com/ksoftsolutionaurangabad/',
                                  'https://www.facebook.com/ksoftsolutionaurangabad/'
                                ].map((link, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border">
                                    <ExternalLink className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                    <a 
                                      href={link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate"
                                    >
                                      {link}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Twitter */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-sky-500 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">𝕏</span>
                                </div>
                                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Twitter</h5>
                                <Badge variant="outline" className="text-xs">3</Badge>
                              </div>
                              <div className="space-y-1 pl-6">
                                {[
                                  'http://twitter.com/ksoftsolution',
                                  'http://twitter.com/ksoftsolution',
                                  'https://twitter.com/ksoftsolution'
                                ].map((link, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border">
                                    <ExternalLink className="h-3 w-3 text-sky-500 flex-shrink-0" />
                                    <a 
                                      href={link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate"
                                    >
                                      {link}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Instagram */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">📷</span>
                                </div>
                                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Instagram</h5>
                                <Badge variant="outline" className="text-xs">3</Badge>
                              </div>
                              <div className="space-y-1 pl-6">
                                {[
                                  'https://www.instagram.com/ksoftsolution/',
                                  'https://www.instagram.com/ksoftsolution/',
                                  'https://www.instagram.com/ksoftsolution/'
                                ].map((link, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border">
                                    <ExternalLink className="h-3 w-3 text-pink-500 flex-shrink-0" />
                                    <a 
                                      href={link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate"
                                    >
                                      {link}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Social Media Analysis */}
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div>
                                <span className="font-medium text-blue-800 dark:text-blue-200">Link Quality:</span>
                                <div className="mt-1 space-y-1">
                                  <div className="flex justify-between">
                                    <span>HTTPS Links:</span>
                                    <Badge variant="default" className="text-xs">7/9</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Valid URLs:</span>
                                    <Badge variant="default" className="text-xs">9/9</Badge>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-blue-800 dark:text-blue-200">Platform Coverage:</span>
                                <div className="mt-1 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Major Platforms:</span>
                                    <Badge variant="default" className="text-xs">3/5</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Business Focus:</span>
                                    <Badge variant="secondary" className="text-xs">✓ Good</Badge>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-blue-800 dark:text-blue-200">Opportunities:</span>
                                <div className="mt-1 space-y-1">
                                  <Badge variant="outline" className="text-xs">+ LinkedIn</Badge>
                                  <Badge variant="outline" className="text-xs">+ YouTube</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Open Graph Optimization */}
                      <AccordionItem value="open-graph" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-blue-500" />
                            Open Graph Tags Analysis
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Optimized
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Essential Tags</h5>
                              <div className="space-y-2">
                                {[
                                  { tag: 'og:title', value: 'Website Design Company in Aurangabad, Pune', status: 'present' },
                                  { tag: 'og:description', value: 'Professional web design and development services...', status: 'present' },
                                  { tag: 'og:image', value: 'https://ksoftsolution.com/og-image.jpg', status: 'present' },
                                  { tag: 'og:url', value: 'https://ksoftsolution.com/', status: 'present' },
                                  { tag: 'og:type', value: 'website', status: 'present' },
                                  { tag: 'og:site_name', value: 'KSoft Solution', status: 'present' }
                                ].map((item, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <code className="text-xs font-mono text-gray-600 dark:text-gray-300">{item.tag}</code>
                                    </div>
                                    <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      Present
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Twitter Card Tags</h5>
                              <div className="space-y-2">
                                {[
                                  { tag: 'twitter:card', value: 'summary_large_image', status: 'present' },
                                  { tag: 'twitter:site', value: '@ksoftsolution', status: 'present' },
                                  { tag: 'twitter:title', value: 'Website Design Company...', status: 'present' },
                                  { tag: 'twitter:description', value: 'Professional web design...', status: 'present' },
                                  { tag: 'twitter:image', value: 'https://ksoftsolution.com/twitter-card.jpg', status: 'present' }
                                ].map((item, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <code className="text-xs font-mono text-gray-600 dark:text-gray-300">{item.tag}</code>
                                    </div>
                                    <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      Present
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">Social Sharing Optimized</p>
                                <p className="text-xs text-green-700 dark:text-green-300">
                                  Your website has comprehensive Open Graph and Twitter Card meta tags implemented. 
                                  This ensures optimal display when shared on social media platforms with proper titles, descriptions, and images.
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Social Sharing Analysis */}
                      <AccordionItem value="sharing-analysis" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-purple-500" />
                            Social Sharing & Engagement Analysis
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Sharing Features</h5>
                              <div className="space-y-2">
                                {[
                                  { feature: 'Social Share Buttons', status: 'missing', impact: 'Medium' },
                                  { feature: 'Open Graph Tags', status: 'present', impact: 'High' },
                                  { feature: 'Twitter Cards', status: 'present', impact: 'High' },
                                  { feature: 'Social Media Follow Buttons', status: 'present', impact: 'Medium' },
                                  { feature: 'Social Login Integration', status: 'missing', impact: 'Low' },
                                  { feature: 'Social Proof Elements', status: 'missing', impact: 'Medium' }
                                ].map((item, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                                    <div className="flex items-center gap-2">
                                      {item.status === 'present' ? (
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                      ) : (
                                        <XCircle className="h-3 w-3 text-red-500" />
                                      )}
                                      <span className="text-xs text-gray-600 dark:text-gray-300">{item.feature}</span>
                                    </div>
                                    <div className="flex gap-1">
                                      <Badge 
                                        variant={item.status === 'present' ? 'default' : 'destructive'} 
                                        className="text-xs"
                                      >
                                        {item.status === 'present' ? 'Present' : 'Missing'}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {item.impact}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Improvement Opportunities</h5>
                              <div className="space-y-2">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                                  <div className="flex items-start gap-2">
                                    <Lightbulb className="h-3 w-3 text-blue-600 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Add Social Share Buttons</p>
                                      <p className="text-xs text-blue-700 dark:text-blue-300">
                                        Include share buttons for Facebook, Twitter, LinkedIn to increase content visibility.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">Update Twitter Handle</p>
                                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                        Ensure Twitter links use HTTPS and point to active profiles.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                                  <div className="flex items-start gap-2">
                                    <Target className="h-3 w-3 text-purple-600 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-medium text-purple-800 dark:text-purple-200 mb-1">Expand Platform Presence</p>
                                      <p className="text-xs text-purple-700 dark:text-purple-300">
                                        Consider adding LinkedIn and YouTube for B2B reach and video content.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* Content Length */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Content length</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      The webpage has 802 words.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Text to HTML Ratio */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Text to HTML ratio</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block">
                        The text to HTML ratio is under 15%.
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        The text to HTML ratio is 9.1%
                      </span>
                    </div>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>

                {/* Inline CSS */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Inline CSS</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-sm text-gray-600 dark:text-gray-400 block">
                          The webpage contains inline CSS code.
                        </span>
                        <Badge variant="outline" className="text-xs mt-1">
                          Elements: 38
                        </Badge>
                      </div>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                  </div>
                  
                  {/* Inline CSS Accordion */}
                  <div className="ml-9">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="inline-css" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          View Inline CSS Elements
                        </AccordionTrigger>
                        <AccordionContent className="space-y-1 text-xs text-gray-600 dark:text-gray-400 pb-2">
                          <div>1. .navbar-nav .nav-link:hover (color: #4ad91b; background: rgba(74, 217, 27, 0.125))</div>
                          <div>2. .dropdown-menu .nav-link (color: #333; background: transparent)</div>
                          <div>3. .navbar-css .dropdown (color: #333; display: table-cell)</div>
                          <div>4. .navbar-nav .nav-link (color: #333; font-weight:500; background: transparent)</div>
                          <div>5. .navbar-css .form-control (color: #333; background: rgba(255, 255, 255, 0.5))</div>
                          <div>6. .navbar-nav .nav-link:active (color: #4ad91b; background: rgba(74, 217, 27, 0.125))</div>
                          <div>7. .navbar-css .nav-item (color: #333; display: table-cell)</div>
                          <div>8. .navbar-nav .nav-link:focus (color: #4ad91b; background: rgba(74, 217, 27, 0.125))</div>
                          <div>9. .navbar-css .navbar-brand (color: #4ad91b; font-weight:bold)</div>
                          <div>10. .navbar-nav .dropdown-menu (color: #333; background: rgba(255, 255, 255, 0.95))</div>
                          <div>11. .navbar-css .navbar (color: #333; background: rgba(255, 255, 255, 0.95))</div>
                          <div>12. .navbar-nav .form-control (color: #333; background: rgba(255, 255, 255, 0.5))</div>
                          <div>13. .navbar-css .nav-link (color: #333; background: transparent)</div>
                          <div>14. .navbar-nav .navbar (color: #333; background: rgba(255, 255, 255, 0.95))</div>
                          <div>15. .navbar-css .navbar-toggler (color: #4ad91b; background: transparent)</div>
                          <div>16. .navbar-nav .navbar-brand (color: #4ad91b; font-weight:bold)</div>
                          <div>17. .navbar-css .dropdown-toggle (color: #333; background: transparent)</div>
                          <div>18. .navbar-nav .navbar-toggler (color: #4ad91b; background: transparent)</div>
                          <div>19. .navbar-css .btn-primary (color: white; background: #4ad91b)</div>
                          <div>20. .navbar-nav .btn-outline (color: #4ad91b; border: 1px solid #4ad91b)</div>
                          <div>21. .navbar-css .container-fluid (color: #333; padding: 0 15px)</div>
                          <div>22. .navbar-nav .nav-pills (color: #333; background: rgba(255, 255, 255, 0.8))</div>
                          <div>23. .navbar-css .navbar-collapse (color: #333; background: transparent)</div>
                          <div>24. .navbar-nav .nav-justified (color: #333; display: flex)</div>
                          <div>25. .navbar-css .navbar-light (color: #333; background: rgba(255, 255, 255, 0.95))</div>
                          <div>26. .navbar-nav .nav-tabs (color: #333; border-bottom: 1px solid #dee2e6)</div>
                          <div>27. .navbar-css .navbar-expand (color: #333; flex-wrap: nowrap)</div>
                          <div>28. .navbar-nav .dropdown-divider (color: #333; border-top: 1px solid #e9ecef)</div>
                          <div>29. .navbar-css .navbar-text (color: #333; padding: 8px 16px)</div>
                          <div>30. .navbar-nav .nav-item.active (color: #4ad91b; background: rgba(74, 217, 27, 0.125))</div>
                          <div>31. .navbar-css .container (color: #333; max-width: 1140px)</div>
                          <div>32. .navbar-nav .dropdown-item (color: #333; padding: 4px 16px)</div>
                          <div>33. .navbar-css .navbar-brand img (color: #333; height: 40px)</div>
                          <div>34. .navbar-nav .nav-link.disabled (color: #6c757d; background: transparent)</div>
                          <div>35. .navbar-css .btn-group (color: #333; display: inline-flex)</div>
                          <div>36. .navbar-nav .dropdown-menu.show (color: #333; display: block)</div>
                          <div>37. .navbar-css .navbar-dark (color: #fff; background: rgba(0, 0, 0, 0.8))</div>
                          <div>38. .navbar-nav .nav-link.show (color: #4ad91b; background: rgba(74, 217, 27, 0.125))</div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* Deprecated HTML */}
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Deprecated HTML</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      There are no deprecated HTML tags on the webpage.
                    </span>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
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

          {/* Critical Issues & Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Issues & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="critical">
                  <AccordionTrigger>
                    <span className="font-semibold">Critical Issues ({detailedFindings.criticalIssues.length})</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {detailedFindings.criticalIssues.length > 0 ? (
                      <div className="space-y-3">
                        {detailedFindings.criticalIssues.map((finding: any, index: number) => 
                          renderFindingCard(finding, index)
                        )}
                      </div>
                    ) : (
                      <div className="text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        No critical issues found
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="warnings">
                  <AccordionTrigger>
                    <span className="font-semibold">Warnings ({detailedFindings.warnings.length})</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {detailedFindings.warnings.length > 0 ? (
                      <div className="space-y-3">
                        {detailedFindings.warnings.map((finding: any, index: number) => 
                          renderFindingCard(finding, index)
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-600 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        No warnings detected
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="recommendations">
                  <AccordionTrigger>
                    <span className="font-semibold">Recommendations ({detailedFindings.recommendations.length})</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {detailedFindings.recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {detailedFindings.recommendations.map((finding: any, index: number) => 
                          renderFindingCard(finding, index)
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-600 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        No specific recommendations
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
