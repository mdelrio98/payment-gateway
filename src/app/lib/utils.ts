/**
 * export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};
 */

import { CreateOrderRequest, FiatCurrency } from "./definitions";


export let staticOrderData: CreateOrderRequest = {
  expected_output_amount: 0,
  fiat: FiatCurrency.EUR,
  input_currency: 'BTC',
  merchant_urlko: 'https://example.com/ko',
  merchant_urlok: 'https://example.com/ok',
  merchant_url_standby: 'https://example.com/standby',
  notes: 'Product or service description',
  reference: '123456789',
  language: 'ES',
  front_dni: new File(['front_dni_image_data'], 'front_dni.jpg', { type: 'image/jpeg' }),
  back_dni: new File(['back_dni_image_data'], 'back_dni.jpg', { type: 'image/jpeg' }),
  first_name: 'John',
  surname: 'Doe',
  address_name: '123 Main St',
  address_additional: 'Apt 4B',
  address_number: '123',
  zip_code: '12345',
  city: 'Cityville',
  province: 'Stateville',
  country: 'US',
  email: 'john.doe@example.com',
  phone_number: '+1234567890',
  nif: '123456789',
  referral_id: 'REF123',
  internal_data: 'Additional data for the merchant',
};
