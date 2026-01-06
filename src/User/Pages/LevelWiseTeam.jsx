import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../config/appConfig";
import SkeletonLoader from "../Components/Comman/Skeletons";
import { useDemoMode } from '../Contexts/DemoModeContext';
import { getDemoData } from '../Data/demoData';

const columnHelper = createColumnHelper();

const columns = [
  {
    id: "sno",
    header: "S.No",
    cell: ({ row }) => <div className="text-sm text-gray-600">{row.index + 1}</div>,
  },
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("userName", {
    header: "Username",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("level", {
    header: "Level",
    cell: (info) => `Level ${info.getValue()}`,
  }),
  columnHelper.accessor("plan", {
    header: "Plan",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("joinDate", {
    header: "Join Date",
    cell: (info) => info.getValue(),
  }),
];

const LevelWiseTeam = () => {
  const { isDemoMode } = useDemoMode();
  const [globalFilter, setGlobalFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  // Fetch data using useQuery
  const { data: fullData = [], isLoading, isError, error } = useQuery({
    queryKey: ["levelWiseTeam", token],
    queryFn: async () => {
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`${appConfig.baseURL}/user/referral-level-wise-team`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!result.data?.data || typeof result.data.data !== "object") {
        throw new Error("Invalid referral data received from the server");
      }

      return transformApiData(result.data.data);
    },
    enabled: !!token && !isDemoMode,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onError: (err) => {
      if (err.message.includes("Invalid token")) {
        navigate("/user/login");
      }
    },
  });

  // Use demo data if demo mode is active
  const displayData = isDemoMode ? (() => {
    const demoLevelWiseData = getDemoData("levelWiseTeam");
    const flattenedData = [];
    for (const level in demoLevelWiseData) {
      const users = demoLevelWiseData[level] || [];
      users.forEach((user) => {
        flattenedData.push({
          id: user.id,
          userName: user.userName,
          level: parseInt(level),
          plan: user.plan,
          joinDate: moment(user.joinDate).utcOffset(330).format("YYYY-MM-DD HH:mm:ss"),
        });
      });
    }
    return flattenedData;
  })() : fullData;

  // Transform API data to match fullData structure
  const transformApiData = (levelWiseData) => {
    const flattenedData = [];
    for (const level in levelWiseData) {
      const users = levelWiseData[level] || [];
      users.forEach((user) => {
        flattenedData.push({
          id: user.id || "N/A",
          userName: user.userName || "Unknown",
          level: parseInt(level) || 0,
          plan: user.plan || "N/A",
          joinDate: user.joinDate
            ? moment(user.joinDate).utcOffset(330).format("YYYY-MM-DD HH:mm:ss")
            : "N/A",
        });
      });
    }
    return flattenedData;
  };

  const filteredData = useMemo(() => {
    let data = displayData;
    if (levelFilter) {
      data = data.filter((row) => row.level === parseInt(levelFilter));
    }
    if (globalFilter) {
      data = data.filter(
        (row) =>
          row.userName.toLowerCase().includes(globalFilter.toLowerCase()) ||
          row.id.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }
    return data;
  }, [displayData, levelFilter, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LevelWiseTeam");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "level-wise-team.xlsx");
  };

  return (
    <div className="theme-card-style border-gradient text-gray-800 p-6 rounded-md max-w-full mx-auto">
      <div className="flex justify-between mb-6 gap-4 flex-wrap-reverse">
        <h2 className="text-2xl text-blue-700 font-bold">Level Wise Team</h2>
        <button
          onClick={exportToExcel}
          className="px-3 py-1 h-fit text-base border flex items-center justify-center gap-2 border-gray-300 rounded bg-white hover:bg-gray-50 transition"
        >
          <PiMicrosoftExcelLogo className="text-green-600" />
          <span>Export</span>
        </button>
      </div>

      {isLoading ? (
        <>
          <div className="overflow-auto rounded">
            <SkeletonLoader variant="table" rows={10} />
          </div>
        </>
      ) : isError ? (
        <p className="text-center text-sm text-red-500 py-4">
          {error?.message || "Failed to fetch referral data. Please try again later."}
        </p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by username or ID..."
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none"
            />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none"
            >
              <option value="" className="bg-white text-gray-800">
                All Levels
              </option>
              <option value="1" className="bg-white text-gray-800">
                Level 1
              </option>
              <option value="2" className="bg-white text-gray-800">
                Level 2
              </option>
              <option value="3" className="bg-white text-gray-800">
                Level 3
              </option>
            </select>
          </div>

          <div className="overflow-auto rounded">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-2 border-b border-gray-200 text-blue-700 text-nowrap"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition text-nowrap">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2 border-b border-gray-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {table.getRowModel().rows.length === 0 && (
              <p className="text-center text-sm text-gray-500 mt-4">No data found.</p>
            )}
          </div>

          <div className="mt-6 flex md:flex-row flex-col gap-4 items-center justify-between text-sm">
            <div className="text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="space-x-2 flex">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs md:text-sm rounded disabled:opacity-40 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs md:text-sm rounded disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FaAngleLeft />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs md:text-sm rounded disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FaAngleRight />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs md:text-sm rounded disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LevelWiseTeam;