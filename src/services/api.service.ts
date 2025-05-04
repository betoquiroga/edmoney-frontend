import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

export class ApiService {
  private api: AxiosInstance
  private static instance: ApiService

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Get token from localStorage if it exists
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null

        // Add token to headers if it exists
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle specific error status codes
        if (error.response) {
          const { status } = error.response

          // Handle 401 Unauthorized
          if (status === 401) {
            // Clear token and redirect to login
            if (typeof window !== "undefined") {
              localStorage.removeItem("token")
              // Redirect to login page
              window.location.href = "/login"
            }
          }

          // Handle 403 Forbidden
          if (status === 403) {
            console.error("Permission denied")
          }

          // Handle 404 Not Found
          if (status === 404) {
            console.error("Resource not found")
          }

          // Handle 500 Server Error
          if (status >= 500) {
            console.error("Server error occurred")
          }
        }

        return Promise.reject(error)
      },
    )
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  // Generic GET method
  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config)
  }

  // Generic POST method
  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config)
  }

  // Generic PUT method
  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config)
  }

  // Generic PATCH method
  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config)
  }

  // Generic DELETE method
  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config)
  }

  // Upload files
  public async uploadFile<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    })
  }

  // Download files
  public async downloadFile(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Blob> {
    const response = await this.api.get(url, {
      ...config,
      responseType: "blob",
    })
    return response.data
  }
}
