import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Download, Plus, ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function CustomerPaymentsView() {
  const { customerProject, customerPayments, makeCustomerPayment } = useApp();
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('₹1,00,000');

  const handlePay = (e) => {
    e.preventDefault();
    makeCustomerPayment(payAmount, 'Milestone Construction Installment');
    setIsPayModalOpen(false);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const percentagePaid = customerProject?.totalCostNum 
    ? Math.round(((customerProject?.amountPaidNum || 0) / customerProject.totalCostNum) * 100) 
    : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-[#D97706]">
              <CreditCard size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1A30]">
              Payment Summary & Milestone Receipts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track stage disbursements, invoices, and verified digital payment records.
          </p>
        </div>

        <button
          onClick={() => setIsPayModalOpen(true)}
          className="px-5 py-2.5 bg-[#092257] hover:bg-[#07183d] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <CreditCard size={16} />
          <span>Pay Milestone Online</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            Total Project Cost
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A30] mt-1 font-mono">
            {customerProject.totalCost}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1">Contract fixed estimate</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs bg-emerald-50/10">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
            Amount Paid
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 font-mono">
            {customerProject.amountPaid}
          </h3>
          <p className="text-[11px] font-bold text-emerald-600 mt-1">✓ {percentagePaid}% Disbursed</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs bg-amber-50/10">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
            Remaining Balance
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1 font-mono">
            {customerProject.pendingAmount}
          </h3>
          <p className="text-[11px] font-bold text-amber-600 mt-1">Due upon final handover</p>
        </div>
      </div>

      {/* Payment Progress Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex justify-between text-xs font-bold text-gray-700">
          <span>Payment Progress ({percentagePaid}% Cleared)</span>
          <span className="text-emerald-700 font-mono">Remaining: {customerProject.pendingAmount}</span>
        </div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${percentagePaid}%` }}
          />
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-800">Recent Payment Ledger</h3>
          <span className="text-xs text-gray-500 font-semibold">{customerPayments.length} Total Receipts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customerPayments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="py-3.5 px-4 font-mono font-medium text-gray-600">{p.date}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{p.description}</div>
                    <div className="text-[10px] text-gray-400">{p.method}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900 text-sm">{p.amount}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                      <CheckCircle2 size={12} /> {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => alert(`Downloading Receipt ${p.receiptId}...`)}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>{p.receiptId}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-[#0B1A30]">Pay Construction Installment</h3>
            <p className="text-xs text-gray-500">Fast digital clearance directly to Tech Builders account.</p>

            <form onSubmit={handlePay} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Payment Amount</label>
                <input
                  type="text"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Bank / UPI</label>
                <select className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-blue-600">
                  <option>HDFC Bank NetBanking</option>
                  <option>ICICI Bank Wire Transfer</option>
                  <option>UPI ID (Google Pay / PhonePe)</option>
                  <option>State Bank of India RTGS</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirm & Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
