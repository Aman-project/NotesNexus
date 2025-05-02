import { useState, useEffect } from 'react';
import { client, storage, databases, checkConnection } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const AppwriteDebug = () => {
  const [clientConnected, setClientConnected] = useState(false);
  const [storageConnected, setStorageConnected] = useState(false);
  const [databaseConnected, setDatabaseConnected] = useState(false);
  const [error, setError] = useState(null);
  const [testing, setTesting] = useState(false);
  const [config, setConfig] = useState({
    endpoint: client.config.endpoint,
    projectId: client.config.project
  });

  const testConnections = async () => {
    setTesting(true);
    setError(null);
    
    try {
      console.log("Starting connection test...");
      const connectionStatus = await checkConnection();
      console.log("Connection test results:", connectionStatus);
      
      setClientConnected(connectionStatus.client);
      setStorageConnected(connectionStatus.storage);
      setDatabaseConnected(connectionStatus.database);
      
      if (connectionStatus.error) {
        setError(connectionStatus.error);
      } else if (!connectionStatus.client || !connectionStatus.storage || !connectionStatus.database) {
        setError('Some Appwrite services are not connecting properly. Please check your configuration.');
      }
    } catch (err) {
      setError('Failed to check connections: ' + err.message);
      console.error('Connection test failed:', err);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    testConnections();
  }, []);

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Appwrite Connection Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm flex items-start gap-2 text-blue-800 dark:text-blue-300 mb-4">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p>This page tests connectivity to your Appwrite backend services.</p>
            <p className="mt-1">If any test fails, check your project settings, IDs, and permissions.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Client Connection:</span>
            <span className="flex items-center">
              {clientConnected ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Storage Connection:</span>
            <span className="flex items-center">
              {storageConnected ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Database Connection:</span>
            <span className="flex items-center">
              {databaseConnected ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </span>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md text-sm flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        <Button 
          onClick={testConnections} 
          disabled={testing}
          className="w-full"
        >
          {testing ? 'Testing Connections...' : 'Test Connections Again'}
        </Button>
        
        <div className="text-xs space-y-1 border border-gray-200 dark:border-gray-700 rounded-md p-3">
          <p><strong>Project ID:</strong> {config.projectId}</p>
          <p><strong>Endpoint:</strong> {config.endpoint}</p>
          <p><strong>Upload Location:</strong> The file upload functionality requires:</p>
          <ul className="list-disc list-inside pl-2">
            <li>Valid storage bucket with proper permissions</li>
            <li>Valid database and collection for storing metadata</li>
            <li>Appropriate CORS settings if using from different domains</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppwriteDebug; 