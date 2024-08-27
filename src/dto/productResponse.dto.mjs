export const productResponseDto = (product) => {
    const totalStock = product.inventories.reduce(
    (acc, inventory) => acc + inventory.stock,
    0
  );

  /* return {
    name: product.name,
    code: product.code || product.barcode,
    description: product.description,
    stock: totalStock,
    cost: product.price / 2,
  }; */

  return {
    name: product.name,
    code: product.code || product.barcode,
    description: product.description,
    stock: totalStock,
  };

  /* return {
    ...product,
  }; */
};
