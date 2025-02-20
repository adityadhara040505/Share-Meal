import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VolunteerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    availability: [],
    vehicle: '',
    area: '',
    experience: '',
    phoneNumber: '',
    emergencyContact: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availabilityOptions = [
    'Monday Morning',
    'Monday Evening',
    'Tuesday Morning',
    'Tuesday Evening',
    'Wednesday Morning',
    'Wednesday Evening',
    'Thursday Morning',
    'Thursday Evening',
    'Friday Morning',
    'Friday Evening',
    'Saturday',
    'Sunday'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedAvailability = checked
        ? [...formData.availability, value]
        : formData.availability.filter(day => day !== value);
      
      setFormData(prev => ({
        ...prev,
        availability: updatedAvailability
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/volunteers/signup', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/volunteer/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to sign up as volunteer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Volunteer Registration</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Availability</h3>
          <div className="grid grid-cols-2 gap-4">
            {availabilityOptions.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.availability.includes(option)}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vehicle Type
          </label>
          <select
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select vehicle type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
            <option value="none">No Vehicle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Area
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your preferred area for volunteering"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Previous Experience
          </label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe your previous volunteering experience (if any)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Emergency Contact
          </label>
          <input
            type="tel"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Register as Volunteer'}
        </button>
      </form>
    </div>
  );
};

export default VolunteerSignup; 