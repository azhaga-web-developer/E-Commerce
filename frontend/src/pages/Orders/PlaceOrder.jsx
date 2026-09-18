import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="page-shell place-order-page">
        <div className="checkout-heading"><span className="eyebrow">CHECKOUT</span><h1>Review your order</h1><p>Everything looks good? Place your order when you are ready.</p></div>
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="place-order-layout">
          <div className="review-items-card"><div className="checkout-card-title"><span className="checkout-step-number">3</span><div><h2>Your items</h2><p>{cart.cartItems.length} products in your order</p></div></div><div className="review-items-scroll"><table className="review-items-table">
              <thead>
                <tr>
                  <th>Product</th><th>Qty</th><th>Price</th><th>Total</th>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2"><div className="review-product-cell">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="review-product-image"
                      />
                      <Link to={`/product/${item.product}`}>{item.name}</Link></div></td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{item.price.toFixed(2)}</td>
                    <td className="p-2">
                      $ {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div></div>

        <div className="review-side-column">
          <div className="review-summary-card"><div className="order-card-heading"><h2>Order summary</h2><span>USD</span></div><div className="summary-line"><span>Items</span><span>$ {cart.itemsPrice}</span></div><div className="summary-line"><span>Shipping</span><span>$ {cart.shippingPrice}</span></div><div className="summary-line"><span>Tax</span><span>$ {cart.taxPrice}</span></div><div className="summary-total"><span>Total</span><strong>$ {cart.totalPrice}</strong></div>

            {error && <Message variant="danger">{error?.data?.message || error?.error || "Unable to place order"}</Message>}
            <button type="button" className="accent-button place-order-button" disabled={cart.cartItems === 0} onClick={placeOrderHandler}>Place order</button>
            {isLoading && <Loader />}
          </div>

          <div className="review-info-card"><h2>Delivery & payment</h2><div className="review-info-block"><strong>Shipping address</strong><span>{cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}</span></div><div className="review-info-block"><strong>Payment method</strong><span>{cart.paymentMethod}</span></div><Link to="/shipping" className="text-link">Edit details</Link>
          </div>
        </div>
        </div>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
