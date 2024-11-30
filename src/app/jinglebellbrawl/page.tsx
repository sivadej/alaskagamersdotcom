'use client';
import Image from 'next/image';
import { useState } from 'react';

async function SignUpForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [prevValue, setPrevValue] = useState('');
  const [status, setStatus] = useState<
    'INIT' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'
  >('INIT');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SUBMITTING');

    try {
      const response = await fetch('/api/reminders-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      console.log(response);
      console.log('um', response.status);

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        setMessage('Phone number saved successfully');
        setStatus('SUCCESS');
      } else {
        throw new Error();
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setStatus('ERROR');
    }
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value === '1' ||
      e.target.value === '0' ||
      e.target.value === '+'
    ) {
      return;
    }

    const input = e.target.value.replace(/[^\d]/g, '');
    const isBackspace = e.target.value.length < prevValue.length;

    if (isBackspace && input.length < phoneNumber.length) {
      setPhoneNumber(input);
    } else if (input.length <= 10) {
      setPhoneNumber(input);
    }

    setPrevValue(e.target.value);
  };

  return (
    <>
      {status === 'SUCCESS' ? (
        <div>
          Thanks! You&apos;ll receive texts about Jingle Bell Brawl and other
          AlaskaGamers events!
        </div>
      ) : (
        <>
          <h3>Enter your phone number to receive text updates:</h3>
          <form onSubmit={handleSubmit} className="mt-2 m-auto">
            <input
              type="tel"
              value={formatPhoneNumber(phoneNumber)}
              onChange={handleInputChange}
              placeholder="(907) 555-1234"
              className="bg-gray-800 p-2 mb-1 w-40"
              disabled={status === 'SUBMITTING'}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 ml-1">
              {status === 'SUBMITTING' ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          <div className="text-gray-400 text-sm">
            By entering your phone number, you agree to receive text messages
            from AlaskaGamers. Message and data rates may apply. Reply STOP at
            any time to unsubscribe.
          </div>
        </>
      )}
    </>
  );
}

export default function Page() {
  return (
    <div className="m-auto text-center mt-8">
      <Image
        src="/events/jbbrawl_v1.png"
        alt=""
        width={748}
        height={965}
        className="inline"
      />
      <h1 className="mt-8 mb-12 text-2xl">More info coming soon!</h1>
      {process.env.NODE_ENV === 'development' ? <SignUpForm /> : null}

      <div className="mt-12">
        <a href="/" className="text-blue-500">
          Return to Homepage
        </a>
      </div>
    </div>
  );
}
