import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { CollectionReference, DocumentData, DocumentSnapshot } from '@google-cloud/firestore';
import { ContactDocument } from '@/_domain/documents/contact/contact.document';
import { v4 as uuid } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-uuid'),
}));

describe('ContactService', () => {
  let service: ContactService;
  let mockCollection: Partial<CollectionReference<ContactDocument>>;

  beforeEach(async () => {
    mockCollection = {
      doc: jest.fn().mockReturnValue({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
      } as Partial<DocumentSnapshot<ContactDocument>> & {
        set: jest.Mock,
        get: jest.Mock,
        update: jest.Mock,
      }),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: ContactDocument.collectionName,
          useValue: mockCollection,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsert', () => {
    it('should create or update a contact', async () => {
      const payload: ContactDocument = { contactId: '1', name: 'John Doe' } as ContactDocument;
      const mockDoc = {
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => payload,
        } as DocumentSnapshot<ContactDocument>),
      };
      (mockCollection.doc as jest.Mock).mockReturnValue(mockDoc);

      const result = await service.upsert(payload);
      expect(result).toEqual(payload);
      expect(mockDoc.set).toHaveBeenCalledWith({
        ...payload,
        contactId: '1',
        created: expect.any(String),
      });
      expect(mockDoc.get).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of contacts', async () => {
      const contacts: ContactDocument[] = [
        { contactId: '1', name: 'John Doe' },
        { contactId: '2', name: 'Jane Doe' },
      ] as ContactDocument[];

      const mockSnapshot = {
        forEach: (callback: (doc: DocumentSnapshot<DocumentData>) => void) =>
          contacts.forEach((contact) => callback({
            data: () => contact,
          } as DocumentSnapshot<DocumentData>)),
      };

      (mockCollection.get as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await service.findAll();
      expect(result).toEqual(contacts);
      expect(mockCollection.get).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single contact', async () => {
      const contact: ContactDocument = { contactId: '1', name: 'John Doe' } as ContactDocument;
      const mockDoc = {
        exists: true,
        data: () => contact,
      } as DocumentSnapshot<ContactDocument>;

      (mockCollection.doc as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await service.findOne('1');
      expect(result).toEqual(contact);
      expect(mockCollection.doc).toHaveBeenCalledWith('1');
    });

    it('should return undefined if contact does not exist', async () => {
      const mockDoc = {
        exists: false,
      } as DocumentSnapshot<ContactDocument>;

      (mockCollection.doc as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await service.findOne('1');
      expect(result).toBeUndefined();
      expect(mockCollection.doc).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteOne', () => {
    it('should mark a contact as deleted', async () => {
      const contact: ContactDocument = { contactId: '1', name: 'John Doe', deleted: true } as ContactDocument;
      const mockDoc = {
        update: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => contact,
        } as DocumentSnapshot<ContactDocument>),
      };

      (mockCollection.doc as jest.Mock).mockReturnValue(mockDoc);

      const result = await service.deleteOne('1');
      expect(result).toEqual(contact);
      expect(mockDoc.update).toHaveBeenCalledWith({ deleted: true });
      expect(mockDoc.get).toHaveBeenCalled();
    });
  });
});
