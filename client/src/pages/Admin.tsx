import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter,
  Search,
  FileDown,
  Clipboard,
  BarChart3,
  FileText,
  ShieldCheck,
  UserCheck,
  ListFilter
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Assessment, FormData } from '@shared/schema';

// Define type for the admin API response
interface AdminAssessmentResponse {
  totalCount: number;
  completeCount: number;
  incompleteCount: number;
  data: Assessment[];
}

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendLabel 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend !== undefined && (
          <div className="flex items-center pt-2">
            {trend > 0 ? (
              <ChevronUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <ChevronDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend)}% {trendLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Date formatting utility
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Prepare assessment data for CSV export
const prepareAssessmentsForCSV = (assessments: Assessment[]) => {
  if (!assessments || assessments.length === 0) return '';
  
  // Extract all possible keys from the data
  const allKeys = new Set<string>();
  assessments.forEach(assessment => {
    if (assessment.data) {
      // Flatten data structure for CSV
      const data = assessment.data as FormData;
      Object.keys(data).forEach(section => {
        const sectionData = data[section as keyof FormData];
        if (sectionData && typeof sectionData === 'object') {
          Object.keys(sectionData).forEach(key => {
            allKeys.add(`${section}_${key}`);
          });
        }
      });
    }
  });
  
  // Create headers
  const headers = ['id', 'createdAt', 'updatedAt', 'completed', ...Array.from(allKeys)];
  
  // Create rows
  const rows = assessments.map(assessment => {
    const row: Record<string, any> = {
      id: assessment.id,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
      completed: assessment.completed
    };
    
    // Flatten data structure for each assessment
    if (assessment.data) {
      const data = assessment.data as FormData;
      Object.keys(data).forEach(section => {
        const sectionData = data[section as keyof FormData];
        if (sectionData && typeof sectionData === 'object') {
          Object.keys(sectionData).forEach(key => {
            const value = sectionData[key as keyof typeof sectionData];
            row[`${section}_${key}`] = Array.isArray(value) ? JSON.stringify(value) : value;
          });
        }
      });
    }
    
    return row;
  });
  
  // Convert to CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        const value = row[header];
        return value === undefined ? '' : String(value).includes(',') ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

// Download data as CSV
const downloadCSV = (data: string, filename: string) => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Admin: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

  // Fetch all assessments from the API
  const { data: apiResponse, isLoading, error } = useQuery<AdminAssessmentResponse>({
    queryKey: ['/api/admin/assessments'],
    queryFn: async () => {
      const response = await fetch('/api/admin/assessments', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }
      return await response.json() as AdminAssessmentResponse;
    },
  });

  // Filter assessments based on search and completion filter
  const filteredAssessments = apiResponse?.data?.filter((assessment: Assessment) => {
    const matchesSearch = searchTerm === '' || 
      JSON.stringify(assessment.data).toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterCompleted === null) return matchesSearch;
    return matchesSearch && assessment.completed === filterCompleted;
  }) || [];

  // Calculate completion rate for stats
  const completionRate = apiResponse 
    ? apiResponse.totalCount > 0 
      ? Math.round((apiResponse.completeCount / apiResponse.totalCount) * 100) 
      : 0
    : 0;

  // Handler for downloading assessment data
  const handleDownloadCSV = () => {
    if (!apiResponse?.data) return;
    
    const csvData = prepareAssessmentsForCSV(filteredAssessments);
    downloadCSV(csvData, `gbv-assessments-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Handler for downloading a single assessment
  const handleDownloadSingleAssessment = (assessment: Assessment) => {
    const jsonStr = JSON.stringify(assessment.data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `assessment-${assessment.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                GBV Assessment Admin
              </h1>
            </div>
            <Button 
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => window.location.href = '/'}
            >
              <FileText className="h-4 w-4" />
              Return to Main App
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
              title="Total Assessments"
              value={apiResponse?.totalCount || 0}
              icon={<Clipboard className="h-5 w-5 text-blue-600" />}
            />
            <StatsCard
              title="Completed Assessments"
              value={apiResponse?.completeCount || 0}
              icon={<UserCheck className="h-5 w-5 text-green-600" />}
              trend={5}
              trendLabel="from last month"
            />
            <StatsCard
              title="Incomplete Assessments"
              value={apiResponse?.incompleteCount || 0}
              icon={<ListFilter className="h-5 w-5 text-orange-500" />}
            />
            <StatsCard
              title="Completion Rate"
              value={`${completionRate}%`}
              icon={<BarChart3 className="h-5 w-5 text-blue-600" />}
              description="Percentage of assessments completed"
            />
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Assessments</TabsTrigger>
                <TabsTrigger value="complete">Completed</TabsTrigger>
                <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search assessments..."
                    className="pl-9 w-[200px] md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  title="Filter"
                  onClick={() => setFilterCompleted(filterCompleted === null ? true : filterCompleted ? false : null)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="default" 
                  className="gap-2"
                  onClick={handleDownloadCSV}
                  disabled={!apiResponse || apiResponse.data.length === 0}
                >
                  <FileDown className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Records</CardTitle>
                  <CardDescription>
                    View and manage all psychosocial assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-500">
                      Error loading assessments. Please try again.
                    </div>
                  ) : (
                    <Table>
                      <TableCaption>A list of all assessments.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAssessments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">No assessments found</TableCell>
                          </TableRow>
                        ) : (
                          filteredAssessments.map((assessment) => (
                            <TableRow key={assessment.id}>
                              <TableCell className="font-medium">{assessment.id}</TableCell>
                              <TableCell>{formatDate(assessment.createdAt.toString())}</TableCell>
                              <TableCell>{formatDate(assessment.updatedAt.toString())}</TableCell>
                              <TableCell>
                                {assessment.completed ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                    Completed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                                    In Progress
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDownloadSingleAssessment(assessment)}
                                >
                                  <span className="sr-only">Download</span>
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={4}>Total</TableCell>
                          <TableCell>{filteredAssessments.length}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Displaying {filteredAssessments.length} of {apiResponse?.totalCount || 0} assessments
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="complete">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Assessments</CardTitle>
                  <CardDescription>
                    View assessments that have been fully completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssessments.filter((a: Assessment) => a.completed).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">No completed assessments found</TableCell>
                        </TableRow>
                      ) : (
                        filteredAssessments.filter((a: Assessment) => a.completed).map((assessment: Assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">{assessment.id}</TableCell>
                            <TableCell>{formatDate(assessment.createdAt.toString())}</TableCell>
                            <TableCell>{formatDate(assessment.updatedAt.toString())}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDownloadSingleAssessment(assessment)}
                              >
                                <span className="sr-only">Download</span>
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="incomplete">
              <Card>
                <CardHeader>
                  <CardTitle>Incomplete Assessments</CardTitle>
                  <CardDescription>
                    View assessments that are still in progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssessments.filter((a: Assessment) => !a.completed).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">No incomplete assessments found</TableCell>
                        </TableRow>
                      ) : (
                        filteredAssessments.filter((a: Assessment) => !a.completed).map((assessment: Assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">{assessment.id}</TableCell>
                            <TableCell>{formatDate(assessment.createdAt.toString())}</TableCell>
                            <TableCell>{formatDate(assessment.updatedAt.toString())}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDownloadSingleAssessment(assessment)}
                              >
                                <span className="sr-only">Download</span>
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>GBV Psychosocial Assessment Tool - Admin Dashboard</p>
            <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin;