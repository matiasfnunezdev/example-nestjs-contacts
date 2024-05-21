import { ContactDocument } from '@/_domain/documents/contact/contact.document';
import { CollectionReference } from '@google-cloud/firestore';
import { Inject, Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';

/**
 * Service for managing contacts.
 */
@Injectable()
export class ContactService {
  constructor(
    @Inject(ContactDocument.collectionName)
    private contactCollection: CollectionReference<ContactDocument>,
  ) {}

  /**
   * Creates or updates a contact document.
   * 
   * @param {ContactDocument} payload - The contact data to upsert.
   * @returns {Promise<ContactDocument | undefined>} A promise that resolves to the upserted ContactDocument object or undefined if an error occurs.
   */
  async upsert(payload: ContactDocument): Promise<ContactDocument | undefined> {
    try {
      const contactId = payload.contactId || uuid();
      const docRef = this.contactCollection.doc(contactId);
      await docRef.set({
        ...payload,
        contactId,
        created: new Date().toISOString(),
      });
      const todoDoc = await docRef.get();
      const todo = todoDoc.data();
      return todo;
    } catch (error) {
      console.error('Error creating or updating document:', error);
      return undefined;
    }
  }

  /**
   * Retrieves all contact documents.
   * 
   * @returns {Promise<ContactDocument[]>} A promise that resolves to an array of ContactDocument objects.
   */
  async findAll(): Promise<ContactDocument[]> {
    try {
      const snapshot = await this.contactCollection.get();
      const contacts: ContactDocument[] = [];
      snapshot.forEach((doc) => contacts.push(doc.data() as ContactDocument));
      return contacts;
    } catch (error) {
      console.error("Error retrieving all documents:", error);
      return [];
    }
  }

  /**
   * Retrieves a contact document by its ID.
   * 
   * @param {string} contactId - The ID of the contact to retrieve.
   * @returns {Promise<ContactDocument | undefined>} A promise that resolves to the ContactDocument object or undefined if not found or an error occurs.
   */
  async findOne(contactId: string): Promise<ContactDocument | undefined> {
    try {
      const docRef = this.contactCollection.doc(contactId);
      const doc = await docRef.get();
      if (doc.exists) {
        return doc.data() as ContactDocument;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error("Error finding document:", error);
      return undefined;
    }
  }

  /**
   * Marks a contact document as deleted by setting its delete field to true.
   * 
   * @param {string} contactId - The ID of the contact to mark as deleted.
   * @returns {Promise<ContactDocument | undefined>} A promise that resolves to the updated ContactDocument object or undefined if an error occurs.
   */
  async deleteOne(contactId: string): Promise<ContactDocument | undefined> {
    try {
      const docRef = this.contactCollection.doc(contactId);
      await docRef.update({
        deleted: true,
      });
      const todoDoc = await docRef.get();
      const todo = todoDoc.data();
      return todo;
    } catch (error) {
      console.error("Error setting delete field to true:", error);
      return undefined;
    }
  }
}
