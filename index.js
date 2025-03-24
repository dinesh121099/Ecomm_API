import pkg from "mongoose";
const { connect, connection } = pkg;
const uri = "mongodb+srv://Ecomm:Mirafra@cluster0.tlhjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//const uri = "mongodb+srv://Ecomm:Mirafra@cluster0.tlhjs.mongodb.net/";
const db_name = "ecomm";
// importing the schema models
import ProductCategory from "./models.js";
import SignUp from "./Signupmodel.js";
import ShopModel from "./ShopprodModel.js";
//importing express
import express from "express";
// cross origin access
import cors from "cors";

// URI connection
connect(uri, { dbName: db_name })
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

// mongoose connected to DB
connection.on("connected", () => {
  console.log("mongoose connected to DB");
});
connection.on("error", (err) => {
  console.log(err.message);
});
connection.on("disconnected", () => {
  console.log("mongoose connection is disconnected");
});

// initializing express app
const app = express();
app.use(cors());

// initializing the server
app.listen(3000, () => {
  console.log("server listening on port 3000");
});

// parsing the data when being communicated from express server to mongoDB
app.use(express.urlencoded({extended : false }));
app.use(express.json());

// adding a user to ecommerce DB
app.post("/user", (request, response) => {
  email = request.body.email;
  password = request.body.password;
  displayName = request.body.displayName;
  let newSignup = new SignUp({
    email: email,
    password: password,
    displayName: displayName,
  });
  newSignup
    .save()
    .then((user) => {
      response.send(user);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Pass the Sing in data to Mongo DB and get the matching user details
app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const resp = await SignUp.findOne({ email, password });
    res.json(resp);
  } catch (err) {
    console.log("Sign In failed");
  }
});


/*
Categories
*/

// Getting product categories data from Mongo DB
app.get("/shop", async (req, res) => {
  try {
    const categories = await ShopModel.find();
    res.status(200).json({ categories});
  } catch (err) {
    res.status(500).json({ messsage: err.message });
  }
});

// For creating product categories data to Mongo DB
app.post("/shop", async (req, res) => {
  const { title, id, imageUrl } = req.body;
  try {
    let productCategory = new ProductCategory({
      title,
      id,
      imageUrl,
    });
    productCategory
      .save()
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (err) {
    res.status(500).json({ messsage: err.message });
  }
});

//For deleting the product category in Mongo DB
app.delete("/shop/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategory = await deleteOne({ id });
    res.send(deleteCategory);
  } catch (error) {
    res.send(error);
  }
});

//For updating the product category in Mongo DB
app.post("/shop", async (req, res) => {
  try {
    const categoryProduct = req.body;
    const categoryExists = await _findOne({ id: categoryProduct.id });
    console.log(categoryExists);
    if (!categoryExists) {
      // New product category
      let products = new ShopModel(categoryProduct);
      products
        .save()
        .then((resp) => {
          console.log(resp);
          res.send(resp);
        })
        .catch((error) => console.log("Not able to create product", error));
    } else {
      // Existing product category
      const { id, items } = req.body; // Destructing incoming data
      const product = items[0]; // Assuming you are sending one product at a time
      // $ represent for match
      // $set for setting the exisiting one in mongo
      const update = {
        $set: {
          "items.$": product, // aggregation
        },
      };
      let newProducts = updateOne(
        { id: id, "items.id": product.id },
        update,
        {
          upsert: false, // if upsert: true --> add new record
          // ensuring only items get updated
          // Instead of changing title or routeName, it ensures it updated only the product item
          arrayFilters: [
            {
              "items.id": product.id,
            },
          ],
        }
      ).then((resp) => {
        res.send(resp);
      });
      console.log(newProducts);
    }
  } catch (error) {
    res.send(error);
  }
});


/*
Products
*/

// Getting product data from Mongo DB
app.get("/product", async (request, response) => {
  try {
    const shopdata = await _find();
    response.json(shopdata);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});
// Creating product data from Mongo DB
app.post("/shop", async (req, res) => {
  try {
    const { name, id, imageUrl, price, categoryId } = req.body;
    let products = new ShopModel({ name, id, imageUrl, price, categoryId });
    products
      .save()
      .then((product) => {
        res.send(product);
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (err) {
    res.status(500).json({ messsage: err.message });
  }
});
// Updating product data from Mongo DB
app.put("/shop", async (req, res) => {
  try {
    const { categoryId } = req.body;
    await findOneAndUpdate({ categoryId }, req.body);
    res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {}
});
// Deleting product data from Mongo DB
app.delete("/shop/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await _deleteOne({ id });
    res.send(deleteProduct);
  } catch (error) {
    res.send(error);
  }
});


// Node JS process to get exit
process.on("SIGINT", async () => {
  await connection.close();
  process.exit(0);
});
