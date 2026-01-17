// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // Replace with your actual cloud name from your Cloudinary dashboard
const CLOUDINARY_API_KEY = '211969491125467'; // This is the API key you provided
const CLOUDINARY_UPLOAD_PRESET = 'iEshtHiCD5TFMu3QIojR93buaRk'; // This is the upload preset you provided

// For unsigned upload to Cloudinary (recommended for client-side)
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // The actual upload URL for unsigned uploads
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    fetch(url, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.secure_url) {
        resolve(data.secure_url);
      } else {
        reject(new Error(data.error?.message || 'Upload failed'));
      }
    })
    .catch(error => {
      console.error('Cloudinary upload error:', error);
      reject(error);
    });
  });
};

// Alternative method using unsigned upload (safer for client-side)
export const uploadImageToCloudinaryUnsigned = async (file: File, uploadPreset: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    // Note: This approach uses unsigned upload which is safer for client-side
    // The cloud name needs to be configured on your Cloudinary account
    const url = `https://api.cloudinary.com/v1_1/demo/image/upload`; // Replace 'demo' with your cloud name
    
    fetch(url, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.secure_url) {
        resolve(data.secure_url);
      } else {
        reject(new Error('Upload failed'));
      }
    })
    .catch(error => {
      console.error('Cloudinary upload error:', error);
      reject(error);
    });
  });
};