// Fetching data functions

import {
  CreateOrderRequest,
  CreateOrderResponse,
  FiatCurrency,
  ICurrency,
  OrderInfoResponse
} from './definitions';
import { PromiseResult, handleErrorResponse, promiseResultWrapper } from './utils';

export const X_Device_Id = 'fdacd808-23e9-4f09-8ff9-b4325b7c2c62';

export async function getCurrencies() {
  try {
    const response = await fetch('https://payments.pre-bnvo.com/api/v1/currencies', {
      method: 'GET',
      headers: {
        'X-Device-Id': X_Device_Id
      }
    });

    if (!response.ok) {
      handleErrorResponse(response);
    }

    const data = await response.json();
    return data as ICurrency[];
  } catch (error) {
    console.error('Error fetching currencies_list:', error);
  }
}

export async function createOrder(requestBody: CreateOrderRequest): Promise<CreateOrderResponse> {
  try {
    const formData = new FormData();

    Object.entries(requestBody).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await fetch('https://payments.pre-bnvo.com/api/v1/orders/', {
      method: 'POST',
      headers: {
        'X-Device-Id': X_Device_Id
      },
      body: formData
    });

    if (!response.ok) {
      handleErrorResponse(response);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}

export const getOrderInfo = async (identifier: string): Promise<OrderInfoResponse> => {
  const url = `https://payments.pre-bnvo.com/api/v1/orders/info/${identifier}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Device-Id': X_Device_Id
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      handleErrorResponse(response);
    }

    const data = await response.json();
    return data[0] as OrderInfoResponse;
  } catch (error) {
    console.error('Error fetching order information:', error);
    throw error;
  }
};
