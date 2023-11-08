export const OrderInput = {
  type: "object",
  properties: {
    userId: {
      type: "string",
    },
    products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: {
            type: "string",
          },
          quantity: {
            type: "number",
          },
        },
      },
    },
    deliveryAddress: {
      type: "string",
    },
    email: {
      type: "string",
    },
  },
};
