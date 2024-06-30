import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBoxOpen,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";
import axiosClient from "../../hooks/AxiosInstance";
import { toast } from "react-toastify";

const DashboardStats = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notify = (message: string) => toast(message);

  const client = axiosClient();

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        setIsLoading(true);
        const response = await client.get("/users");
        const { totalPages, limit } = response.data.pagination;
        let usersCount = response.data.users.length;
        for (let page = 2; page <= totalPages; page++) {
          const res = await client.get(`/users?page=${page}&limit=${limit}`);
          usersCount += res.data.users.length;
        }
        setTotalUsers(usersCount);
      } catch (err: any) {
        notify(
          err.response ? err.response.data.message : "Fetching users failed",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <FaUsers className="text-blue-500" />,
    },
    {
      title: "Total Products",
      value: 500,
      icon: <FaBoxOpen className="text-green-500" />,
    },
    {
      title: "Total Sales",
      value: 20000,
      icon: <FaDollarSign className="text-yellow-500" />,
    },
    {
      title: "Total Orders",
      value: 1500,
      icon: <FaShoppingCart className="text-red-500" />,
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-md p-4 flex-1 text-xs">
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="flex flex-wrap justify-around gap-4">
        {isLoading
          ? "Loading..."
          : stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-md flex items-center border border-gray-300 flex-1 min-w-[200px] sm:w-[calc(25%-1rem)] md:w-[calc(20%-1rem)] lg:w-[calc(20%-1rem)]"
              >
                <div className="p-3 rounded-full bg-white shadow-md mr-4">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-600">{stat.title}</p>
                  <p className="text-xl font-semibold">{stat.value}</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default DashboardStats;
