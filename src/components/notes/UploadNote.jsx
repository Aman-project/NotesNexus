import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cloud, File, FileType, UploadIcon, AlertTriangle, CheckCircle2, BookText, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { uploadPDF, saveNoteMetadata, storage, STORAGE_BUCKET_ID, ID } from "@/lib/appwrite";
import AppwriteDebug from "./AppwriteDebug";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  file: z.any()
    .refine(file => file && typeof file === 'object' && 'name' in file, "Please upload a file")
    .refine(file => file?.type === "application/pdf", "Only PDF files are allowed")
    .refine(file => file?.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
});

// Sample categories for suggestions
const SUGGESTED_CATEGORIES = [
  "Programming", "Design", "Mathematics", 
  "Physics", "Chemistry", "Biology", 
  "History", "Literature", "Medicine",
  "Computer Science", "Engineering", "Economics"
];

const UploadNote = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [uploadedNote, setUploadedNote] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadError, setUploadError] = useState(null);
  const [uploadDetails, setUploadDetails] = useState(null);
  const [testFile, setTestFile] = useState(null);
  const [isTestingUpload, setIsTestingUpload] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      file: undefined,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setUploadError(null);
    setUploadDetails(null);
    
    const details = {
      steps: [],
      errors: []
    };
    
    try {
      if (!data.file) {
        throw new Error("No file selected. Please select a PDF file.");
      }
      
      details.steps.push(`Starting file upload: ${data.file.name} (${data.file.size} bytes, ${data.file.type})`);
      console.log(`Starting file upload: ${data.file.name} (${data.file.size} bytes, ${data.file.type})`);
      
      // Upload file to Appwrite storage
      try {
        const fileUploadResponse = await uploadPDF(data.file);
        details.steps.push(`File uploaded successfully. File ID: ${fileUploadResponse.$id}`);
        console.log("File uploaded successfully:", fileUploadResponse);
        
        // Create note metadata
        const noteMetadata = {
          title: data.title,
          category: data.category,
          description: data.description,
          fileId: fileUploadResponse.$id,
          fileName: data.file.name,
          fileSize: data.file.size,
          mimeType: data.file.type,
          uploadedAt: new Date().toISOString(),
        };
        
        details.steps.push(`Preparing to save metadata with File ID: ${fileUploadResponse.$id}`);
        console.log("Saving metadata:", noteMetadata);
        
        try {
          // Save note metadata to database
          const noteResponse = await saveNoteMetadata(noteMetadata);
          details.steps.push(`Metadata saved successfully. Document ID: ${noteResponse.$id}`);
          console.log("Metadata saved successfully:", noteResponse);
          
          // Save the uploaded note information
          setUploadedNote({
            ...noteResponse,
            fileName: data.file.name,
          });
          
          // Show success dialog
          setIsSuccessDialogOpen(true);
          
          // Reset form
          form.reset();
          
          toast({
            title: "Success!",
            description: "Your note has been uploaded successfully.",
            variant: "success",
          });
        } catch (metadataError) {
          details.errors.push(`Metadata save failed: ${metadataError.message || 'Unknown error'}`);
          console.error("Error saving metadata:", metadataError);
          throw new Error(`Failed to save note metadata: ${metadataError.message}`);
        }
      } catch (fileError) {
        details.errors.push(`File upload failed: ${fileError.message || 'Unknown error'}`);
        console.error("Error uploading file:", fileError);
        throw new Error(`Failed to upload file: ${fileError.message}`);
      }
    } catch (error) {
      details.errors.push(`Overall error: ${error.message || 'Unknown error'}`);
      console.error("Error uploading note:", error);
      setUploadError(error.message || "There was an error uploading your note. Please try again.");
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadDetails(details);
      setIsSubmitting(false);
    }
  };

  const testFileUpload = async () => {
    if (!testFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to test upload",
        variant: "destructive",
      });
      return;
    }

    setIsTestingUpload(true);
    setTestResult(null);

    try {
      console.log("Testing direct file upload:", testFile.name);
      
      // Create a direct file upload to test storage permissions
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        testFile
      );
      
      console.log("Test upload successful:", response);
      
      setTestResult({
        success: true,
        message: "File upload test successful!",
        details: `File uploaded with ID: ${response.$id}`,
      });
      
      toast({
        title: "Test successful!",
        description: "The file was successfully uploaded to Appwrite storage.",
        variant: "success",
      });
    } catch (error) {
      console.error("Test upload failed:", error);
      
      setTestResult({
        success: false,
        message: "File upload test failed.",
        details: error.message,
      });
      
      toast({
        title: "Test failed",
        description: error.message || "There was an error uploading the test file.",
        variant: "destructive",
      });
    } finally {
      setIsTestingUpload(false);
    }
  };

  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <BookText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Add to the Knowledge Library</h1>
        <p className="text-muted-foreground text-center max-w-xl">
          Share your valuable learning resources with others by uploading PDF notes to our collection.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-md border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <CardTitle className="flex items-center gap-2">
                <UploadIcon className="h-5 w-5" /> 
                Upload Your Note
              </CardTitle>
              <CardDescription>
                Fill in the details below and select your PDF file to share.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              {uploadError && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-800 dark:text-red-300">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Upload Error</p>
                      <p className="text-sm mt-1">{uploadError}</p>
                      
                      {uploadDetails && uploadDetails.errors.length > 0 && (
                        <div className="mt-2 text-xs">
                          <p className="font-semibold">Error Details:</p>
                          <ul className="list-disc list-inside mt-1">
                            {uploadDetails.errors.map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {uploadDetails && uploadDetails.steps.length > 0 && (
                        <div className="mt-2 text-xs">
                          <p className="font-semibold">Steps Completed:</p>
                          <ol className="list-decimal list-inside mt-1">
                            {uploadDetails.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Machine Learning Fundamentals" {...field} />
                          </FormControl>
                          <FormDescription>A clear, descriptive title for your note</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="E.g., Programming, Design, Math" 
                              list="category-suggestions"
                              {...field} 
                            />
                          </FormControl>
                          <datalist id="category-suggestions">
                            {SUGGESTED_CATEGORIES.map((category) => (
                              <option key={category} value={category} />
                            ))}
                          </datalist>
                          <FormDescription>Choose an existing category or create a new one</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a brief summary of what this note contains..." 
                            className="h-24 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Help others understand what knowledge they'll gain</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>PDF File</FormLabel>
                        <FormControl>
                          <div className={cn(
                            "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
                            "border-primary/20 hover:border-primary/40",
                            "bg-primary/5 hover:bg-primary/10"
                          )}>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  console.log("File selected:", file.name, file.size, file.type);
                                  onChange(file);
                                }
                              }}
                              {...fieldProps}
                            />
                            <div className="flex flex-col items-center justify-center gap-3 text-center">
                              {value ? (
                                <>
                                  <FileType className="h-16 w-16 text-primary" />
                                  <div>
                                    <p className="font-medium text-lg text-foreground">
                                      {value.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {(value.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Click again to change file
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Cloud className="h-16 w-16 text-primary/50" />
                                  <div>
                                    <p className="font-medium text-lg text-foreground">
                                      Drop your PDF file here or click to browse
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      PDF files only (maximum 10MB)
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UploadIcon className="h-5 w-5" />
                        Upload Note
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Tips for Great Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Use a descriptive title that clearly indicates the content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Choose an appropriate category for easier discovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Write a detailed description to help others understand the content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span>Ensure your PDF is well-formatted and easy to read</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Collapsible
            open={isDebugOpen}
            onOpenChange={setIsDebugOpen}
            className="shadow-md rounded-lg border"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-between p-4 rounded-lg">
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Advanced Debugging
                </span>
                <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                  {isDebugOpen ? "Hide" : "Show"}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 space-y-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                If you're experiencing upload issues, you can test the direct file upload functionality below.
              </p>
              
              <div className="border rounded p-4 bg-background">
                <h3 className="text-sm font-medium mb-2">Test File Upload</h3>
                
                <div className="mb-3">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log("Test file selected:", file.name, file.size, file.type);
                        setTestFile(file);
                      }
                    }}
                  />
                </div>
                
                <Button 
                  onClick={testFileUpload}
                  disabled={isTestingUpload || !testFile}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {isTestingUpload ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Testing Upload...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UploadIcon className="h-4 w-4" />
                      Test Upload
                    </span>
                  )}
                </Button>
                
                {testResult && (
                  <div className={`mt-4 p-4 rounded-md border ${testResult.success ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'}`}>
                    <div className="flex items-start">
                      {testResult.success ? (
                        <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{testResult.message}</p>
                        <p className="text-sm mt-1">{testResult.details}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab("debug")}
              >
                View Connection Status
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      
      {activeTab === "debug" && (
        <div className="mt-8">
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("upload")}
            className="mb-4"
          >
            &larr; Back to Upload Form
          </Button>
          <AppwriteDebug />
        </div>
      )}
      
      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Note Uploaded Successfully!</DialogTitle>
            <DialogDescription>
              Your note has been uploaded and is now available in the notes collection.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-sm">
                <File className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{uploadedNote?.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {uploadedNote?.fileName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Category: <span className="font-medium">{uploadedNote?.category}</span>
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsSuccessDialogOpen(false);
                navigate("/notes");
              }}
            >
              View All Notes
            </Button>
            <Button
              onClick={() => {
                setIsSuccessDialogOpen(false);
              }}
            >
              Upload Another
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadNote; 