import { Router } from "express";
import envConfig from "../config/env.config.mjs";
import axios from "axios";
import { productResponseDto } from "../dto/productResponse.dto.mjs";

const COMPANY = envConfig.COMPANY;
const AUTHORIZATION = envConfig.AUTHORIZATION;

const router = Router();

const MAX_RETRIES = 3;
const RATE_LIMIT_DELAY = 150; // In milliseconds (7 requests per second = 1000ms / 7 ≈ 143ms)

async function fetchProducts(page, query, tax_exempt, retries = 0) {
  const queryParams = new URLSearchParams({
    page,
    ...(query && { query }),
    ...(tax_exempt && { tax_exempt }),
  }).toString();

  try {
    const response = await axios.get(
      `https://api.relbase.cl/api/v1/productos?${queryParams}`,
      {
        headers: {
          Authorization: AUTHORIZATION,
          Company: COMPANY,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (
      error.response &&
      error.response.status === 403 &&
      retries < MAX_RETRIES
    ) {
      console.error("Rate limit exceeded. Retrying...");
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY * 2));
      return fetchProducts(page, query, tax_exempt, retries + 1);
    } else {
      throw error;
    }
  }
}

// GET /api/productos
router.get("/", async (req, res) => {
  const { page = 1, query, tax_exempt, max_pages = 4 } = req.query;
  let currentPage = parseInt(page, 10);
  let maxPages = parseInt(max_pages, 10);
  let allProducts = [];
  let meta = {};

  try {
    while (true) {
      const response = await fetchProducts(currentPage, query, tax_exempt);
      const products = response.data.products;

      allProducts = allProducts.concat(
        products.map((product) => productResponseDto(product))
      );

      if (currentPage === parseInt(page, 10)) {
        meta = response.meta;
      }

      if (
        !response.meta.next_page ||
        currentPage >= meta.total_pages ||
        currentPage === maxPages
      ) {
        break;
      }

      currentPage = response.meta.next_page;

      // Ensure not to exceed the rate limit
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
    }

    allProducts.sort((a, b) => b.stock - a.stock);

    res.json({
      data: allProducts,
      meta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
