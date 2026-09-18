import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  useEffect(() => {
    if (!category && categories?.length) {
      setCategory(categories[0]._id);
    }
  }, [categories, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const data = await createProduct(productData).unwrap();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.error || error?.data?.message || "Product create failed. Try Again."
      );
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="admin-shell page-shell">
      <div className="admin-topbar">
        <div>
          <span className="eyebrow">INVENTORY</span>
          <h1>Add a new product</h1>
          <p>Build your catalog with a polished product listing.</p>
        </div>
        <AdminMenu />
      </div>

      <div className="admin-product-layout">
        <section className="admin-preview-card">
          <div className="admin-card-heading">
            <div><span className="eyebrow">PREVIEW</span><h2>Product image</h2></div>
            {imageUrl && <span className="upload-status">Uploaded</span>}
          </div>
          <div className={`admin-image-preview ${imageUrl ? "has-image" : ""}`}>
            {imageUrl ? <img src={imageUrl} alt="product preview" /> : <><span className="image-placeholder-icon">+</span><strong>Upload product image</strong><small>JPG, PNG or WEBP</small></>}
          </div>
          <label className="admin-upload-button">
            {imageUrl ? "Replace image" : "Choose image"}
            <input type="file" name="image" accept="image/*" onChange={uploadFileHandler} />
          </label>
          <p className="admin-tip">Use a clear square image for the best storefront presentation.</p>
        </section>

        <section className="admin-form-card">
          <div className="admin-card-heading">
            <div><span className="eyebrow">DETAILS</span><h2>Product information</h2></div>
            <span className="required-note">* Required</span>
          </div>
          <div className="admin-form-grid">
            <label className="admin-field admin-field-wide">Product name *<input type="text" placeholder="e.g. Classic leather sneakers" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="admin-field">Price *<input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
            <label className="admin-field">Brand *<input type="text" placeholder="e.g. Nike" value={brand} onChange={(e) => setBrand(e.target.value)} /></label>
            <label className="admin-field">Quantity *<input type="number" placeholder="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></label>
            <label className="admin-field">In stock<input type="number" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} /></label>
            <label className="admin-field">Category *<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
            <label className="admin-field admin-field-wide">Description *<textarea rows="5" placeholder="Tell customers what makes this product special..." value={description} onChange={(e) => setDescription(e.target.value)} /></label>
          </div>
          <div className="admin-form-footer">
            <span>Products appear in your storefront after publishing.</span>
            <button onClick={handleSubmit} className="admin-publish-button">Publish product</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductList;
