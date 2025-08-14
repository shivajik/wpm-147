import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiCall } from "@/lib/queryClient";
import { insertWebsiteSchema, type InsertWebsite, type Client } from "@shared/schema";
import { Globe, Key, Settings, Plus, UserPlus, AlertCircle } from "lucide-react";
import AddClientDialog from "@/components/clients/add-client-dialog";

interface AddWebsiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Enhanced validation schema for WordPress websites
const websiteFormSchema = insertWebsiteSchema.extend({
  name: z.string().min(1, "Website name is required"),
  url: z.string().url("Please enter a valid URL (e.g., https://example.com)"),
  wpAdminUsername: z.string().optional(),
  wpAdminPassword: z.string().optional(),
  wrmApiKey: z.string().optional(),
  clientId: z.number({ required_error: "Please select a client" }),
}).refine((data) => {
  // Either admin credentials or WP Remote Manager API key should be provided
  const hasCredentials = data.wpAdminUsername && data.wpAdminPassword;
  const hasWrmApiKey = data.wrmApiKey;
  return hasCredentials || hasWrmApiKey;
}, {
  message: "Please provide either WordPress admin credentials or a WP Remote Manager API key",
  path: ["wpAdminUsername"], // Show error on username field
});

export default function AddWebsiteDialog({ open, onOpenChange }: AddWebsiteDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  type WebsiteFormData = z.infer<typeof websiteFormSchema>;
  
  const form = useForm<WebsiteFormData>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      name: "",
      url: "",
      wpAdminUsername: "",
      wpAdminPassword: "",
      wrmApiKey: "",
      clientId: undefined,
      healthStatus: "good",
      uptime: "100%",
      connectionStatus: "disconnected",
    },
  });

  // Fetch clients for the dropdown
  const { data: clients, isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: open,
  });

  // Auto-select the newest client when the list updates (after adding a new client)
  useEffect(() => {
    if (clients && clients.length > 0 && !form.getValues().clientId) {
      // Sort clients by id (assuming higher id = newer) and select the latest one
      const newestClient = clients.reduce((prev, current) => 
        (current.id > prev.id) ? current : prev
      );
      form.setValue('clientId', newestClient.id);
    }
  }, [clients, form]);

  // Helper function to check which tabs have errors
  const getTabErrors = () => {
    const errors = form.formState.errors;
    return {
      basic: !!(errors.name || errors.url || errors.clientId),
      credentials: !!(errors.wpAdminUsername || errors.wpAdminPassword || errors.wrmApiKey),
      settings: !!(errors.wpVersion || errors.healthStatus)
    };
  };

  // Auto-switch to tab with errors when validation fails
  const handleSubmitError = () => {
    const tabErrors = getTabErrors();
    if (tabErrors.basic) {
      setActiveTab("basic");
    } else if (tabErrors.credentials) {
      setActiveTab("credentials");
    } else if (tabErrors.settings) {
      setActiveTab("settings");
    }
  };

  const createWebsiteMutation = useMutation({
    mutationFn: async (data: WebsiteFormData) => {
      return await apiCall("/api/websites", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: async (newWebsite) => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      toast({
        title: "Website added successfully",
        description: "WordPress data is being fetched in the background. This may take a few moments.",
      });
      
      // Trigger immediate data sync for the new website
      try {
        await apiCall(`/api/websites/${newWebsite.id}/sync`, {
          method: "POST",
        });
        
        // Pre-fetch the WordPress data to populate the cache
        queryClient.prefetchQuery({
          queryKey: [`/api/websites/${newWebsite.id}/wordpress-data`],
        });
        
        toast({
          title: "Data sync initiated",
          description: "WordPress data is being processed. You can view the website details now.",
        });
      } catch (error) {
        // Silent error - sync will happen on page load anyway
        console.warn('Auto-sync failed, data will be fetched when user visits the page');
      }
      
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      // Check for validation errors and guide user to correct tab
      const tabErrors = getTabErrors();
      let errorMessage = error?.message || "Please check the form for errors.";
      
      if (tabErrors.basic || tabErrors.credentials || tabErrors.settings) {
        errorMessage = "Please check the highlighted tabs for required fields and fix any errors.";
      }

      toast({
        title: "Failed to add website",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Auto-switch to first tab with errors
      handleSubmitError();
    },
  });

  const onSubmit = (data: WebsiteFormData) => {
    // Format URL to ensure it has protocol
    let formattedUrl = data.url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    createWebsiteMutation.mutate({
      ...data,
      url: formattedUrl,
    });
  };

  const handleCancel = () => {
    form.reset();
    setActiveTab("basic");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] sm:max-h-[85vh] flex flex-col p-0 m-2 sm:m-4 overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Globe className="h-5 w-5" />
            Add WordPress Website
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Add a new WordPress website for maintenance management. You can connect using admin credentials or a Worker plugin connection key.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-4 sm:px-6 min-h-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, handleSubmitError)} className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-2 pb-2 min-h-0" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                <TabsTrigger 
                  value="basic" 
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 relative ${
                    getTabErrors().basic ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' : ''
                  }`}
                  data-testid="tab-basic"
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Basic Info</span>
                  <span className="sm:hidden">Basic</span>
                  {getTabErrors().basic && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="credentials" 
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 relative ${
                    getTabErrors().credentials ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' : ''
                  }`}
                  data-testid="tab-credentials"
                >
                  <Key className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Connection</span>
                  <span className="sm:hidden">Connect</span>
                  {getTabErrors().credentials && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 relative ${
                    getTabErrors().settings ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' : ''
                  }`}
                  data-testid="tab-settings"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  Settings
                  {getTabErrors().settings && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-3 sm:space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Website Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="My Client's Website"
                          className="text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        A descriptive name for this WordPress website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Website URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          className="text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        The full URL of the WordPress website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Client</FormLabel>
                      {Array.isArray(clients) && clients.length > 0 ? (
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value ? field.value.toString() : ""}
                          disabled={clientsLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="text-sm sm:text-base">
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                <span className="truncate">{client.name} ({client.email})</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <UserPlus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              <span className="text-sm text-orange-800 dark:text-orange-200">
                                {clientsLoading ? "Loading clients..." : "No clients found. Please add a client first."}
                              </span>
                            </div>
                            {!clientsLoading && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setIsAddClientDialogOpen(true)}
                                className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900"
                                data-testid="button-add-client-from-website"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Client
                              </Button>
                            )}
                          </div>
                          <input type="hidden" {...field} />
                        </div>
                      )}
                      <FormDescription className="text-xs sm:text-sm">
                        Which client owns this website?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="credentials" className="space-y-2 sm:space-y-3 mt-3">
                <div className="space-y-2 sm:space-y-3">
                  <div className="border rounded-lg p-2 sm:p-3">
                    <h4 className="font-medium mb-2 text-sm sm:text-base">WordPress Admin Credentials</h4>
                    <div className="space-y-2 sm:space-y-3">
                      <FormField
                        control={form.control}
                        name="wpAdminUsername"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm">WordPress Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="admin"
                                className="text-xs sm:text-sm h-8 sm:h-9"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wpAdminPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm">WordPress Application Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="xxxx xxxx xxxx xxxx"
                                className="text-xs sm:text-sm h-8 sm:h-9"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Use Application Password, not regular login password
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-500 py-1">OR</div>

                  <div className="border rounded-lg p-2 sm:p-3 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <h4 className="font-medium mb-2 text-green-800 dark:text-green-200 text-xs sm:text-sm">
                      WP Remote Manager Plugin (Recommended)
                    </h4>
                    <FormField
                      control={form.control}
                      name="wrmApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">API Key</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter WP Remote Manager API key"
                              className="text-xs sm:text-sm h-8 sm:h-9"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription className="text-[10px] sm:text-xs mt-1">
                            Complete WordPress management features
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-2 sm:p-3">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 text-xs sm:text-sm">
                    Setup Instructions:
                  </h4>
                  <ol className="text-[10px] sm:text-xs text-blue-800 dark:text-blue-200 space-y-0.5 list-decimal list-inside mb-2">
                    <li>Install <strong>WP Remote Manager</strong> plugin</li>
                    <li>Go to <strong>Settings → WP Remote Manager</strong></li>
                    <li>Generate and copy API key</li>
                    <li>Paste key above</li>
                  </ol>
                  <div className="p-1.5 sm:p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <p className="text-[10px] sm:text-xs text-green-800 dark:text-green-200">
                      <strong>Alternative:</strong> Use Application Passwords in <strong>Users → Profile</strong>
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-2 sm:space-y-3 mt-3">
                <FormField
                  control={form.control}
                  name="wpVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">WordPress Version (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="6.4.2"
                          className="text-sm sm:text-base"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Current WordPress version (will be auto-detected if left empty)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Initial Health Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-sm sm:text-base">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs sm:text-sm">
                        Initial health status (can be updated later)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

              </div>
            </form>
          </Form>
        </div>
        
        {/* Fixed footer buttons outside of scrollable area */}
        <div className="flex-shrink-0 border-t bg-background px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createWebsiteMutation.isPending}
              className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createWebsiteMutation.isPending}
              onClick={form.handleSubmit(onSubmit, handleSubmitError)}
              className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
              data-testid="button-submit-website"
            >
              {createWebsiteMutation.isPending ? "Adding..." : "Add Website"}
            </Button>
          </div>
        </div>
      </DialogContent>
      
      {/* Add Client Dialog */}
      <AddClientDialog 
        open={isAddClientDialogOpen} 
        onOpenChange={(open) => {
          setIsAddClientDialogOpen(open);
          if (!open) {
            // Refresh clients when dialog is closed
            queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
          }
        }} 
      />
    </Dialog>
  );
}