import { Product, ProductInput } from "./schemas/index.js";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "eshop API",
    version: "1.0.0",
    description: "This is the documentation for the eshop API",
  },
  components: {
    responses: {
      NotFound: {},
      InternalServerError: {},
    },
    schemas: {
      Product,
      ProductInput,
    },
  },
};

export const options = {
  swaggerDefinition,
  apis: ["./routes/*Router.js"],
};
