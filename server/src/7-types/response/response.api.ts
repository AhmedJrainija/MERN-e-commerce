export interface ApiVoidResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T> extends ApiVoidResponse {
  data: T;
}