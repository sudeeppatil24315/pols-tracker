import { Phone, Ambulance, AlertTriangle, Wrench } from 'lucide-react';

interface EmergencyServicesProps {
  vehicleId: string;
  location: { lat: number; lng: number };
}

export default function EmergencyServices({ vehicleId, location }: EmergencyServicesProps) {
  const services = [
    {
      name: 'Police',
      icon: <AlertTriangle size={20} />,
      number: '100',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Ambulance',
      icon: <Ambulance size={20} />,
      number: '108',
      color: 'bg-red-600 hover:bg-red-700',
    },
    {
      name: 'Roadside',
      icon: <Wrench size={20} />,
      number: '+91-1800-XXX-XXXX',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      name: 'Dispatch',
      icon: <Phone size={20} />,
      number: '+91-98765-43210',
      color: 'bg-[#F9D71C] hover:bg-[#e5c619] text-black',
    },
  ];

  const handleCall = (service: string, number: string) => {
    // In production, this would trigger actual call or send alert
    alert(`Calling ${service}: ${number}\nVehicle: ${vehicleId}\nLocation: ${location.lat}, ${location.lng}`);
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
        <AlertTriangle size={16} className="mr-2" />
        Emergency Services
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {services.map((service) => (
          <button
            key={service.name}
            onClick={() => handleCall(service.name, service.number)}
            className={`${service.color} p-3 rounded-lg transition flex flex-col items-center justify-center space-y-1`}
          >
            {service.icon}
            <span className="text-xs font-semibold">{service.name}</span>
            <span className="text-xs opacity-80">{service.number}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
