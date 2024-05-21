import { ContactDocument } from "@/_domain/documents/contact/contact.document";

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  ContactDocument.collectionName,
];
