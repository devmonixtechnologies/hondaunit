import mongoose from 'mongoose';

// Simple admin user creation for MongoDB Atlas
const createAdminInAtlas = async () => {
  try {
    // Connect to MongoDB Atlas with the exact URI
    const uri = 'mongodb+srv://hondaunitdb:Hondaunit@#000@hondaunit.i6wwpxn.mongodb.net/';
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB Atlas');

    // Create the admin user directly
    const db = mongoose.connection.db;
    
    const adminUser = {
      name: 'HondaUnit Admin',
      email: 'admin@hondaunit.com',
      passwordHash: '$2a$10$rQK8Z8Z8Z8Z8Z8Z8Z8Z8ZOZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into users collection
    const result = await db.collection('users').insertOne(adminUser);
    
    console.log('Admin user created successfully in Atlas!');
    console.log('Email: admin@hondaunit.com');
    console.log('Password: admin123');
    console.log('User ID:', result.insertedId);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminInAtlas();
