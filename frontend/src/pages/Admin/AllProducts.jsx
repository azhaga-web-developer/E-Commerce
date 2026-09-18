import { Link } from "react-router-dom";
import moment from "moment";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const deleteHandler = async (productId, productName) => {
    if (!window.confirm(`Delete ${productName}?`)) return;

    try {
      await deleteProduct(productId).unwrap();
      toast.success(`${productName} deleted`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Product delete failed");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="page-shell admin-products-page">
      <div className="admin-products-heading"><div><span className="eyebrow">INVENTORY</span><h1>All products</h1><p>{products.length} products in your catalog</p></div><AdminMenu /></div>
          <div className="admin-products-grid">
              {products.map((product) => (
                  <article key={product._id} className="admin-product-card">
                    <Link to={`/admin/product/update/${product._id}`} className="admin-product-image-link">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="admin-product-image"
                    />
                    </Link>
                    <div className="admin-product-card-info">
                      <div className="admin-product-card-top"><div><h2>{product?.name}</h2><span>{product?.brand}</span></div><strong>$ {product?.price}</strong></div>
                      <p>{product?.description?.substring(0, 90)}...</p>
                      <small>{product.createdAt ? moment(product.createdAt).format("MMM Do, YYYY") : "Recently added"}</small>
                      <div className="admin-product-actions"><Link to={`/admin/product/update/${product._id}`} className="table-action">Edit</Link><button type="button" className="delete-action" disabled={isDeleting} onClick={() => deleteHandler(product._id, product.name)}>Delete</button></div>
                    </div>
                  </article>
              ))}
            </div>
    </div>
  );
};

export default AllProducts;
