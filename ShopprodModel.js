import { Schema, model } from "mongoose";
 
const shopSchema = Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: Number,
    required: true,
  },
});
 
const ShopModel = model("shop", shopSchema);
export default ShopModel;