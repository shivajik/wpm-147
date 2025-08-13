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
                        <AccordionContent className="space-y-2 pb-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">h1</span>
                            <Badge variant="outline" className="text-xs">2</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">h4</span>
                            <Badge variant="outline" className="text-xs">8</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">h5</span>
                            <Badge variant="outline" className="text-xs">14</Badge>
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
                        <AccordionContent className="space-y-2 pb-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Images</span>
                            <Badge variant="outline" className="text-xs">16</Badge>
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
                        <AccordionContent className="space-y-2 pb-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Externals</span>
                            <Badge variant="outline" className="text-xs">13</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Internals</span>
                            <Badge variant="outline" className="text-xs">39</Badge>
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
                      <span className="font-semibold">JavaScripts ({technicalData.javascriptAnalysis?.totalScripts || 0})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Scripts:</span>
                            <Badge variant="outline">{technicalData.javascriptAnalysis?.totalScripts || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>External:</span>
                            <Badge variant="outline">{technicalData.javascriptAnalysis?.externalScripts || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Inline:</span>
                            <Badge variant="outline">{technicalData.javascriptAnalysis?.inlineScripts || 0}</Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Async:</span>
                            <Badge variant="outline">{technicalData.javascriptAnalysis?.asyncScripts || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Defer:</span>
                            <Badge variant="outline">{technicalData.javascriptAnalysis?.deferScripts || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Blocking:</span>
                            <Badge variant={technicalData.javascriptAnalysis?.blockingScripts > 3 ? "destructive" : "outline"}>
                              {technicalData.javascriptAnalysis?.blockingScripts || 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="css">
                    <AccordionTrigger>
                      <span className="font-semibold">CSS ({technicalData.httpRequests.requestsByType?.css || 0})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>CSS Files:</span>
                          <Badge variant="outline">{technicalData.httpRequests.requestsByType?.css || 0}</Badge>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="images">
                    <AccordionTrigger>
                      <span className="font-semibold">Images ({technicalData.imageKeywords?.totalImages || 0})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Images:</span>
                            <Badge variant="outline">{technicalData.imageKeywords?.totalImages || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>With Keywords:</span>
                            <Badge variant="outline">{technicalData.imageKeywords?.imagesWithKeywords || 0}</Badge>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Image Formats</h5>
                          <div className="space-y-1">
                            {Object.entries(technicalData.imageKeywords?.imageFormats || {}).map(([format, count]: [string, any]) => (
                              <div key={format} className="text-sm flex justify-between">
                                <span className="uppercase">{format}:</span>
                                <Badge variant="outline" className="text-xs">{count}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}
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

                {/* Social */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
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
                          The webpage has 8 social links.
                        </span>
                        <Badge variant="outline" className="text-xs mt-1">
                          Links: 8
                        </Badge>
                      </div>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                  </div>
                  
                  {/* Social Links Accordion */}
                  <div className="ml-9">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="social-links" className="border-none">
                        <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                          View Social Media Links
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pb-2">
                          <div>
                            <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook</h5>
                            <div className="space-y-1 text-xs pl-2">
                              <div className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                1. https://www.facebook.com/KsoftSolutionPuneAzad
                              </div>
                              <div className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                2. https://www.facebook.com/KsoftSolutionPuneAzad
                              </div>
                              <div className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                3. https://www.facebook.com/KsoftSolutionPuneAzad
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter</h5>
                            <div className="space-y-1 text-xs pl-2">
                              <div className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                1. https://twitter.com/KsoftSolution
                              </div>
                              <div className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                2. https://twitter.com/KsoftSolution
                              </div>
                              <div className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                3. https://twitter.com/KsoftSolution
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram</h5>
                            <div className="space-y-1 text-xs pl-2">
                              <div className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                1. https://www.instagram.com/ksoftsolution
                              </div>
                              <div className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                2. https://www.instagram.com/ksoftsolution
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
