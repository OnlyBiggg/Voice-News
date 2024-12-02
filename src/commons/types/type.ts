interface SuccessResponse<T> {
    status: number;
    data: T;
    message: string;
  }
  
export interface ErrorResponse {
    status: number;
    error: {
      code: number;
      message: string;
      details?: Record<string, any>;
    };
  }
  
export  interface Article {
    id: string;
    title: string;
    short_intro: string;
    image_url: string;
    date: string;
    audio_title: string;
    audio_shortintro: string;
  }
export  interface ArticleDetail {
        id: string;
        title: string;
        content: string;
        date: string;
        author: string;
        url:  string;
        image_url: string;
        audio_title: string;
        audio_shortintro: string;
        audio_content: string;
  }
export  type APIResponse<T> = SuccessResponse<T>