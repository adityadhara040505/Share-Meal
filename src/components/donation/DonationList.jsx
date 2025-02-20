import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    urgent: false
  });

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/donations', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setDonations(response.data);
    } catch (error) {
      setError('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFilters({
      ...filters,
      [e.target.name]: value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Food Donations</h2>
        <Link
          to="/donate"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Donation
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="cooked">Cooked Food</option>
          <option value="packaged">Packaged Food</option>
          <option value="fresh">Fresh Produce</option>
          <option value="grains">Grains</option>
        </select>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="urgent"
            checked={filters.urgent}
            onChange={handleFilterChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2">Urgent Only</span>
        </label>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.map((donation) => (
          <div
            key={donation._id}
            className="border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{donation.foodType}</h3>
              {donation.isUrgent && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-2">Quantity: {donation.quantity}</p>
            <p className="text-gray-600 mb-2">
              Expires: {new Date(donation.expiryDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-4">{donation.description}</p>
            <Link
              to={`/donations/${donation._id}`}
              className="text-indigo-600 hover:text-indigo-800"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationList; 