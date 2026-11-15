import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createProduct, updateProduct, getProductBySlug, deleteProduct } from '../src/controllers/productController.js';

describe('Simplified Product Creation & Optional Fields Controls', () => {
  let createdProductId = null;
  let createdProductSlug = null;

  it('should create a product with ONLY mandatory fields (no descriptions, ingredients, or usage)', async () => {
    let statusCode = 200;
    let responseData = null;

    const req = {
      body: {
        name: 'Pure Himalayan Ashwagandha Root',
        category: 'Wellness Products',
        price: 399,
        originalPrice: 499,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80']
        // Notice: shortDescription, description, ingredients, usage, sku are completely omitted!
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await createProduct(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(statusCode, 201, 'Should return HTTP 201 Created');
    assert.strictEqual(responseData.success, true);
    assert.ok(responseData.product, 'Product object must be returned');

    const p = responseData.product;
    createdProductId = p.id || p._id?.toString();
    createdProductSlug = p.slug;

    // Verify auto-generated slug
    assert.match(p.slug, /pure-himalayan-ashwagandha-root/, 'Slug must be auto-generated from name');

    // Verify auto-generated SKU
    assert.ok(p.sku, 'SKU must be auto-generated');
    assert.match(p.sku, /^VRK-/, 'SKU must follow VRK- prefix');

    // Verify optional fields are handled without error
    assert.strictEqual(p.shortDescription, '', 'shortDescription defaults gracefully to empty string');
    assert.strictEqual(p.description, '', 'description defaults gracefully to empty string');
    assert.strictEqual(p.ingredients, '', 'ingredients defaults gracefully to empty string');
    assert.strictEqual(p.usage, '', 'usage defaults gracefully to empty string');
    assert.ok(p.storage, 'storage defaults gracefully');

    // Verify mandatory fields are properly set
    assert.strictEqual(p.name, 'Pure Himalayan Ashwagandha Root');
    assert.strictEqual(p.category, 'Wellness Products');
    assert.strictEqual(p.price, 399);
    assert.strictEqual(p.stock, 50);
    assert.strictEqual(p.images.length, 1);
  });

  it('should auto-generate unique slug if another product has the same name', async () => {
    let statusCode = 200;
    let responseData = null;

    const req = {
      body: {
        name: 'Pure Himalayan Ashwagandha Root',
        category: 'Wellness Products',
        price: 399,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999']
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await createProduct(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(statusCode, 201);
    assert.notStrictEqual(responseData.product.slug, createdProductSlug, 'Duplicate names must have unique slugs');
    assert.match(responseData.product.slug, /pure-himalayan-ashwagandha-root-\d+/, 'Duplicate slug should have suffix');
  });

  it('should reject creation when mandatory fields are missing', async () => {
    // Missing name
    {
      let statusCode = 200;
      let responseData = null;
      const req = { body: { price: 299, category: 'Fruit Products', stock: 10, images: ['http://img.jpg'] } };
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { responseData = data; return res; }
      };
      await createProduct(req, res, () => { });
      assert.strictEqual(statusCode, 400);
      assert.match(responseData.message, /name/i);
    }

    // Missing price
    {
      let statusCode = 200;
      let responseData = null;
      const req = { body: { name: 'Test Apple Powder', category: 'Fruit Products', stock: 10, images: ['http://img.jpg'] } };
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { responseData = data; return res; }
      };
      await createProduct(req, res, () => { });
      assert.strictEqual(statusCode, 400);
      assert.match(responseData.message, /price/i);
    }

    // Missing category
    {
      let statusCode = 200;
      let responseData = null;
      const req = { body: { name: 'Test Apple Powder', price: 299, stock: 10, images: ['http://img.jpg'] } };
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { responseData = data; return res; }
      };
      await createProduct(req, res, () => { });
      assert.strictEqual(statusCode, 400);
      assert.match(responseData.message, /category/i);
    }

    // Missing stock
    {
      let statusCode = 200;
      let responseData = null;
      const req = { body: { name: 'Test Apple Powder', price: 299, category: 'Fruit Products', images: ['http://img.jpg'] } };
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { responseData = data; return res; }
      };
      await createProduct(req, res, () => { });
      assert.strictEqual(statusCode, 400);
      assert.match(responseData.message, /stock/i);
    }

    // Missing images
    {
      let statusCode = 200;
      let responseData = null;
      const req = { body: { name: 'Test Apple Powder', price: 299, category: 'Fruit Products', stock: 10, images: [] } };
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { responseData = data; return res; }
      };
      await createProduct(req, res, () => { });
      assert.strictEqual(statusCode, 400);
      assert.match(responseData.message, /image/i);
    }
  });

  it('should retrieve the created product by slug with all properties', async () => {
    let statusCode = 200;
    let responseData = null;

    const req = { params: { slug: createdProductSlug } };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await getProductBySlug(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.product.slug, createdProductSlug);
    assert.strictEqual(responseData.product.name, 'Pure Himalayan Ashwagandha Root');
  });

  it('should update the product without requiring optional fields', async () => {
    let statusCode = 200;
    let responseData = null;

    const req = {
      params: { id: createdProductId },
      body: {
        price: 449,
        stock: 80
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await updateProduct(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.product.price, 449);
    assert.strictEqual(responseData.product.stock, 80);
  });

  it('should successfully delete a product by id or slug', async () => {
    let statusCode = 200;
    let responseData = null;

    const req = {
      params: { id: createdProductId }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await deleteProduct(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.match(responseData.message, /deleted successfully/i);

    // Verify product no longer exists
    let getStatusCode = 200;
    let getResponseData = null;
    const getReq = { params: { slug: createdProductSlug } };
    const getRes = {
      status: (code) => { getStatusCode = code; return getRes; },
      json: (data) => { getResponseData = data; return getRes; }
    };

    await getProductBySlug(getReq, getRes, () => {});
    assert.strictEqual(getStatusCode, 404, 'Deleted product should return 404');
  });
});

