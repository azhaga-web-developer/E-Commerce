import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import { Link } from "react-router-dom";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  const featured = data[0];

  return (
    <section className="page-shell hero-panel">
      <div className="hero-copy">
        <span className="eyebrow">NEW COLLECTION</span>
        <h1>Find your<br /><strong>everyday style.</strong></h1>
        <p>Curated essentials that make every day feel a little more yours.</p>
        <Link to="/shop" className="accent-button hero-button">Explore shop</Link>
      </div>
      {featured && (
        <Link to={`/product/${featured._id}`} className="hero-product">
          <img src={featured.image} alt={featured.name} />
          <div><span>{featured.brand}</span><strong>{featured.name}</strong><b>${featured.price}</b></div>
        </Link>
      )}
    </section>
  );
};

export default Header;
