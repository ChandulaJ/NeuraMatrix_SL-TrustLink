const API_BASE_URL = 'http://localhost:3000';

export const getServiceById = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);
    if (!response.ok) throw new Error('Failed to fetch service');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
