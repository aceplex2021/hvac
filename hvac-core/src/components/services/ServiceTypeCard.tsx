import { ServiceType } from '@/types/services'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

interface ServiceTypeCardProps {
  serviceType: ServiceType
  onEdit?: (serviceType: ServiceType) => void
  onDelete?: (serviceType: ServiceType) => void
  onToggleActive?: (serviceType: ServiceType) => void
}

export function ServiceTypeCard({
  serviceType,
  onEdit,
  onDelete,
  onToggleActive,
}: ServiceTypeCardProps) {
  const {
    name,
    category,
    description,
    estimatedDuration,
    basePrice,
    isActive,
    requiredSkills,
    requiredEquipment,
  } = serviceType

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription className="capitalize">{category}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded-full text-sm ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">{description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p>{Math.round(estimatedDuration / 60)} hours</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Base Price</p>
              <p>${basePrice.toFixed(2)}</p>
            </div>
          </div>
          {(requiredSkills.length > 0 || requiredEquipment.length > 0) && (
            <div className="space-y-2">
              {requiredSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Required Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {requiredSkills.map(skill => (
                      <span key={skill} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {requiredEquipment.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Required Equipment</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {requiredEquipment.map(equipment => (
                      <span key={equipment} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        {equipment}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {onToggleActive && (
          <Button
            variant="outline"
            onClick={() => onToggleActive(serviceType)}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>
        )}
        {onEdit && (
          <Button
            variant="outline"
            onClick={() => onEdit(serviceType)}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            onClick={() => onDelete(serviceType)}
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 