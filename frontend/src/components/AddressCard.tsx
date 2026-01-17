import { useState } from 'react';

interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

export default function AddressCard({ 
  address, 
  onEdit, 
  onDelete, 
  onSetDefault 
}: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setIsDeleting(true);
      onDelete?.(address.id);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{address.fullName}</h3>
            {address.isDefault && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Default
              </span>
            )}
          </div>
          
          <p className="text-gray-600">
            {address.street}<br />
            {address.city}, {address.state} {address.zipCode}<br />
            {address.country}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => onSetDefault?.(address.id)}
            disabled={address.isDefault}
            className={`text-xs px-3 py-1 rounded ${
              address.isDefault
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Set Default
          </button>
          
          <button
            onClick={() => onEdit?.(address)}
            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Edit
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}