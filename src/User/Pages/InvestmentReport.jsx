import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PiMicrosoftExcelLogo } from 'react-icons/pi';
import { MdAutorenew, MdOutlineSwapHoriz } from 'react-icons/md';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { appConfig } from '../../config/appConfig';
import SkeletonLoader from '../Components/Comman/Skeletons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDemoMode } from '../Contexts/DemoModeContext';
import { getDemoData } from '../Data/demoData';

const columnHelper = createColumnHelper();

const InvestmentReport = () => {
  const { isDemoMode } = useDemoMode();
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const queryClient = useQueryClient();

  // 🔹 Fetch staked plans (cached by React Query)
  const fetchStakedPlans = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found. Please log in.');

    const response = await axios.get(`${appConfig.baseURL}/user/stake/userPlans`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { stakedPlans: apiPlans } = response.data.data;

    return apiPlans.map(plan => ({
      stakeId: plan.stakeId,
      planName: plan.packageName,
      amount: plan.amount,
      dailyReturn: plan.dailyROIAmount,
      startDate: moment(plan.createdAt).utcOffset(330).format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment(plan.lockUntil).utcOffset(330).format('YYYY-MM-DD HH:mm:ss'),
      status: plan.isLockingPeriodActive ? 'Locked' : plan.status === 'completed' ? 'Claim' : 'Complete',
      isSwapped: plan.isSwapped,
      isTransferred: plan.isTransferred,
      isReinvested: plan.isReinvested,
    }));
  };

  const { data: stakedPlans = [], isLoading, isError, error } = useQuery({
    queryKey: ['stakedPlans'],
    queryFn: fetchStakedPlans,
    staleTime: 1000 * 60 * 2, // 2 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    enabled: !isDemoMode, // Disable API call in demo mode
  });

  // Use demo data if demo mode is active
  const displayPlans = isDemoMode ? getDemoData("investmentReport") : stakedPlans;

  // 🔹 Mutation for stake actions
  const actionMutation = useMutation({
    mutationFn: async ({ stakeId, action }) => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in.');

      return axios.post(
        `${appConfig.baseURL}/user/stake/manage`,
        { stakeId, action: action.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: (_, variables) => {
      toast.success(`${variables.action} action completed for Stake ID: ${variables.stakeId}`);
      queryClient.invalidateQueries(['stakedPlans']);
    },
    onError: (err) => {
      toast.error(err.response?.data.message || 'Failed to perform action. Please try again.');
    },
    onSettled: () => setIsPopupOpen(false),
  });

  const openPopup = (action, row) => {
    setSelectedAction(action);
    setSelectedRow(row);
    setIsPopupOpen(true);
  };

  const handleActionConfirm = () => {
    if (!selectedRow || !selectedAction) return;
    actionMutation.mutate({ stakeId: selectedRow.stakeId, action: selectedAction });
  };

  const filteredData = useMemo(() => {
    return statusFilter ? displayPlans.filter(row => row.status === statusFilter) : displayPlans;
  }, [statusFilter, displayPlans]);

  const columns = [
    {
      id: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="text-left text-sm text-secondary">{row.index + 1}</div>,
    },
    columnHelper.accessor('planName', { header: 'Plan Name' }),
    columnHelper.accessor('amount', { header: 'Amount', cell: info => `$${info.getValue()}` }),
    columnHelper.accessor('dailyReturn', { header: 'Daily Return', cell: info => `$${info.getValue()}` }),
    columnHelper.accessor('startDate', { header: 'Start Date' }),
    columnHelper.accessor('endDate', { header: 'End Date' }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${info.getValue() === 'Locked'
            ? 'bg-yellow-800 text-yellow-300'
            : info.getValue() === 'Claim'
              ? 'bg-blue-800 text-blue-300'
              : 'bg-green-800 text-green-300'}`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    {
      id: 'swap',
      header: 'Swap',
      cell: ({ row }) => (
        <button
          onClick={() => openPopup('Swap', row.original)}
          className={`px-3 flex items-center gap-1 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs ${row.original.isSwapped ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={row.original.isSwapped}
        >
          Swap <MdOutlineSwapHoriz />
        </button>
      ),
    },
    {
      id: 'transfer',
      header: 'Transfer',
      cell: ({ row }) => (
        <button
          onClick={() => openPopup('Transfer', row.original)}
          className={`px-3 flex items-center gap-1 py-1 bg-green-600 hover:bg-green-500 rounded text-xs ${row.original.isTransferred || row.original.isSwapped ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={row.original.isTransferred || row.original.isSwapped}
        >
          Transfer <FaMoneyBillTransfer />
        </button>
      ),
    },
    {
      id: 'reinvest',
      header: 'Reinvest',
      cell: ({ row }) => (
        <button
          onClick={() => openPopup('Reinvest', row.original)}
          className={`px-3 flex items-center gap-1 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs ${row.original.isTransferred ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={row.original.isTransferred}
        >
          Reinvest <MdAutorenew />
        </button>
      ),
    },
  ];

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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'InvestmentReport');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'investment-report.xlsx');
  };

  return (
    <>
      <div className="theme-card-style border-gradient text-gray-800 p-6 rounded-md max-w-full mx-auto">
        <div className="flex justify-between mb-6 gap-4 flex-wrap-reverse">
          <h2 className="text-2xl font-bold">Investment Report</h2>
          <button
            onClick={exportToExcel}
            className="px-3 py-1 h-fit text-base border flex items-center justify-center gap-2 border-gray-300 rounded bg-white hover:bg-gray-50 transition"
          >
            <PiMicrosoftExcelLogo className="text-green-600" />
            <span>Export</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search plan name..."
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="Locked">Locked</option>
            <option value="Claim">Claim</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        <div className="overflow-auto rounded">
          <table className="w-full border-collapse text-sm">
            {isLoading && !isDemoMode ? (
              <SkeletonLoader variant="table" />
            ) : isError && !isDemoMode ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              <>
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="text-left px-4 py-2 border-b border-gray-200 text-nowrap"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 transition text-nowrap">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-2 border-b border-gray-200">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>

          {table.getRowModel().rows.length === 0 && !isLoading && (
            <p className="text-center text-sm text-gray-500 mt-4">No data found.</p>
          )}
        </div>

        <div className="mt-6 flex md:flex-row flex-col gap-4 items-center justify-between text-sm">
          <div>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="space-x-2 flex">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border text-xs rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border text-xs rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border text-xs rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaAngleRight />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border text-xs rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {isPopupOpen && (
        <div onClick={() => setIsPopupOpen(false)} className="fixed top-0 left-0 overflow-y-auto w-screen h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary/10 backdrop-blur-md border-gradient rounded-lg p-6 w-[90%] max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {selectedAction}
            </h3>
            <p className="mb-6 text-sm text-gray-300">
              Are you sure you want to <span className="font-bold">{selectedAction}</span> for <span className="text-blue-700">{selectedRow?.planName}</span>?
              <br />
              Start Date: {selectedRow?.startDate}
              <br />
              End Date: {selectedRow?.endDate}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleActionConfirm}
                disabled={actionMutation.isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
              >
                {actionMutation.isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestmentReport;
