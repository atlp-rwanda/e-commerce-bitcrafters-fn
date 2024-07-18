import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useAxiosClient from "../hooks/AxiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  amount: number;
}

interface SellerStats {
  message: string;
  totalAmount: number;
  totalSoldItems: number;
  orders: OrderItem[];
}

interface SalesChartProps {
  orders: OrderItem[];
}

const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
  const chartData = useMemo(() => {
    const groupedOrders = orders.reduce(
      (acc: { [key: string]: { amount: number; quantity: number } }, order) => {
        if (acc[order.name]) {
          acc[order.name].amount += order.amount;
          acc[order.name].quantity += order.quantity;
        } else {
          acc[order.name] = { amount: order.amount, quantity: order.quantity };
        }
        return acc;
      },
      {},
    );

    const labels = Object.keys(groupedOrders);
    const amountData = Object.values(groupedOrders).map(
      (order) => order.amount,
    );
    const quantityData = Object.values(groupedOrders).map(
      (order) => order.quantity,
    );

    return {
      labels: labels.length > 0 ? labels : ["No Data"],
      datasets: [
        {
          label: "Total Amount",
          data: amountData.length > 0 ? amountData : [0],
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          tension: 0.1,
        },
        {
          label: "Total Quantity",
          data: quantityData.length > 0 ? quantityData : [0],
          fill: false,
          borderColor: "rgba(255,99,132,1)",
          backgroundColor: "rgba(255,99,132,0.2)",
          tension: 0.1,
        },
      ],
    };
  }, [orders]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Products",
        },
      },
      y: {
        type: "linear",
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded p-4 mt-4">
      <h2 className="text-xl font-semibold mb-2">Sales Chart</h2>
      <div style={{ height: "400px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const axiosClient = useAxiosClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const authToken = useSelector((state: any) => state.auth.authToken);


  const fetchSellerStats = useCallback(async () => {
    if (!isLoggedIn || !authToken) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get<SellerStats>(
        "/stats/seller-stats",
        {
          params: {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        },
      );
      console.log("Stats: ", response.data);
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch seller stats", err);
      setError("Failed to fetch seller stats");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, authToken, navigate, startDate, endDate, axiosClient]);

  useEffect(() => {
    fetchSellerStats();
  }, [startDate, endDate]);

  const handleStartDateChange = (date: Date | null) => {
    if (date) setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) setEndDate(date);
  };

  // if (loading){return <div>Loading...</div>};
  if (error) return <div>{error}</div>;

  if(loading){ return(<div className="flex justify-center items-center align-middle h-screen">
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-12 h-12 text-blue-200 animate-spin fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
  </div>
  </div>);}else{
  return (
    <div className="container mx-auto sm:px-5 pb-5">
      {stats && (
        <>
        <div className="bg-white p-4 mt-10 rounded-lg">
          <div className="sm:flex grid gap-5 py-4 m-auto w-full">
            

            <div className="bg-black md:w-1/4 w-full max-w-md h-auto rounded-lg p-5">
              <p className="text-sm text-center font-thin text-white mb-5">
                Total Amount
              </p>
              <p className="font-medium sm:text-3xl text-3xl text-white text-center">
                RWF{stats.totalAmount.toFixed(2)|| '0.00'}
              </p>
            </div>
            <div className="bg-black md:w-1/4 w-full max-w-md h-auto rounded-lg p-5">
              <p className="text-sm text-center font-thin text-white mb-5">
                Total Sold Items
              </p>
              <p className="font-medium text-5xl text-white text-center">
                {stats.totalSoldItems}
              </p>
            </div>
          </div>
          
          <div className="sm:gap-10 gap-2 flex items-center w-full">
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                className="w-full border p-2 rounded-lg text-slate-500"
              />
              <label className="flex justify-center">To</label>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                className="w-full border p-2 rounded-lg text-slate-500"
              />
          </div>
          <SalesChart orders={stats.orders} />
          </div>
        </>
      )}
    </div>
  );
}
};

export default SellerDashboard;
