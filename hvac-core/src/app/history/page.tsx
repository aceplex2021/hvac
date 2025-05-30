'use client'

import { useState, useEffect } from 'react'
import { ServiceHistory, ServiceHistoryFilters, ServiceHistoryAnalytics } from '@/types/service-history'
import { getServiceHistory, getServiceHistoryAnalytics, exportServiceHistory } from '@/lib/services/history'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'

export default function HistoryPage() {
  const [history, setHistory] = useState<ServiceHistory[]>([])
  const [analytics, setAnalytics] = useState<ServiceHistoryAnalytics | null>(null)
  const [filters, setFilters] = useState<ServiceHistoryFilters>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [filters])

  async function loadHistory() {
    try {
      setIsLoading(true)
      const [historyData, analyticsData] = await Promise.all([
        getServiceHistory(filters),
        getServiceHistoryAnalytics(filters)
      ])
      setHistory(historyData)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExport() {
    try {
      const csv = await exportServiceHistory(filters)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `service-history-${format(new Date(), 'yyyy-MM-dd')}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting history:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Service History</h1>
        <Button onClick={handleExport}>Export to CSV</Button>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Services</h3>
            <p className="text-3xl font-bold">{analytics.totalServices}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold">
              ${analytics.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Avg. Completion Time</h3>
            <p className="text-3xl font-bold">
              {Math.round(analytics.averageCompletionTime / 1000 / 60)} min
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.service_request_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.technician.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(item.start_time), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.end_time ? format(new Date(item.end_time), 'MMM d, yyyy HH:mm') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${item.total_cost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 