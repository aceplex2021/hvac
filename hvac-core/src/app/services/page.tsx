import { ServiceTypeManager } from '@/components/services/ServiceTypeManager'
import { ServiceTemplateManager } from '@/components/services/ServiceTemplateManager'
import { getServiceTemplates } from '@/lib/services'

export default async function ServicesPage() {
  const [serviceTypes, serviceTemplates] = await Promise.all([
    Promise.resolve([]),
    getServiceTemplates('')
  ])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Service Types</h2>
        <ServiceTypeManager initialServiceTypes={serviceTypes} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Service Templates</h2>
        <ServiceTemplateManager 
          businessId="current-business-id" // This should come from the business context
          initialTemplates={serviceTemplates} 
        />
      </div>
    </div>
  )
} 