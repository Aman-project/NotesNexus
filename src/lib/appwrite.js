import { Client, Storage, Databases, ID, Account } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Standard Appwrite endpoint
    .setProject('6814e6340019a8df8b13'); // Your project ID

// Initialize Appwrite storage
const storage = new Storage(client);

// Initialize Appwrite database
const databases = new Databases(client);
const account = new Account(client);

// Constants for storage and database
const STORAGE_BUCKET_ID = '6814ef45000233bc83ec'; // Your bucket ID
const DATABASE_ID = '6814edb70004a87b215a'; // Your database ID
const NOTES_COLLECTION_ID = '6814edd5001d301527bd'; // Your collection ID

// Upload a PDF file to Appwrite storage
export const uploadPDF = async (file) => {
    try {
        const response = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file
        );
        return response;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

// Save note metadata to database
export const saveNoteMetadata = async (metadata) => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            NOTES_COLLECTION_ID,
            ID.unique(),
            metadata
        );
        return response;
    } catch (error) {
        console.error('Error saving note metadata:', error);
        throw error;
    }
};

// Get file preview URL
export const getFilePreview = (fileId) => {
    return storage.getFileView(STORAGE_BUCKET_ID, fileId);
};

// Get file download URL
export const getFileDownloadURL = (fileId) => {
    return storage.getFileDownload(STORAGE_BUCKET_ID, fileId);
};

// Get all notes
export const getAllNotes = async () => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            NOTES_COLLECTION_ID
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
};

// Check connection status
export const checkConnection = async () => {
    try {
        const healthCheck = {
            client: false,
            storage: false,
            database: false
        };
        
        // Check client connection - instead of health check, try storage or database connection
        // If either storage or database connects, we know client is working
        try {
            // Just verify we can list files - this doesn't require account access
            await storage.listFiles(STORAGE_BUCKET_ID);
            healthCheck.client = true;  // If this succeeds, client is working
            healthCheck.storage = true;
        } catch (storageError) {
            console.error('Storage connection check failed:', storageError);
            
            // Try database as fallback
            try {
                await databases.listDocuments(DATABASE_ID, NOTES_COLLECTION_ID);
                healthCheck.client = true;  // If this succeeds, client is working
                healthCheck.database = true;
            } catch (dbError) {
                console.error('Database connection check failed:', dbError);
            }
        }
        
        // If client check via storage worked but database wasn't checked, check database
        if (healthCheck.client && !healthCheck.database) {
            try {
                await databases.listDocuments(DATABASE_ID, NOTES_COLLECTION_ID);
                healthCheck.database = true;
            } catch (error) {
                console.error('Database connection check failed:', error);
            }
        }
        
        // If client check via database worked but storage wasn't checked, check storage
        if (healthCheck.client && !healthCheck.storage) {
            try {
                await storage.listFiles(STORAGE_BUCKET_ID);
                healthCheck.storage = true;
            } catch (error) {
                console.error('Storage connection check failed:', error);
            }
        }
        
        return healthCheck;
    } catch (error) {
        console.error('Connection check failed:', error);
        return {
            client: false,
            storage: false,
            database: false,
            error: error.message
        };
    }
};

export { client, storage, databases, account, STORAGE_BUCKET_ID, DATABASE_ID, NOTES_COLLECTION_ID, ID }; 