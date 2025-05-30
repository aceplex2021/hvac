'use client'

import { useState } from 'react'
import { Search, BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HelpSection {
  title: string
  content: string
  category: string
}

interface HelpDocumentationProps {
  sections: HelpSection[]
  className?: string
}

export function HelpDocumentation({ sections, className = '' }: HelpDocumentationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const categories = Array.from(new Set(sections.map(section => section.category)))
  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className={cn('max-w-4xl mx-auto p-6', className)}>
      <div className="flex items-center gap-4 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Help Documentation</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {categories.map(category => {
          const categorySections = filteredSections.filter(section => section.category === category)
          if (categorySections.length === 0) return null

          const isExpanded = expandedCategories.includes(category)
          return (
            <div key={category} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
              >
                <span className="font-medium">{category}</span>
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              {isExpanded && (
                <div className="p-4 space-y-4">
                  {categorySections.map((section, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <h3 className="font-medium mb-2">{section.title}</h3>
                      <p className="text-gray-600">{section.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 