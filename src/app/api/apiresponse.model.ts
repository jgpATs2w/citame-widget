export interface ApiResponse{
  success: boolean;
  data?: any;
  message?: string;
  status?: number;
}

export const mapResponse= (response) : ApiResponse =>{
  const asJson= response.json();

  return {
    success: asJson.success == 'true' || false,
    data: asJson.data || null,
    message: asJson.message || '',
    status: response.status
  }
};


export const noConnectionResponse: ApiResponse= {success: false, message: 'no connection', data: null};
