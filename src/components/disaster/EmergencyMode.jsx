import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const EmergencyMode = () => {
  const { user } = useAuth();
  const [emergencyStatus, setEmergencyStatus] = useState({
    active: false,
    location: '',
    description: '',
    requiredItems: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmergencyStatus();
  }, []);

  const fetchEmergencyStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/emergency/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmergencyStatus(response.data);
    } catch (error) {
      setError('Failed to fetch emergency status');
    } finally {
      setLoading(false);
    }
  };

  const toggleEmergencyMode = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/emergency/toggle', {
        active: !emergencyStatus.active,
        location: emergencyStatus.location,
        description: emergencyStatus.description,
        requiredItems: emergencyStatus.requiredItems
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmergencyStatus(response.data);
    } catch (error) {
      setError('Failed to toggle emergency mode');
    }
  };

  const updateEmergencyDetails = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/emergency/update', emergencyStatus, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmergencyStatus(response.data);
    } catch (error) {
      setError('Failed to update emergency details');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Emergency Mode</h2>
            <button
              onClick={toggleEmergencyMode}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                emergencyStatus.active
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {emergencyStatus.active ? 'Deactivate Emergency' : 'Activate Emergency'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {emergencyStatus.active && (
            <form onSubmit={updateEmergencyDetails} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Location
                </label>
                <input
                  type="text"
                  value={emergencyStatus.location}
                  onChange={(e) => setEmergencyStatus(prev => ({
                    ...prev,
                    location: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Description
                </label>
                <textarea
                  value={emergencyStatus.description}
                  onChange={(e) => setEmergencyStatus(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Items
                </label>
                <div className="space-y-2">
                  {emergencyStatus.requiredItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...emergencyStatus.requiredItems];
                          newItems[index] = e.target.value;
                          setEmergencyStatus(prev => ({
                            ...prev,
                            requiredItems: newItems
                          }));
                        }}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEmergencyStatus(prev => ({
                            ...prev,
                            requiredItems: prev.requiredItems.filter((_, i) => i !== index)
                          }));
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setEmergencyStatus(prev => ({
                        ...prev,
                        requiredItems: [...prev.requiredItems, '']
                      }));
                    }}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Item
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Emergency Details
              </button>
            </form>
          )}

          {emergencyStatus.active && (
            <div className="mt-8 p-4 bg-red-50 rounded-lg">
              <h3 className="text-lg font-medium text-red-800 mb-2">Emergency Mode Active</h3>
              <p className="text-sm text-red-600">
                All donations in this area will be marked as urgent and prioritized for immediate pickup.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyMode; 