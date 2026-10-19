"use client";

import { useState, useEffect } from "react";
import {
  Expense,
  ExpenseCategory,
  EXPENSE_CATEGORY_LABELS,
  Farm,
  calculateExpenseTotal,
  calculateCategoryBreakdown,
} from "@gebere/shared";
import { apiClient } from "@/lib/api-client";
import {
  Wallet,
  Plus,
  Filter,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ChevronDown
} from "lucide-react";

export default function FarmExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isAdding, setIsAdding] = useState(false);

  // New expense form
  const [farmId, setFarmId] = useState("");
  const [season, setSeason] = useState("2023 Meher");
  const [category, setCategory] = useState<ExpenseCategory>("fertilizer");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const farmList = await apiClient.getFarms();
      setFarms(farmList);
      if (farmList.length > 0) setFarmId(farmList[0].id);

      const expList = await apiClient.getExpenses();
      setExpenses(expList);
    }
    load();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!farmId || !description || isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg("Please fill all fields with valid positive amounts.");
      setStatusMsg(null);
      return;
    }

    try {
      const created = await apiClient.createExpense({
        farmId,
        season,
        category,
        description,
        amount: numAmount,
        currency: "ETB",
        date,
      });

      setExpenses((prev) => [created, ...prev]);
      setDescription("");
      setAmount("");
      setIsAdding(false);
      setErrorMsg(null);
      setStatusMsg("Expense logged successfully!");
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save expense.");
      setStatusMsg(null);
    }
  };

  const filteredExpenses = expenses.filter((item) => {
    const matchFarm = selectedFarm === "All" || item.farmId === selectedFarm;
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchFarm && matchCat;
  });

  const totalETB = calculateExpenseTotal(filteredExpenses);
  const breakdown = calculateCategoryBreakdown(filteredExpenses);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
            Farm Expenses
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track input expenditures across 9 agricultural categories in Ethiopian Birr (ETB).
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{isAdding ? "Cancel Entry" : "Log New Input"}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#1B4332] text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-[#2D6A4F]" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add Expense Form Card */}
      {isAdding && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5DFD3] shadow-md space-y-5 animate-fade-in">
          <h2 className="text-base font-bold text-gray-900">
            Record Input Expenditure
          </h2>

          <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Farm</label>
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              >
                {Object.entries(EXPENSE_CATEGORY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Season</label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="2023 Meher"
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 50kg NPSB Bag from Bishoftu Farmers Cooperative Union"
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Amount (ETB)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 4200"
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                required
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-sm"
              >
                Save Expenditure
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Top Aggregation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Total Expenditure</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] mt-1">
            ETB {totalETB.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {filteredExpenses.length} verified input transactions
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Top Cost Center</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#8B5E3C] mt-1">
            {breakdown.length > 0 ? breakdown[0].label : "None"}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {breakdown.length > 0 ? `${breakdown[0].percentage.toFixed(1)}% of total seasonal spend` : "No expense data"}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Cost Per Hectare</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2D6A4F] mt-1">
            ETB 9,920.00
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            Based on active 1.25 ha cultivation
          </span>
        </div>
      </div>

      {/* Expenses Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-gray-900">
            Logged Input Expenditures
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-2.5 py-1 text-xs text-gray-800 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {Object.entries(EXPENSE_CATEGORY_LABELS).map(([k, l]) => (
                <option key={k} value={k}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-semibold">
                <th className="pb-3 pl-1">Date</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right pr-2">Amount (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 pl-1 text-gray-600 font-medium">{exp.date}</td>
                  <td className="py-3">
                    <span className="bg-[#F5F0E8] text-[#1B4332] px-2.5 py-1 rounded-md text-[11px] font-semibold border border-[#E5DFD3]">
                      {EXPENSE_CATEGORY_LABELS[exp.category] || exp.category}
                    </span>
                  </td>
                  <td className="py-3 text-gray-800 font-medium">{exp.description}</td>
                  <td className="py-3 text-right pr-2 font-bold text-gray-900">
                    ETB {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
