import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UrgentDonations = () => {
  const [urgentDonations, setUrgentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrgentDonations();
  }, []);

  const fetchUrgentDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/donations/urgent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUrgentDonations(response.data);
    } catch (error) {
      setError('Failed to fetch urgent donations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Urgent Donations</h2>
        <Link
          to="/donate"
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Create Urgent Donation
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {urgentDonations.map((donation) => (
          <div
            key={donation._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-red-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{donation.foodType}</h3>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  Urgent
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Quantity: {donation.quantity}</p>
                <p className="text-gray-600">
                  Expires: {new Date(donation.expiryDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Location: {donation.pickupAddress}</p>
                {donation.description && (
                  <p className="text-gray-600">{donation.description}</p>
                )}
              </div>
              <div className="mt-4">
                <Link
                  to={`/donations/${donation._id}`}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {urgentDonations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No urgent donations at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default UrgentDonations; 