export class ContactDocument {
  static collectionName = 'contact';

  contactId?: string;
  name?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
  created?: string;
  deleted?: boolean;
}
