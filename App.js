import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';  // Import external CSS file for styling

function App() {
  const [credentials, setCredentials] = useState({
    name: '',
    passport: '',
    walletAddress: '',
    vaccinationStatus: '',
  });
  const [qrData, setQrData] = useState('');
  const [travelHistory, setTravelHistory] = useState([]);
  const [newTravel, setNewTravel] = useState({ destination: '', date: '', purpose: '' });
  const qrRef = useRef();

  useEffect(() => {
    const storedCredentials = JSON.parse(localStorage.getItem('web3Passport'));
    if (storedCredentials) {
      setCredentials(storedCredentials.credentials);
      setTravelHistory(storedCredentials.travelHistory);
      setQrData(JSON.stringify(storedCredentials));
    }
  }, []);

  useEffect(() => {
    if (qrData) {
      localStorage.setItem('web3Passport', JSON.stringify({ credentials, travelHistory }));
    }
  }, [qrData, credentials, travelHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.name && credentials.passport && credentials.walletAddress) {
      setQrData(JSON.stringify({ credentials, travelHistory }));
    }
  };

  const handleAddTravel = () => {
    if (newTravel.destination && newTravel.date && newTravel.purpose) {
      setTravelHistory((prev) => [...prev, newTravel]);
      setNewTravel({ destination: '', date: '', purpose: '' });
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'web3-passport-qr.png';
    link.click();
  };

  const handleReset = () => {
    setCredentials({ name: '', passport: '', walletAddress: '', vaccinationStatus: '' });
    setTravelHistory([]);
    setQrData('');
    localStorage.removeItem('web3Passport');
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src="/logo.png" alt="Web3 Passport" className="logo" />
        <h1>Web3 Passport Prototype</h1>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={credentials.name}
            onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Passport Number:</label>
          <input
            type="text"
            value={credentials.passport}
            onChange={(e) => setCredentials({ ...credentials, passport: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Wallet Address:</label>
          <input
            type="text"
            value={credentials.walletAddress}
            onChange={(e) => setCredentials({ ...credentials, walletAddress: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Vaccination Status:</label>
          <input
            type="text"
            value={credentials.vaccinationStatus}
            onChange={(e) => setCredentials({ ...credentials, vaccinationStatus: e.target.value })}
            placeholder="e.g., Fully Vaccinated"
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="generate-btn">Generate QR Code</button>
          <button
            type="button"
            onClick={handleReset}
            className="reset-btn"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="travel-history-container">
        <h3>Add Travel History</h3>
        <div>
          <input
            type="text"
            placeholder="Destination"
            value={newTravel.destination}
            onChange={(e) => setNewTravel({ ...newTravel, destination: e.target.value })}
          />
          <input
            type="date"
            value={newTravel.date}
            onChange={(e) => setNewTravel({ ...newTravel, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Purpose"
            value={newTravel.purpose}
            onChange={(e) => setNewTravel({ ...newTravel, purpose: e.target.value })}
          />
          <button onClick={handleAddTravel} className="add-travel-btn">Add</button>
        </div>
      </div>

      <div className="travel-history">
        <h3>Travel History:</h3>
        <ul>
          {travelHistory && travelHistory.length > 0 ? (
            travelHistory.map((trip, index) => (
              <li key={index}>
                {trip.destination} - {trip.date} ({trip.purpose})
              </li>
            ))
          ) : (
            <p>No travel history added yet.</p>
          )}
        </ul>
      </div>

      {qrData && (
        <div className="qr-container">
          <h3>Your QR Code:</h3>
          <div ref={qrRef}>
            <QRCodeCanvas value={qrData} />
          </div>
          <button onClick={handleDownload} className="download-btn">
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}

export default App;