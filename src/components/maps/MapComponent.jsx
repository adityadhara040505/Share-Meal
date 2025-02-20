import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

const MapComponent = () => {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  const center = userLocation || {
    lat: 0,
    lng: 0
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Fetch donations with locations
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/donations/locations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: '/user-location.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }}
          />
        )}

        {/* Donation markers */}
        {donations.map((donation) => (
          <Marker
            key={donation._id}
            position={{
              lat: donation.location.coordinates[1],
              lng: donation.location.coordinates[0]
            }}
            onClick={() => setSelectedDonation(donation)}
            icon={{
              url: donation.isUrgent ? '/urgent-donation.png' : '/donation.png',
              scaledSize: new window.google.maps.Size(30, 30)
            }}
          />
        ))}

        {/* Info window for selected donation */}
        {selectedDonation && (
          <InfoWindow
            position={{
              lat: selectedDonation.location.coordinates[1],
              lng: selectedDonation.location.coordinates[0]
            }}
            onCloseClick={() => setSelectedDonation(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedDonation.foodType}</h3>
              <p>Quantity: {selectedDonation.quantity}</p>
              <p>Expires: {new Date(selectedDonation.expiryDate).toLocaleDateString()}</p>
              {selectedDonation.isUrgent && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Urgent
                </span>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent; 