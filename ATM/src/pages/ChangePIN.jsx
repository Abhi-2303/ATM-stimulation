import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../css/cardpin.css';
import Pininp from '../componants/pinInp';

function ChangePIN() {
  const [step, setStep] = useState(0);
  const [pins, setPins] = useState({
    oldPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const titles = ["Enter Old PIN", "Enter New PIN", "Re-enter New PIN"];

  const handleContinue = async () => {
    const { oldPin, newPin, confirmPin } = pins;
    const token = localStorage.getItem('token');

    try {
      if (step === 0) {
        if (oldPin.length === 4) {
          const response = await axios.post(
            'http://localhost:5000/api/change-pin',
            { oldPin },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.message === 'New PIN is required') {
            setStep(1);
            setError('');
          } else {
            setError('Invalid old PIN. Please try again.');
          }
        } else {
          setError('Please enter a 4-digit PIN.');
        }
      } else if (step === 1) {
        if (newPin.length === 4) {
          setStep(2);
          setError('');
        } else {
          setError('Please enter a 4-digit new PIN.');
        }
      } else if (step === 2) {
        if (confirmPin.length === 4) {
          if (newPin === confirmPin) {
            const response = await axios.post(
              'http://localhost:5000/api/change-pin',
              { oldPin, newPin },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.message === 'PIN updated successfully!') {
              alert('PIN changed successfully!');
              navigate('/dashboard'); 
            } else {
              setError(response.data.message || 'Error changing PIN');
            }
          } else {
            setError('Pins do not match. Please try again.');
          }
        } else {
          setError('Please re-enter the 4-digit new PIN.');
        }
      }
    } catch (error) {
      setError(error.response?.data.message || 'Error processing your request');
    }
  };

  const handlePinInput = (pin) => {
    setPins((prevPins) => {
      if (step === 0) {
        return { ...prevPins, oldPin: pin };
      } else if (step === 1) {
        return { ...prevPins, newPin: pin };
      } else if (step === 2) {
        return { ...prevPins, confirmPin: pin };
      }
    });
  };

  return (
    <div className="card-container">
      <h1>{titles[step]}</h1>
      <div className="input">
        <Pininp
          key="pininp"
          value={step === 0 ? pins.oldPin : step === 1 ? pins.newPin : pins.confirmPin}
          setValue={handlePinInput}
        />
      </div>
      <div className="button">
        <button onClick={handleContinue} className="continue">
          {step === 2 ? 'Submit' : 'Continue'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default ChangePIN;
