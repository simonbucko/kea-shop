export const Product = {
  type: "object",
  properties: {
    _id: {
      type: "string",
    },
    name: {
      type: "string",
    },
    imageUrl: {
      type: "string",
    },
    description: {
      type: "string",
    },
    price: {
      type: "number",
    },
    __v: {
      type: "number",
    },
  },
};

export const ProductInput = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    imageUrl: {
      type: "string",
    },
    description: {
      type: "string",
    },
    price: {
      type: "number",
    },
  },
};
