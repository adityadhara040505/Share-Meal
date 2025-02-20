import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../maps/MapComponent';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [volunteerStatus, setVolunteerStatus] = useState('');

  useEffect(() => {
    fetchDonationDetails();
  }, [fetchDonationDetails]);

  const fetchDonationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonation(response.data);
    } catch (error) {
      setError('Failed to fetch donation details');
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteer = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/donations/${id}/volunteer`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVolunteerStatus('success');
      fetchDonationDetails(); // Refresh donation details
    } catch (error) {
      setVolunteerStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">{donation.foodType}</h2>
            {donation.isUrgent && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                Urgent
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Donation Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Quantity:</span> {donation.quantity}</p>
                <p><span className="font-medium">Expiry Date:</span> {new Date(donation.expiryDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> {donation.status}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Pickup Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Address:</span> {donation.pickupAddress}</p>
                <p><span className="font-medium">Contact:</span> {donation.donor.name}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{donation.description}</p>
          </div>

          {/* Map showing donation location */}
          <div className="mb-6 h-64">
            <MapComponent
              center={{
                lat: donation.location.coordinates[1],
                lng: donation.location.coordinates[0]
              }}
              markers={[{
                id: donation._id,
                position: {
                  lat: donation.location.coordinates[1],
                  lng: donation.location.coordinates[0]
                },
                isUrgent: donation.isUrgent
              }]}
            />
          </div>

          {/* Volunteer action */}
          {donation.status === 'available' && (
            <div className="flex justify-center">
              <button
                onClick={handleVolunteer}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Volunteer for Pickup
              </button>
            </div>
          )}

          {volunteerStatus === 'success' && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Successfully volunteered for pickup!
            </div>
          )}

          {volunteerStatus === 'error' && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Failed to volunteer for pickup. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDetails; 