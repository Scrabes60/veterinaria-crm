'use client';

import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.tsx';
import { Input } from '@/components/ui/Input.tsx';

interface Appointment {
  id: string;
  petName: string;
  customerName: string;
  date: string;
  time: string;
  vet: string;
  status: 'scheduled' | 'checked_in' | 'done' | 'no_show' | 'cancelled';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    petName: 'Max',
    customerName: 'Juan Pérez',
    date: '2025-12-15',
    time: '09:30',
    vet: 'Dr. García',
    status: 'scheduled',
  },
  {
    id: '2',
    petName: 'Luna',
    customerName: 'María García',
    date: '2025-12-15',
    time: '10:00',
    vet: 'Dra. Rodríguez',
    status: 'checked_in',
  },
  {
    id: '3',
    petName: 'Rocky',
    customerName: 'Carlos López',
    date: '2025-12-14',
    time: '14:30',
    vet: 'Dr. García',
    status: 'done',
  },
  {
    id: '4',
    petName: 'Bella',
    customerName: 'Ana Martínez',
    date: '2025-12-14',
    time: '15:00',
    vet: 'Dra. Rodríguez',
    status: 'no_show',
  },
  {
    id: '5',
    petName: 'Thor',
    customerName: 'Pedro Sánchez',
    date: '2025-12-13',
    time: '11:00',
    vet: 'Dr. García',
    status: 'cancelled',
  },
];

const getStatusIcon = (
  status: Appointment['status']
) => {
  switch (status) {
    case 'scheduled':
      return <Clock className="w-4 h-4" />;
    case 'checked_in':
      return <Eye className="w-4 h-4" />;
    case 'done':
      return <CheckCircle className="w-4 h-4" />;
    case 'no_show':
      return <XCircle className="w-4 h-4" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: Appointment['status']) => {
  const badges: Record<Appointment['status'], { color: string; label: string }> = {
    scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Programada' },
    checked_in: { color: 'bg-yellow-100 text-yellow-800', label: 'Check-in' },
    done: { color: 'bg-green-100 text-green-800', label: 'Completada' },
    no_show: { color: 'bg-orange-100 text-orange-800', label: 'No presentó' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelada' },
  };
  const badge = badges[status];
  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
      {getStatusIcon(status)}
      <span>{badge.label}</span>
    </span>
  );
};

interface AppointmentTableProps {
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (id: string) => void;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'petName'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAppointments = mockAppointments.filter(
    (apt) =>
      apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.vet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    const order = sortOrder === 'asc' ? 1 : -1;
    return aValue < bValue ? -order : order;
  });

  const handleSort = (field: 'date' | 'petName') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: 'date' | 'petName' }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Citas Programadas</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Búsqueda */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Buscar por mascota, cliente o veterinario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla responsiva */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('petName')}>
                  <div className="flex items-center space-x-2">
                    <span>Mascota</span>
                    <SortIcon field="petName" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('date')}>
                  <div className="flex items-center space-x-2">
                    <span>Fecha & Hora</span>
                    <SortIcon field="date" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Veterinario
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {appointment.petName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {appointment.customerName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(`${appointment.date}T${appointment.time}`).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {appointment.vet}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(appointment.status)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onEdit?.(appointment)}
                        className="p-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete?.(appointment.id)}
                        className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {sortedAppointments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron citas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { AppointmentTable };
