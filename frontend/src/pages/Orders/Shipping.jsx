import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="page-shell checkout-page">
      <ProgressSteps step1 step2 />
      <div className="checkout-heading"><span className="eyebrow">CHECKOUT</span><h1>Where should we deliver?</h1><p>Enter your delivery details and choose a payment method.</p></div>
      <div className="shipping-layout">
        <form onSubmit={submitHandler} className="shipping-form-card">
          <div className="checkout-card-title"><span className="checkout-step-number">1</span><div><h2>Delivery address</h2><p>Your order will be delivered here.</p></div></div>
          <div className="shipping-field">
            <label>Street address</label>
            <input
              type="text"
              className="checkout-input"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="shipping-field">
            <label>City</label>
            <input
              type="text"
              className="checkout-input"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="shipping-field-row">
          <div className="shipping-field">
            <label>Postal code</label>
            <input
              type="text"
              className="checkout-input"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="shipping-field">
            <label>Country</label>
            <input
              type="text"
              className="checkout-input"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div></div>
          <div className="payment-method-card">
            <div className="checkout-card-title"><span className="checkout-step-number">2</span><div><h2>Payment method</h2><p>Choose how you would like to pay.</p></div></div>
              <label className="payment-option">
                <input
                  type="radio"
                  className="payment-radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span><strong>PayPal or Credit Card</strong><small>Protected checkout</small></span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  className="payment-radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={paymentMethod === "Cash on Delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span><strong>Cash on Delivery</strong><small>Pay when your order arrives</small></span>
              </label>
          </div>

          <button
            className="accent-button checkout-submit"
            type="submit"
          >
            Continue to summary
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
