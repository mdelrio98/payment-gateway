'use client'
import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import Dropdown from "../ui/Dropdown";
import { fetchCurrencies, createOrder, fiatCurrencyOptions } from "../lib/data";
import { ICurrency, Option } from '../lib/definitions';
import Card from "../ui/Card";
import Input from "../ui/Input";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup.js";
import { staticOrderData } from "../lib/utils";

type FormValues = {
  amount: number;
  currency: string;
  concept: string;
};

const schema = (selectedCurrency: ICurrency | undefined) => yup.object().shape({
  amount: yup.number()
  .min(Number(selectedCurrency?.min_amount), `El valor mínimo es ${selectedCurrency?.min_amount}`)
  .max(Number(selectedCurrency?.max_amount), `El valor máximo es ${selectedCurrency?.max_amount}`).required("Este campo es obligatorio"),
  currency: yup.string().required("Este campo es obligatorio"),
  concept: yup.string().required("Este campo es obligatorio"),
});
const PaymentForm = () => {
  const [selectedOption, setSelectedOption] = useState<Option<string> | undefined>(undefined);
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency | undefined>();
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  
  

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema(selectedCurrency)),
    defaultValues: { amount: 0,currency:'',concept:'' }
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchCurrencies();
      if (response) {
        setCurrencies(response);
      }
    };

    fetchData();
  }, []);


  const handlePaymentSubmit = async (data:FormValues) => {
    const orderData = {
      ...staticOrderData,
      input_currency: data.currency,
      expected_output_amount: data.amount,
      notes: data.concept,
    };

    const response = await createOrder(orderData);
    console.log(response);
  };

  return (
    <Card>
      <form className="w-full flex flex-col gap-8" onSubmit={handleSubmit((data) => handlePaymentSubmit(data))}>
        <h3 style={{ color: '#002859' }} className="font-bold justify-center text-center items-center">Crear pago</h3>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
            {...field}
            onChange={(e) => field.onChange(e)}
            value={field.value ?? 0}
            label="Importe a pagar:"
            placeholder="Añade importe a pagar"
            error={errors.amount?.message}
            />
          )}
        />
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <Dropdown
            {...field}
              label="Seleccionar moneda:"
              placeholder={selectedOption?.label ?? 'Moneda'}
              options={currencies.map(currency => ({ label: currency.name, value: currency.symbol } as Option<string>)) ?? []}
              value={field.value ?? ''}
              onChange={(e) => {
                setSelectedCurrency(currencies.find((option) => String(option.symbol) === e.currentTarget.value));
                setSelectedOption({ label: selectedCurrency?.name, value: selectedCurrency?.symbol } as Option<string>)
                field.onChange(e)}}
            />
          )}
        />
        <Controller
          name="concept"
          control={control}
          render={({ field }) => (
            <TextArea
            {...field}
              onChange={(e) => field.onChange(e)}
              value={field.value ?? ''}
              label="Concepto:"
              placeholder="Añade descripcion del pago"
              rows={5}
              error={errors.concept?.message}
            />
          )}
        />
        <button type="submit" className="relative min-w-full flex justify-center items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-opacity-90 bg-blue-500 active:bg-blue-600 py-4 text-white">
          Continuar
        </button>
      </form>
    </Card>
  );
};

export default PaymentForm;