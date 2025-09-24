import mongoose from 'mongoose';
import Sweet from '../src/models/Sweet.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Sweet Model Validation', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  });

  beforeEach(async () => {
    // Only clean Sweet collection - no User needed for model tests
    await Sweet.deleteMany();
  });

  afterAll(async () => {
    await Sweet.deleteMany();
    await mongoose.connection.close();
  });

  describe('Required Fields Validation', () => {
    it('should create sweet with all required fields', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'cakes',
        price: 25.99,
        quantity: 10
      };

      const sweet = new Sweet(sweetData);
      const savedSweet = await sweet.save();

      expect(savedSweet._id).toBeDefined();
      expect(savedSweet.name).toBe('Chocolate Cake');
      expect(savedSweet.category).toBe('cakes');
      expect(savedSweet.price).toBe(25.99);
      expect(savedSweet.quantity).toBe(10);
    });

    it('should reject sweet without name', async () => {
      const sweetData = {
        category: 'cakes',
        price: 25.99,
        quantity: 10
      };

      const sweet = new Sweet(sweetData);
      
      await expect(sweet.save()).rejects.toThrow('Sweet name is required');
    });

    it('should reject sweet without category', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        price: 25.99,
        quantity: 10
      };

      const sweet = new Sweet(sweetData);
      
      await expect(sweet.save()).rejects.toThrow('Category is required');
    });

    it('should reject sweet without price', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'cakes',
        quantity: 10
      };

      const sweet = new Sweet(sweetData);
      
      await expect(sweet.save()).rejects.toThrow('Price is required');
    });

    it('should reject sweet without quantity', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'cakes',
        price: 25.99
      };

      const sweet = new Sweet(sweetData);
      
      await expect(sweet.save()).rejects.toThrow('Quantity is required');
    });

    it('should reject negative price', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'cakes',
        price: -5.99,
        quantity: 10
      };

      const sweet = new Sweet(sweetData);
      
      await expect(sweet.save()).rejects.toThrow('Price must be positive');
    });

    it('should reject negative quantity', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'cakes',
        price: 25.99,
        quantity: -5
      };

      const sweet = new Sweet(sweetData);
      
      await expect(sweet.save()).rejects.toThrow('Quantity cannot be negative');
    });
  });
});