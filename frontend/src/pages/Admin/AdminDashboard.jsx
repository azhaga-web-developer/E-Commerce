import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="admin-dashboard page-shell">
        <div className="admin-dashboard-heading">
          <div><span className="eyebrow">OVERVIEW</span><h1>Good morning, admin</h1><p>Here is what is happening with your store today.</p></div>
        </div>
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card"><span className="kpi-icon sales-icon">$</span><p>Total sales</p><h2>{isLoading ? <Loader /> : `$ ${sales?.totalSales?.toFixed(2)}`}</h2><small>All time revenue</small></div>
          <div className="admin-kpi-card"><span className="kpi-icon users-icon">U</span><p>Customers</p><h2>{loading ? <Loader /> : customers?.length}</h2><small>Registered accounts</small></div>
          <div className="admin-kpi-card"><span className="kpi-icon orders-icon">O</span><p>All orders</p><h2>{loadingTwo ? <Loader /> : orders?.totalOrders}</h2><small>Orders received</small></div>
        </div>

        <div className="admin-chart-card">
          <div className="admin-card-heading"><div><span className="eyebrow">PERFORMANCE</span><h2>Sales overview</h2></div><span className="chart-period">Last 30 days</span></div>
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="100%"
          />
        </div>

        <div className="admin-orders-card">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
