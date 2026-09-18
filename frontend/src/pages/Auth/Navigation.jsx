import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="site-nav">
      <Link to="/" className="brand-mark"><span>H</span> HUXN</Link>
      <nav className="nav-links">
        <Link to="/" className="nav-link"><AiOutlineHome /> Home</Link>
        <Link to="/shop" className="nav-link"><AiOutlineShopping /> Shop</Link>
        <Link to="/favorite" className="nav-link"><FaHeart /> Favorites</Link>
      </nav>
      <div className="nav-actions">
        <Link to="/shop" className="nav-icon" aria-label="Search"><AiOutlineSearch /></Link>
        <Link to="/cart" className="nav-icon cart-icon" aria-label="Cart">
          <AiOutlineShoppingCart />
          {cartItems.length > 0 && <b>{cartItems.reduce((a, c) => a + c.qty, 0)}</b>}
        </Link>
        <button
          onClick={toggleDropdown}
          className="nav-icon profile-icon"
          aria-label="Account"
        >
          <AiOutlineUser />
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`account-menu ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            } `}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="account-link"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="account-link"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="account-link"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="account-link"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="account-link"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="account-link">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="account-link account-logout"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
      {!userInfo && <Link to="/login" className="login-link">Sign in</Link>}
      <div className="mobile-nav">
        <Link to="/"><AiOutlineHome /><small>Home</small></Link>
        <Link to="/shop"><AiOutlineSearch /><small>Shop</small></Link>
        <Link to="/cart"><AiOutlineShoppingCart /><small>Cart</small></Link>
        <Link to={userInfo ? "/profile" : "/login"}><AiOutlineUser /><small>Account</small></Link>
      </div>
    </header>
  );
};

export default Navigation;
