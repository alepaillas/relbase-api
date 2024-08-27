import { Router } from "express";
import envConfig from "../config/env.config.mjs";
import axios from "axios";
import { clientResponseDto } from "../dto/clientResponse.dto.mjs";

const COMPANY = envConfig.COMPANY;
const AUTHORIZATION = envConfig.AUTHORIZATION;

const router = Router();

const MAX_RETRIES = 3;
const RATE_LIMIT_DELAY = 150; // In milliseconds (7 requests per second = 1000ms / 7 ≈ 143ms)

async function fetchclients(page, query, retries = 0) {
  const queryParams = new URLSearchParams({
    page,
    ...(query && { query }),
  }).toString();

  try {
    const response = await axios.get(
      `https://api.relbase.cl/api/v1/clientes?${queryParams}`,
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
      return fetchclients(page, query, retries + 1);
    } else {
      throw error;
    }
  }
}

// GET /api/clientes
router.get("/", async (req, res) => {
  const { page = 1, query, max_pages = 4 } = req.query;
  let currentPage = parseInt(page, 10);
  let maxPages = parseInt(max_pages, 10);
  let allclients = [];
  let meta = {};

  try {
    while (true) {
      const response = await fetchclients(currentPage, query);
      const clients = response.data.customers;

      allclients = allclients.concat(
        clients.map((client) => clientResponseDto(client))
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

    allclients.sort((a, b) => b.stock - a.stock);

    res.json({
      data: allclients,
      meta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

export default router;
