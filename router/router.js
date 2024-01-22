import express from "express";
import Product from "../database/schema.js";
import Joi from "joi";

const router = express.Router();

const addSchema = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().required(),
});

const updateSchema = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().required(),
  password: Joi.string().required(),
  status: Joi.string().valid("FOR_SALE", "SOLD_OUT"),
});

//상품 조회
router.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find().sort("-order").exec();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

//상품 등록
router.post("/products", async (req, res, next) => {
  try {
    const validation = await addSchema.validateAsync(req.body);
    const { productName, description, userName, password } = validation;

    const product = await Product.findOne().sort("-order").exec();
    const newProduct = await Product.create({
      order: product ? product.order + 1 : 1,
      productName: productName,
      description: description,
      userName: userName,
      password: password,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

//단일 상품 조회
router.get("/products/:id", async (req, res, next) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "상품을 조회할 수 없습니다." });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

//상품 수정
router.put("/products/:id", async (req, res, next) => {
  try {
    const validation = await updateSchema.validateAsync(req.body);

    const productId = req.params.id;
    const { productName, description, password, status } = validation;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "상품을 조회할 수 없습니다." });
    }

    if (product.password !== password) {
      return res.status(404).json({ message: "비밀번호가 틀렸습니다." });
    }

    product.productName = productName;
    product.description = description;
    product.password = password;
    product.status = status;
    product.date = new Date();

    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
});

//상품 삭제
router.delete("/products/:id", async (req, res, next) => {
  const productId = req.params.id;
  const password = req.body.password;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "상품을 조회할 수 없습니다." });
    }

    if (product.password !== password) {
      return res.status(404).json({ message: "비밀번호가 틀렸습니다." });
    }

    await product.remove();
    res.json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    next(error);
  }
});

export default router;
