'use client'
import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import Dropdown from "../ui/Dropdown";
import fetchCurrencies, { fiatCurrencyOptions } from "../lib/data";
import { ICurrency, Option } from '../lib/definitions';
import Card from "../ui/Card";
import Input from "../ui/Input";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup.js";

const schema = yup.object().shape({
  amount: yup.number().required("Este campo es obligatorio"),
  currency: yup.string().required("Este campo es obligatorio"),
  concept: yup.string().required("Este campo es obligatorio"),
});

type FormValues = {
  amount: number;
  currency: string;
  concept: string;
};

const PaymentForm = () => {
  const [selectedOption, setSelectedOption] = useState<Option<string> | null>(null);
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema),
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

  const handleSelect = (option: Option<string>) => {
    setSelectedOption(option);
  };

  const mySubmit = (data:FormValues) => {
    console.log(data);
  };

  return (
    <Card>
      <form className="w-full flex flex-col gap-8" onSubmit={handleSubmit((data) => mySubmit(data))}>
        <h3 style={{ color: '#002859' }} className="font-bold justify-center text-center items-center">Crear pago</h3>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
            {...field}
            onChange={(e) => field.onChange(e)}
            value={field.value ?? ''}
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
              onSelect={(e) => {field.onChange(e)}}
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
        <Button type="submit">
          Continuar
        </Button>
      </form>
    </Card>
  );
};

export default PaymentForm;
