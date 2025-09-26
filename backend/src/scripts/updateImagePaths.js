import mongoose from 'mongoose';
import Sweet from '../models/Sweet.js';
import dotenv from 'dotenv';

dotenv.config();

const updateImagePaths = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sweetshop';
    await mongoose.connect(mongoUri);
    console.log('🔗 Connected to MongoDB');

    // Update all records with old image paths
    const result = await Sweet.updateMany(
      { image: { $regex: '^/src/assets/' } }, // Find images starting with /src/assets/
      [
        {
          $set: {
            image: {
              $replaceOne: {
                input: "$image",
                find: "/src/assets/",
                replacement: "/"
              }
            }
          }
        }
      ]
    );

    console.log(`✅ Updated ${result.modifiedCount} sweet image paths`);

    // Also update any records with the old default placeholder
    const placeholderResult = await Sweet.updateMany(
      { image: '/src/assets/placeholder.jpg' },
      { $set: { image: '/placeholder.jpg' } }
    );

    console.log(`✅ Updated ${placeholderResult.modifiedCount} placeholder image paths`);

    await mongoose.disconnect();
    console.log('✅ Database migration completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

updateImagePaths();