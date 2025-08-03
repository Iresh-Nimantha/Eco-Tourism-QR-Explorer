// src/components/ContactForm.tsx
import React, { useState } from 'react';

// ContactForm component for the main page section
const ContactForm = () => { // Renamed from 'App' to 'ContactForm'
  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Phone number is now optional
    subject: '',
    message: '',
  });

  // State for form submission status and messages
  const [submissionStatus, setSubmissionStatus] = useState<null | 'success' | 'error' | 'submitting'>(null);
  // State for individual field errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Phone number error state
    subject: '',
    message: '',
  });

  // Handle input changes and update form data state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for the field as user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setSubmissionStatus('submitting'); // Set status to submitting

    // Reset errors
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });

    let hasError = false;
    const newErrors = { ...errors };

    // Client-side validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
      hasError = true;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
      hasError = true;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      hasError = true;
    }
    // Removed: Phone number validation is no longer required
    // if (!formData.phone.trim()) {
    //   newErrors.phone = 'Phone number is required.';
    //   hasError = true;
    // }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
      hasError = true;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      setSubmissionStatus('error');
      setTimeout(() => setSubmissionStatus(null), 5000); // Clear general error message after 5 seconds
      return;
    }

    // Simulate an API call for form submission
    console.log('Form Data Submitted:', formData);
    try {
      // Replace this with your actual API endpoint for sending emails
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (response.ok) {
        setSubmissionStatus('success');
        setFormData({ // Clear form after successful submission
          firstName: '',
          lastName: '',
          email: '',
          phone: '', // Clear phone field as well
          subject: '',
          message: '',
        });
      // } else {
      //   setSubmissionStatus('error');
      //   console.error('Form submission failed:', response.statusText);
      // }
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Error during form submission:', error);
    } finally {
      // Clear submission status messages after a few seconds
      setTimeout(() => setSubmissionStatus(null), 5000);
    }
  };

  return (
    // Main container for the contact form, centered and responsive
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max- full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Contact Form</h1>
        <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
          
          Let us know your questions, suggestions, and concerns by filling out the contact form below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Name*
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First"
                  className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                  required
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last"
                  className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                  required
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@example.com"
              className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone field (now optional) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="### ### ####"
              className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
              // 'required' attribute removed
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Message Subject field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Message subject*
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Request"
              className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
              required
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>

          {/* Message field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message*
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Your message here..."
              className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-y`}
              required
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>

          {/* Submission status messages with enhanced UI */}
          {submissionStatus === 'submitting' && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md relative" role="alert">
              <strong className="font-bold">Sending!</strong>
              <span className="block sm:inline ml-2">Your message is being sent...</span>
            </div>
          )}
          {submissionStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">Your message has been sent successfully.</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setSubmissionStatus(null)}>
                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 2.65a1.2 1.2 0 1 1-1.697-1.697l2.75-2.75a1.2 1.2 0 0 1 0-1.697l-2.75-2.75a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697l-2.75 2.75a1.2 1.2 0 0 1 0 1.697l2.75 2.75a1.2 1.2 0 0 1 0 1.697z"/></svg>
              </span>
            </div>
          )}
          {submissionStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">Please correct the errors and try again.</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setSubmissionStatus(null)}>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 2.65a1.2 1.2 0 1 1-1.697-1.697l2.75-2.75a1.2 1.2 0 0 1 0-1.697l-2.75-2.75a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697l-2.75 2.75a1.2 1.2 0 0 1 0 1.697l2.75 2.75a1.2 1.2 0 0 1 0 1.697z"/></svg>
              </span>
            </div>
          )}

          {/* Send Message button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold text-lg transition duration-200 ease-in-out"
            disabled={submissionStatus === 'submitting'} // Disable button while submitting
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
