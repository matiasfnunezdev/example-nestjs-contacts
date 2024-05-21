import { ContactDocument } from '@/_domain/documents/contact/contact.document';
import { ContactService } from '@/services/contact/contact.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';

/**
 * Controller for managing contacts.
 */
@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
  ) {}

  /**
   * Retrieves all contacts.
   * 
   * @returns {Promise<ContactDocument[]>} A promise that resolves to an array of ContactDocument objects.
   */
  @Get()
  @HttpCode(200)
  async getAll(): Promise<ContactDocument[]> {
    const result = await this.contactService.findAll();
    return result;
  }

  /**
   * Retrieves a contact by its ID.
   * 
   * @param {string} id - The ID of the contact to retrieve.
   * @returns {Promise<ContactDocument>} A promise that resolves to the ContactDocument object.
   */
  @Get(':id')
  @HttpCode(200)
  async getContact(@Param('id') id: string): Promise<ContactDocument> {
    const result = await this.contactService.findOne(id);
    return result;
  }

  /**
   * Creates a new contact.
   * 
   * @param {ContactDocument} body - The contact data to create.
   * @returns {Promise<ContactDocument>} A promise that resolves to the created ContactDocument object.
   */
  @Post()
  @HttpCode(200)
  async create(@Body() body: ContactDocument): Promise<ContactDocument> {
    const result = await this.contactService.upsert(body);
    return result;
  }

  /**
   * Updates an existing contact.
   * @param {string} id - The ID of the contact to update.
   * @param {ContactDocument} body - The contact data to update.
   * @returns {Promise<ContactDocument>} A promise that resolves to the updated ContactDocument object.
   */
  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() body: ContactDocument): Promise<ContactDocument> {
    const result = await this.contactService.upsert({...body, contactId: id});
    return result;
  }

  /**
   * Deletes a contact by setting its delete field to true.
   * 
   * @param {string} id - The ID of the contact to delete.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.contactService.deleteOne(id);
    return;
  }
}
