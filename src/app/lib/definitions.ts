// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.

export interface ICurrency {
  symbol: string;
  name: string;
  min_amount: string;
  max_amount: string;
  image: string;
  blockchain: string;
}

export interface Order {
  identifier: string;
  reference: string;
  created_at: string;
  edited_at: string;
  status: OrderStatus;
  fiat_amount: number;
  crypto_amount: number | null;
  unconfirmed_amount: number;
  confirmed_amount: number;
  currency_id: string;
  merchant_device_id: number;
  merchant_device: string;
  address: string | null;
  tag_memo: string | null;
  url_ko: string | null;
  url_ok: string | null;
  url_standby: string | null;
  expired_time: string | null;
  good_fee: boolean;
  notes: string;
  rbf: boolean;
  safe: boolean;
  fiat: FiatCurrency;
  language: string;
  percentage: number;
  received_amount: number;
  balance_based: string;
  internal_data: string;
  transactions: Transaction[];
}

export enum OrderStatus {
  NR = 'NR',
  PE = 'PE',
  AC = 'AC',
  IA = 'IA',
  CO = 'CO',
  CA = 'CA',
  EX = 'EX',
  OC = 'OC',
  RF = 'RF',
  FA = 'FA',
  DE = 'DE'
}

export interface Transaction {
  confirmed: boolean;
  currency: string;
  amount: number;
  tx_hash: string;
  block: number;
  created_at: string;
}

export interface CreateOrderRequest {
  expected_output_amount: number;
  input_currency: string;
  merchant_urlko: string;
  merchant_urlok: string;
  merchant_url_standby: string;
  notes: string;
  reference: string;
  fiat: FiatCurrency;
  language: string;
  front_dni: File;
  back_dni: File;
  first_name: string;
  surname: string;
  address_name: string;
  address_additional: string;
  address_number: string;
  zip_code: string;
  city: string;
  province: string;
  country: string;
  email: string;
  phone_number: string;
  nif: string;
  referral_id: string;
  internal_data: string;
}

export interface CreateOrderResponse {
  identifier: string;
  reference: string;
  payment_uri: string;
  web_url: string;
  address: string | null;
  tag_memo: string | null;
  input_currency: string | null;
  expected_input_amount: number | null;
  rate: number | null;
  notes: string;
  fiat: FiatCurrency;
  language: string;
}

export interface OrderInfoResponse {
  identifier: string;
  reference: string | null;
  created_at: string;
  edited_at: string;
  status: OrderStatus;
  fiat_amount: number;
  crypto_amount: number | null;
  unconfirmed_amount: number;
  confirmed_amount: number;
  currency_id: string;
  merchant_device_id: number;
  merchant_device: string;
  address: string | null;
  tag_memo: string | null;
  url_ko: string | null;
  url_ok: string | null;
  url_standby: string | null;
  expired_time: string | null;
  good_fee: boolean;
  notes: string;
  rbf: boolean;
  safe: boolean;
  fiat: FiatCurrency;
  language: string;
  percentage: number;
  received_amount: number;
  balance_based: string;
  internal_data: string;
  transactions: Transaction[];
}

export enum FiatCurrency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  ARS = 'ARS',
  AUD = 'AUD',
  BGN = 'BGN',
  BOB = 'BOB',
  BRL = 'BRL',
  CAD = 'CAD',
  CHF = 'CHF',
  CLP = 'CLP',
  COP = 'COP',
  DKK = 'DKK',
  DOP = 'DOP',
  GEL = 'GEL',
  HUF = 'HUF',
  ISK = 'ISK',
  JPY = 'JPY',
  KRW = 'KRW',
  MXN = 'MXN',
  NOK = 'NOK',
  NZD = 'NZD',
  PEN = 'PEN',
  PLN = 'PLN',
  PYG = 'PYG',
  RON = 'RON',
  SEK = 'SEK',
  SGD = 'SGD',
  SVC = 'SVC',
  UYU = 'UYU'
}

export interface Time {
  minutes: number;
  seconds: number;
}

export const Status = {
  NR: 'Not Ready',
  PE: 'Pending',
  AC: 'Awaiting Completion',
  IA: 'Insufficient Amount',
  CO: 'Completed',
  RF: 'Refunded',
  CA: 'Cancelled',
  EX: 'Expired',
  OC: 'Out of Condition',
  FA: 'Failed'
};
