const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin:["http://localhost:5173","https://moon-adventure-4dc47.web.app/"]
}));
app.use(express.json());

// moonAdventureLtd
// pkVf8lSVruhuii5z

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avbafwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const touristCollection = client.db("touristSpot").collection("spot");
    const countryCollection = client.db("touristSpot").collection("country");

    // country api
    app.get("/country", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    // selected country

    app.get("/selectedCountry/:country_name", async (req, res) => {
      console.log(req.params.country_name);
        const result = await touristCollection
          .find({ country_name: req.params.country_name })
          .toArray();
        res.send(result);
    });

    // spot api
    app.get("/spots", async (req, res) => {
      const cursor = touristCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristCollection.findOne(query);
      res.send(result);
    });

    app.get("/myList/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await touristCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.post("/spots", async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await touristCollection.insertOne(newSpot);
      res.send(result);
    });

    app.put("/spots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSpot = req.body;

      const spot = {
        $set: {
          image: updatedSpot.image,
          tourists_spot_name: updatedSpot.tourists_spot_name,
          country_name: updatedSpot.country_name,
          location: updatedSpot.location,
          seasonality: updatedSpot.seasonality,
          average_cost: updatedSpot.average_cost,
          travel_time: updatedSpot.travel_time,
          totalVisitorsPerYear: updatedSpot.totalVisitorsPerYear,
          short_description: updatedSpot.short_description,
        },
      };

      const result = await touristCollection.updateOne(filter, spot, options);
      res.send(result);
    });

    app.delete("/spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/test", async (req, res) => {
      res.json({ user: "tourist spot server is running" });
    });

    // Send a ping to confirm a successful connection
    // await client.db("touristSpot").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("tourist spot server is running");
});

app.listen(port, () => {
  console.log(`spot: ${port}`);
});
