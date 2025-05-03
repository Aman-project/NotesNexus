import { Client, Storage, Databases, ID, Account } from 'appwrite';


const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') 
    .setProject('6814e6340019a8df8b13'); 


const storage = new Storage(client);


const databases = new Databases(client);
const account = new Account(client);


const STORAGE_BUCKET_ID = '6814ef45000233bc83ec'; //  bucket ID
const DATABASE_ID = '6814edb70004a87b215a'; //  database ID
const NOTES_COLLECTION_ID = '6814edd5001d301527bd'; //  collection ID


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


export const getFilePreview = (fileId) => {
    return storage.getFileView(STORAGE_BUCKET_ID, fileId);
};


export const getFileDownloadURL = (fileId) => {
    return storage.getFileDownload(STORAGE_BUCKET_ID, fileId);
};


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


export const checkConnection = async () => {
    try {
        const healthCheck = {
            client: false,
            storage: false,
            database: false
        };
        
        try {
            
            await storage.listFiles(STORAGE_BUCKET_ID);
            healthCheck.client = true;  
            healthCheck.storage = true;
        } catch (storageError) {
            console.error('Storage connection check failed:', storageError);
            
            // Try database as fallback
            try {
                await databases.listDocuments(DATABASE_ID, NOTES_COLLECTION_ID);
                healthCheck.client = true;  
                healthCheck.database = true;
            } catch (dbError) {
                console.error('Database connection check failed:', dbError);
            }
        }
        
       
        if (healthCheck.client && !healthCheck.database) {
            try {
                await databases.listDocuments(DATABASE_ID, NOTES_COLLECTION_ID);
                healthCheck.database = true;
            } catch (error) {
                console.error('Database connection check failed:', error);
            }
        }
        
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