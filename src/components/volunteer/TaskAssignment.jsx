import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TaskAssignment = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDonation, setSelectedDonation] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [volunteersRes, donationsRes] = await Promise.all([
        axios.get('/api/volunteers/available', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/donations/unassigned', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setVolunteers(volunteersRes.data);
      setDonations(donationsRes.data);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/tasks/assign', {
        donationId: selectedDonation,
        volunteerId: selectedVolunteer,
        note: assignmentNote
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form and refresh data
      setSelectedDonation('');
      setSelectedVolunteer('');
      setAssignmentNote('');
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Task Assignment</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAssignment} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Donation
          </label>
          <select
            value={selectedDonation}
            onChange={(e) => setSelectedDonation(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Choose a donation</option>
            {donations.map((donation) => (
              <option key={donation._id} value={donation._id}>
                {donation.foodType} - {donation.quantity} - {donation.pickupAddress}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Volunteer
          </label>
          <select
            value={selectedVolunteer}
            onChange={(e) => setSelectedVolunteer(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Choose a volunteer</option>
            {volunteers.map((volunteer) => (
              <option key={volunteer._id} value={volunteer._id}>
                {volunteer.name} - {volunteer.area} - {volunteer.vehicle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Note
          </label>
          <textarea
            value={assignmentNote}
            onChange={(e) => setAssignmentNote(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Add any specific instructions for the volunteer..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Assigning...' : 'Assign Task'}
        </button>
      </form>

      {/* Current Assignments Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Current Assignments</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {donations
              .filter(donation => donation.assignedTo)
              .map(donation => (
                <li key={donation._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium">{donation.foodType}</h4>
                      <p className="text-sm text-gray-500">
                        Assigned to: {donation.assignedTo.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Pickup: {donation.pickupAddress}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Assigned
                      </span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignment; 