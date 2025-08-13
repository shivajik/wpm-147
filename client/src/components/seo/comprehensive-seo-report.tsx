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
  const [activeTab, setActiveTab] = useState('overview');

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

      {/* Single Page Navigation - phpRank Style */}
      <div className="w-full">
        {/* Enhanced Navigation Bar */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <nav className="flex flex-wrap bg-gray-50 dark:bg-gray-800 rounded-lg">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3, count: 4 },
                { id: 'seo', label: 'SEO', icon: Search, count: 3 },
                { id: 'performance', label: 'Performance', icon: Zap, count: 1 },
                { id: 'security', label: 'Security', icon: Shield, count: 1 },
                { id: 'miscellaneous', label: 'Miscellaneous', icon: Settings, count: 2 }
              ].map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-4 flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200 ${
                    index === 0 ? 'rounded-l-lg' : ''
                  } ${
                    index === 4 ? 'rounded-r-lg' : ''
                  } ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border-2 border-blue-200 dark:border-blue-600'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content Area with Animation */}
        <div className="min-h-[500px] transition-all duration-300 ease-in-out">
          {/* Current Section Indicator */}
          <div className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Current Section: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded">
                {activeTab === 'overview' && '4 Components'}
                {activeTab === 'seo' && '3 Analysis Tools'}
                {activeTab === 'performance' && '1 HTTP Analysis'}
                {activeTab === 'security' && '1 Security Check'}
                {activeTab === 'miscellaneous' && '2 Summary Reports'}
              </span>
            </div>
          </div>

          {/* Overview Section */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
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
        )}

        {/* SEO Section */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="h-6 w-6 text-green-500" />
                SEO Technical Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Detailed technical SEO analysis and content optimization</p>
            </div>
          {/* Heading Structure Analysis */}
          {technicalData.headingAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Heading Structure Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3">Heading Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Headings:</span>
                        <Badge variant="outline">{technicalData.headingAnalysis.totalHeadings}</Badge>
                      </div>
                      {Object.entries(technicalData.headingAnalysis.structure || {}).map(([tag, headings]: [string, any]) => (
                        <div key={tag} className="flex justify-between">
                          <span>{tag.toUpperCase()}:</span>
                          <Badge variant="outline">{headings.length}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Hierarchy Issues</h4>
                    {technicalData.headingAnalysis.hierarchy?.issues?.length > 0 ? (
                      <div className="space-y-2">
                        {technicalData.headingAnalysis.hierarchy.issues.map((issue: string, index: number) => (
                          <div key={index} className="text-sm text-red-600 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        No hierarchy issues detected
                      </div>
                    )}
                  </div>
                </div>

                <Accordion type="multiple" className="w-full">
                  {Object.entries(technicalData.headingAnalysis.structure || {}).map(([tag, headings]: [string, any]) => 
                    headings.length > 0 && (
                      <AccordionItem key={tag} value={tag}>
                        <AccordionTrigger className="text-left">
                          <span className="font-semibold capitalize">{tag} Tags ({headings.length})</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {headings.map((heading: any, index: number) => (
                              <div key={index} className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md border-l-2 border-gray-200 dark:border-gray-600">
                                {heading.text}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Content Keywords Analysis */}
          {technicalData.contentKeywords && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Content Keywords Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Content Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Words:</span>
                        <Badge variant="outline">{technicalData.contentKeywords.totalWords}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Unique Words:</span>
                        <Badge variant="outline">{technicalData.contentKeywords.uniqueWords}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Word Length:</span>
                        <Badge variant="outline">{Math.round(technicalData.contentKeywords.avgWordLength || 0)}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="keywords">
                        <AccordionTrigger>
                          <span className="font-semibold">Top Keywords ({technicalData.contentKeywords.topKeywords?.length || 0})</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {technicalData.contentKeywords.topKeywords?.slice(0, 15).map((keyword: any, index: number) => (
                              <div key={index} className="text-sm flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <span>{keyword.keyword}</span>
                                <Badge variant="outline">{keyword.density}%</Badge>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="phrases">
                        <AccordionTrigger>
                          <span className="font-semibold">Common Phrases ({technicalData.contentKeywords.keywordPhrases2?.length || 0})</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {technicalData.contentKeywords.keywordPhrases2?.slice(0, 12).map((phrase: any, index: number) => (
                              <div key={index} className="text-sm flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <span className="truncate">{phrase.phrase}</span>
                                <Badge variant="outline">{phrase.count}x</Badge>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meta Tags Analysis */}
          {technicalData.metaTagsAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Meta Tags Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Meta Tag Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Meta Tags:</span>
                        <Badge variant="outline">{technicalData.metaTagsAnalysis.totalMetaTags}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>SEO Tags:</span>
                        <Badge variant="outline">{technicalData.metaTagsAnalysis.seoMetaTags?.length || 0}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Tags:</span>
                        <Badge variant="outline">{technicalData.metaTagsAnalysis.socialMetaTags?.length || 0}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="seo-meta">
                        <AccordionTrigger>
                          <span className="font-semibold">SEO Meta Tags ({technicalData.metaTagsAnalysis.seoMetaTags?.length || 0})</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {technicalData.metaTagsAnalysis.seoMetaTags?.map((tag: any, index: number) => (
                              <div key={index} className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-2 border-blue-200 dark:border-blue-600">
                                <div className="font-medium text-blue-700 dark:text-blue-300">{tag.name}</div>
                                <div className="text-muted-foreground text-xs mt-1 break-words">{tag.content}</div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="social-meta">
                        <AccordionTrigger>
                          <span className="font-semibold">Social Meta Tags ({technicalData.metaTagsAnalysis.socialMetaTags?.length || 0})</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {technicalData.metaTagsAnalysis.socialMetaTags?.map((tag: any, index: number) => (
                              <div key={index} className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-2 border-green-200 dark:border-green-600">
                                <div className="font-medium text-green-700 dark:text-green-300">{tag.property || tag.name}</div>
                                <div className="text-muted-foreground text-xs mt-1 break-words">{tag.content}</div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        )}

        {/* Performance Section */}
        {activeTab === 'performance' && (
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
        )}

        {/* Security Section */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-500" />
                Security Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Security headers and protocol analysis for website protection</p>
            </div>
          {/* Security Headers Analysis */}
          {technicalData.securityHeaders && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Headers Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Security Score</h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`text-3xl font-bold ${getScoreColor(technicalData.securityHeaders.securityScore)}`}>
                        {technicalData.securityHeaders.securityScore}/100
                      </div>
                      <Progress value={technicalData.securityHeaders.securityScore} className="flex-1 h-3" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Security Headers</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>HTTPS:</span>
                        {technicalData.securityHeaders.hasHTTPS ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>HSTS:</span>
                        {technicalData.securityHeaders.hasHSTS ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>CSP:</span>
                        {technicalData.securityHeaders.hasCSP ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>X-Frame-Options:</span>
                        {technicalData.securityHeaders.hasXFrameOptions ? (
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
        )}

        {/* Miscellaneous Section */}
        {activeTab === 'miscellaneous' && (
          <div className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="h-6 w-6 text-purple-500" />
                Additional Findings
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Technical summary and detailed recommendations for improvement</p>
            </div>
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
        )}
        </div>
      </div>
    </div>
  );
}
