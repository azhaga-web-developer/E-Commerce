import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPaypal, error: paypalError } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!paypalError && !loadingPaypal && paypal?.clientId && order && !order.isPaid && !window.paypal) {
      paypalDispatch({ type: "resetOptions", value: { "client-id": paypal.clientId, currency: "USD" } });
      paypalDispatch({ type: "setLoadingStatus", value: "pending" });
    }
  }, [paypalError, loadingPaypal, order, paypal, paypalDispatch]);

  const onApprove = (data, actions) => actions.order.capture().then(async (details) => {
    try {
      await payOrder({ orderId, details });
      refetch();
      toast.success("Order is paid");
    } catch (payError) {
      toast.error(payError?.data?.message || payError.message);
    }
  });

  const createOrder = (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: order.totalPrice } }] });
  const onError = (paypalErrorResponse) => toast.error(paypalErrorResponse.message);
  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error?.error || "Unable to load order"}</Message>;

  return (
    <div className="page-shell order-detail-page">
      <div className="order-detail-heading">
        <Link to="/profile" className="text-link">&larr; Back to orders</Link>
        <span className="eyebrow">ORDER DETAILS</span>
        <h1>Order summary</h1>
        <p>Order #{order._id}</p>
      </div>
      <div className="order-detail-grid">
        <section className="order-items-card">
          <div className="order-card-heading"><h2>Items in your order</h2><span>{order.orderItems.length} items</span></div>
          {order.orderItems.length === 0 ? <Message>Order is empty</Message> : (
            <div className="order-items-scroll"><table className="order-items-table">
              <thead><tr><th>Product</th><th>Quantity</th><th>Unit price</th><th>Total</th></tr></thead>
              <tbody>{order.orderItems.map((item, index) => (
                <tr key={index}>
                  <td><div className="order-product-cell"><img src={item.image} alt={item.name} className="order-product-image" /><Link to={`/product/${item.product}`}>{item.name}</Link></div></td>
                  <td>{item.qty}</td><td>${item.price}</td><td>${(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </section>
        <aside className="order-side-column">
          <section className="shipping-card">
            <div className="order-card-heading"><h2>Shipping details</h2><span className={`status-pill ${order.isPaid ? "status-success" : "status-pending"}`}>{order.isPaid ? "Paid" : "Not paid"}</span></div>
            <div className="shipping-detail"><strong>Order</strong><span>{order._id}</span></div>
            <div className="shipping-detail"><strong>Name</strong><span>{order.user.username}</span></div>
            <div className="shipping-detail"><strong>Email</strong><span>{order.user.email}</span></div>
            <div className="shipping-detail"><strong>Address</strong><span>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</span></div>
            <div className="shipping-detail"><strong>Method</strong><span>{order.paymentMethod}</span></div>
          </section>
          <section className="order-summary-card">
            <div className="order-card-heading"><h2>Order total</h2><span>USD</span></div>
            <div className="summary-line"><span>Items</span><span>$ {order.itemsPrice}</span></div>
            <div className="summary-line"><span>Shipping</span><span>$ {order.shippingPrice}</span></div>
            <div className="summary-line"><span>Tax</span><span>$ {order.taxPrice}</span></div>
            <div className="summary-total"><span>Total</span><strong>$ {order.totalPrice}</strong></div>
            {!order.isPaid && order.paymentMethod === "PayPal" && (loadingPay || isPending ? <Loader /> : <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />)}
            {!order.isPaid && order.paymentMethod === "Cash on Delivery" && <div className="cod-notice"><strong>Cash on Delivery</strong><span>Pay when your order arrives.</span></div>}
            {loadingDeliver && <Loader />}
            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && <button type="button" className="accent-button deliver-button" onClick={deliverHandler}>Mark as delivered</button>}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Order;
