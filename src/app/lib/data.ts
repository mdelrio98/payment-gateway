// Fetching data functions
/* 
 * export async function fetchRevenue() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
} 
 */

import { FiatCurrency, ICurrency } from "./definitions";
import { Option } from '../lib/definitions';
import { NextApiRequest, NextApiResponse } from "next";



export default async function fetchCurrencies() {
  try {
    // Perform the API request to currencies_list endpoint
    const response = await fetch("https://payments.pre-bnvo.com/api/v1/currencies", {
      method: "GET",
      headers: {
        "X-Device-Id": "fdacd808-23e9-4f09-8ff9-b4325b7c2c62",
        // Add any other required headers here
      },
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response JSON
    const data = await response.json();
    return data as ICurrency[];

  } catch (error) {
    console.error("Error fetching currencies_list:", error);
  }
}

export const fiatCurrencyOptions: Option<FiatCurrency>[] = Object.keys(FiatCurrency)
  .map((key) => ({
    label: key,
    value: FiatCurrency[key as keyof typeof FiatCurrency],
  }));
