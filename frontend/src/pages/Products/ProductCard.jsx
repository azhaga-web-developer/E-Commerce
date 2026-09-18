import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="catalog-card">
      <section className="catalog-image-wrap">
        <Link to={`/product/${p._id}`}>
          <span className="brand-pill">
            {p?.brand}
          </span>
          <img
            className="catalog-image"
            src={p.image}
            alt={p.name}
            style={{ height: "170px", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="catalog-info">
        <div className="catalog-title-row">
          <h5>{p?.name}</h5>

          <p className="catalog-price">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="catalog-description">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="catalog-actions">
          <Link
            to={`/product/${p._id}`}
            className="text-link"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="card-cart-button"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
