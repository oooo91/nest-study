import express from "express";
import Product from "../database/schema.js";
import Joi from "joi";

const router = express.Router();

const addSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  author: Joi.string().required(),
  password: Joi.string().required(),
});

const updateSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  password: Joi.string().required(),
  status: Joi.string().valid("FOR_SALE", "SOLD_OUT"),
});

//상품 조회
router.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find().sort("-createdAt");
    res.json(products);
  } catch (error) {
    next(error);
  }
});

//상품 등록
router.post("/products", async (req, res, next) => {
  try {
    const validation = await addSchema.validateAsync(req.body);
    const { title, content, author, password } = validation;

    const newProduct = await Product.create({
      title: title,
      content: content,
      author: author,
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
    const { title, content, password, status } = validation;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "상품을 조회할 수 없습니다." });
    }

    if (product.password !== password) {
      return res.status(404).json({ message: "비밀번호가 틀렸습니다." });
    }

    product.title = title;
    product.content = content;
    product.status = status;

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

    await product.deleteOne({_id : productId});
    res.json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    next(error);
  }
});

export default router;
