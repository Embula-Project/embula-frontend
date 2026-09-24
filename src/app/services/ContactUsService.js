/**
 * Contact Us Service - Handles Contact Us form submissions
 */

import apiClient from './ApiClient';

const CONTACT_US_BASE_URL = '/api/v1/contact-us';

/**
 * Submit a Contact Us inquiry (complaint, feedback or suggestion)
 * @param {Object} contactData - Contact Us form data
 * @param {string} contactData.name - Sender's name
 * @param {string} contactData.email - Sender's email
 * @param {string} [contactData.phone] - Sender's phone number
 * @param {'COMPLAINT'|'FEEDBACK'|'SUGGESTION'} contactData.complaintType - Type of inquiry
 * @param {string} contactData.description - Message body
 * @returns {Promise<Object>} Created inquiry response
 */
export async function submitContactUs(contactData) {
  try {
    const response = await apiClient.post(CONTACT_US_BASE_URL, contactData);

    console.log('Contact Us submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to submit Contact Us form:', error.message);
    throw error;
  }
}
