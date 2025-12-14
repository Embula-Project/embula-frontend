import apiClient from './ApiClient';

export async function fetchMenu(page =0,size=10){
    try{
        const response = await apiClient.get(`/api/v1/fooditem/getAllFoodItems`,{
            params:{page,size},
        });
        return response.data;
    }catch(error){
        console.error('Failed to fetch menu:', error.message);
        throw new Error(error.message || 'Failed to fetch menu');
    }
}