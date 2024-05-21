import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from '@/services/contact/contact.service';
import { ContactDocument } from '@/_domain/documents/contact/contact.document';

describe('ContactController', () => {
  let controller: ContactController;
  let service: ContactService;

  const mockContactService = {
    findAll: jest.fn().mockResolvedValue([
      { contactId: '1', name: 'John Doe' },
      { contactId: '2', name: 'Jane Doe' },
    ]),
    findOne: jest.fn().mockResolvedValue({ contactId: '1', name: 'John Doe' }),
    upsert: jest.fn().mockResolvedValue({ contactId: '1', name: 'John Doe' }),
    deleteOne: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: mockContactService,
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of contacts', async () => {
      const result = await controller.getAll();
      expect(result).toEqual([
        { contactId: '1', name: 'John Doe' },
        { contactId: '2', name: 'Jane Doe' },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getContact', () => {
    it('should return a single contact', async () => {
      const result = await controller.getContact('1');
      expect(result).toEqual({ contactId: '1', name: 'John Doe' });
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create and return a contact', async () => {
      const contact: ContactDocument = { contactId: '1', name: 'John Doe' } as ContactDocument;
      const result = await controller.create(contact);
      expect(result).toEqual(contact);
      expect(service.upsert).toHaveBeenCalledWith(contact);
    });
  });

  describe('update', () => {
    it('should update and return the contact', async () => {
      const contact: ContactDocument = { contactId: '1', name: 'John Doe' } as ContactDocument;
      const result = await controller.update('1', contact);
      expect(result).toEqual(contact);
      expect(service.upsert).toHaveBeenCalledWith({ ...contact, contactId: '1' });
    });
  });

  describe('delete', () => {
    it('should delete the contact', async () => {
      await expect(controller.delete('1')).resolves.toBeUndefined();
      expect(service.deleteOne).toHaveBeenCalledWith('1');
    });
  });
});
