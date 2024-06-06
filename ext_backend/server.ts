import express, { Request, Response } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const port = 3000;

const MONGODB_URI = "mongodb+srv://admin:fkiptooh@cluster0.k8dhinz.mongodb.net/testDb";
const client = new MongoClient(MONGODB_URI);

// Middleware
app.use(cors());
app.use(express.json());

// Define a route to handle data submission
app.post('/sendData', async (req: Request, res: Response) => {
  try {
    await client.connect();
    const database = client.db('Cluster0');
    const collection = database.collection('testDb');

    const result = await collection.insertMany(req.body);

    if (result.insertedCount > 0) {
      res.status(200).send('Data sent to database successfully');
    } else {
      res.status(500).send('Error sending data to database: No documents inserted');
    }
  } catch (error) {
    console.error('Error sending data to database:', error);
    res.status(500).send('Error sending data to database');
  } finally {
    await client.close();
  }
});

// fetch data from db for scrapper
app.get('/fetchData', async (req: Request, res: Response) => {
    try {
      await client.connect();
      const database = client.db('Cluster0');
      const collection = database.collection('testDb');
  
      // Find all documents (you can add filters here)
      const data = await collection.find({}).toArray();
  
      if (data.length > 0) {
        res.status(200).json(data); // Send data as JSON response
      } else {
        res.status(200).send('No data found in the database');
      }
    } catch (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Error fetching data from database');
    } finally {
      await client.close();
    }
  })

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
