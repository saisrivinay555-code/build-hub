import React from 'react';
import { FileBarChart, Download, Printer, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BuilderReportsView() {
  const { myProjects, myCustomers } = useApp();

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Project Name,Customer,Location,Status,Progress,Budget,Deadline\n';
    myProjects.forEach(p => {
      csvContent += `"${p.name}","${p.customer}","${p.location}","${p.status}","${p.progress}%","${p.budget}","${p.deadline}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Builder_Project_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
              <FileBarChart size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
              Builder Reports & Audit Summary
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Export construction milestones, client deliverables, and project status audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-sm text-gray-800">Contracted Construction Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myProjects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-bold text-gray-900">{p.name}</td>
                  <td className="py-3 px-4 font-medium text-gray-700">{p.customer}</td>
                  <td className="py-3 px-4 text-gray-600">{p.location}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">{p.progress}%</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">{p.budget}</td>
                  <td className="py-3 px-4 text-gray-600">{p.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
