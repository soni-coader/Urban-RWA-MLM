import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../Service/adminApi";
import { toast } from "react-toastify";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaCheck, FaTimes } from "react-icons/fa"; // For Approved/Rejected icons

const SwapManagementReport = () => {
  const swapReportType = "swap";

  const { data: swapReport = [], isLoading, isError, error } = useQuery({
    queryKey: ["swapManagementReport", swapReportType],
    queryFn: async () => {
      const res = await adminApi.getAdminReport(swapReportType);
      console.log("Swap Report Response:", res);
      const reportData = res?.data?.swaps;
      if (!Array.isArray(reportData)) {
        throw new Error("Invalid response: reportData array not found");
      }
      return reportData;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // States for search + pagination
  const [searchInput, setSearchInput] = useState("");
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const rowsPerPage = 10;

  // Set up TanStack Table with custom columns
  const table = useReactTable({
    data: swapReport,
    columns: useMemo(() => {
      return [
         {
        accessorKey: "sNo",
        header: "S.No.",
        cell: ({ row }) => row.index + 1,
      },
        {
          accessorKey: "userName",
          header: "User Name",
          cell: ({ getValue }) => getValue() || "N/A",
        },
        {
          accessorKey: "packageName",
          header: "Package Name",
          cell: ({ getValue }) => getValue() || "N/A",
        },
        {
          accessorKey: "usdtAmount",
          header: "USDT Amount",
          cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
        },
        {
          accessorKey: "emgtAmount",
          header: "EMGT Token",
          cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
        },
        {
          accessorKey: "tokenPrice",
          header: "Price",
          cell: ({ getValue }) => getValue() || "N/A",
        },
        {
          accessorKey: "currencyType",
          header: "Currency Type",
          cell: ({ getValue }) => getValue() || "N/A",
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: ({ getValue }) => {
            const value = getValue() || "Pending";
            return (
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  value.toLowerCase() === "completed"
                    ? "bg-green-100 text-green-700"
                    : value.toLowerCase() === "rejected" ||
                      value.toLowerCase() === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {value.toLowerCase() === "completed"
                  ? "Completed"
                  : value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            );
          },
        },
        {
          accessorKey: "createdAt",
          header: "Date",
          cell: ({ getValue }) =>
            getValue()
              ? new Date(getValue()).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })
              : "N/A",
        },
      ];
    }, []),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter: searchInput },
    onGlobalFilterChange: setSearchInput,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return value
        ? String(value).toLowerCase().includes(filterValue.toLowerCase())
        : false;
    },
    initialState: { pagination: { pageSize: rowsPerPage } },
  });

  // Export PDF
  const handleExportPDF = () => {
    setIsExportingPDF(true);

    if (swapReport.length === 0) {
      toast.error("No data to export", { position: "top-right" });
      setIsExportingPDF(false);
      return;
    }

    setTimeout(() => {
      try {
        const tableColumn = table
          .getAllColumns()
          .map((col) => col.columnDef.header);
        const tableRows = table
          .getPrePaginationRowModel()
          .rows.map((row) =>
            tableColumn.map((col) => {
              const value = row.getValue(col.id);
              return col.id === "createdAt"
                ? value
                  ? new Date(value).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })
                  : "N/A"
                : value || "N/A";
            })
          );

        const doc = new jsPDF("landscape");
        doc.setFontSize(16);
        doc.text("Swap Management Report", 14, 15);

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 25,
          theme: "striped",
          headStyles: { fillColor: [16, 57, 68], textColor: [255, 255, 255] },
          styles: { fontSize: 8, cellPadding: 2 },
          margin: { top: 20 },
        });

        doc.save("swap_management_report.pdf");
        toast.success("PDF exported successfully", { position: "top-right" });
      } catch (err) {
        console.error("PDF Export Error:", err);
        toast.error("Failed to export PDF", { position: "top-right" });
      } finally {
        setIsExportingPDF(false);
      }
    }, 50);
  };

  // Export Excel
  const handleExportExcel = () => {
    setIsExportingExcel(true);

    if (swapReport.length === 0) {
      toast.error("No data to export", { position: "top-right" });
      setIsExportingExcel(false);
      return;
    }

    setTimeout(() => {
      try {
        const excelData = table.getPrePaginationRowModel().rows.map((row) => {
          const rowData = {};
          table
            .getAllColumns()
            .forEach((col) => {
              const value = row.getValue(col.id);
              rowData[col.columnDef.header] = col.id === "createdAt"
                ? value
                  ? new Date(value).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })
                  : "N/A"
                : value || "N/A";
            });
          return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SwapManagementReport");
        XLSX.writeFile(workbook, "swap_management_report.xlsx");
        toast.success("Excel exported successfully", { position: "top-right" });
      } catch (err) {
        console.error("Excel Export Error:", err);
        toast.error("Failed to export Excel", { position: "top-right" });
      } finally {
        setIsExportingExcel(false);
      }
    }, 50);
  };

  // Loading / Error states
  if (isLoading) {
    return (
      <div className="p-4 max-w-[1260px] mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#103944]">
          Swap Management Report
        </h2>
        <p className="text-gray-600">Loading swap records...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 max-w-[1260px] mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#103944]">
          Swap Management Report
        </h2>
        <p className="text-red-600">
          Error: {error?.message || "Failed to load swap management data."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 flex-1 text-nowrap max-w-[1260px] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#103944]">
        Swap Management Report
      </h2>

      <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex gap-2 mb-4 md:mb-0">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className={`bg-red-500 text-white px-4 py-2 rounded mr-2 text-sm ${
              isExportingPDF ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
            }`}
          >
            {isExportingPDF ? "Exporting..." : "Export PDF"}
          </button>
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className={`bg-green-500 text-white px-4 py-2 rounded text-sm ${
              isExportingExcel ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
          >
            {isExportingExcel ? "Exporting..." : "Export Excel"}
          </button>
        </div>
        <div className="flex items-center w-full md:w-auto">
          <input
            placeholder="Search swap records..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#103944]"
            aria-label="Search swap records"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow-md border border-gray-200 p-4">
        <table className="min-w-[100%] w-full text-sm border" role="grid">
          <thead className="bg-[#103944] text-white sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 border whitespace-nowrap min-w-[100px]"
                    scope="col"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100" role="row">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center p-4 text-gray-500"
                >
                  No swap records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end mt-4">
        <span className="text-sm text-gray-600 mr-4">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`bg-[#103944] text-white px-4 py-2 rounded ${
              !table.getCanPreviousPage()
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "hover:bg-[#0e9d52]"
            }`}
            aria-label="Previous page"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`bg-[#103944] text-white px-4 py-2 rounded ${
              !table.getCanNextPage()
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "hover:bg-[#0e9d52]"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapManagementReport;