'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import {
  Button,
  Input,
  Textarea,
  Card,
  Typography,
  Select,
  Option,
  Spinner
} from '@material-tailwind/react';
import { getCurrencies, createOrder } from '../lib/data';
import { ICurrency } from '../lib/definitions';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import { staticOrderData } from '../lib/utils';
import LoadingData from '../ui/LoadingData';
import { useRouter } from 'next/navigation';

export type FormValues = {
  amount: number;
  currency: string;
  concept: string;
};

const schema = (selectedCurrency: ICurrency | undefined) =>
  yup.object().shape({
    amount: yup
      .number()
      .min(
        Number(selectedCurrency?.min_amount),
        `El valor mínimo es ${selectedCurrency?.min_amount}`
      )
      .max(
        Number(selectedCurrency?.max_amount),
        `El valor máximo es ${selectedCurrency?.max_amount}`
      )
      .required('Este campo es obligatorio'),
    currency: yup.string().required('Este campo es obligatorio'),
    concept: yup.string().required('Este campo es obligatorio')
  });

const PaymentForm = () => {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency | undefined>();
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const styled =
    'p-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(schema(selectedCurrency)),
    defaultValues: { amount: undefined, currency: '', concept: '' }
  });

  const fetchCurrencies = async () => {
    setLoading(true);
    const response = await getCurrencies();
    if (response) {
      setCurrencies(response);
      setLoading(false);
    } else {
      router.push(`/error`);
      return;
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const redirectToSummary = (identifier: string) => {
    router.push(`/payment-summary?identifier=${identifier}`);
  };

  const handlePaymentSubmit = async (data: FormValues) => {
    const orderData = {
      ...staticOrderData,
      input_currency: data.currency,
      expected_output_amount: data.amount,
      notes: data.concept
    };

    try {
      const response = await createOrder(orderData);

      if (response) {
        const { identifier } = response;
        redirectToSummary(identifier);
      } else {
        router.push(`/error`);
        return;
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      router.push('/error');
    }
  };

  if (currencies.length < 1) {
    return <LoadingData></LoadingData>;
  }

  return (
    <Card
      className="w-full mt-2  p-8  flex justify-center items-center bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm md:max-w-md lg:max-w-lg h-full"
      placeholder={undefined}>
      <form
        className="w-full flex flex-col gap-6"
        onSubmit={handleSubmit((data) => handlePaymentSubmit(data))}>
        <Typography
          placeholder={undefined}
          variant="h1"
          style={{ color: '#002859' }}
          className="flex font-bold justify-center text-center items-center">
          Crear pago
        </Typography>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              id="amount"
              type="number"
              className={styled}
              crossOrigin={undefined}
              {...field}
              onChange={(e) => {
                field.onChange(e);
              }}
              value={field.value ?? ''}
              label="Importe a pagar"
              placeholder={'Añade importe a pagar'}
              disabled={loading || isSubmitting || !selectedCurrency}
              error={Boolean(errors.amount?.message)}
              labelProps={{
                className: 'text-sm font-bold text-blue-900 mb-1' // Estilo del label
              }}
            />
          )}
        />
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              className={styled}
              variant="outlined"
              label="Seleccionar moneda"
              labelProps={{
                className: 'text-sm font-bold text-blue-900 mb-1' // Estilo del label
              }}
              placeholder={currencies[0] ?? field.value}
              value={field.value}
              onChange={(e) => {
                setSelectedCurrency(currencies.find((c) => c.symbol === e));
                field.onChange(e);
              }}
              selected={(element) =>
                element &&
                React.cloneElement(element, {
                  disabled: true,
                  className: 'flex items-center opacity-100 px-0 gap-2 pointer-events-none'
                })
              }>
              {currencies.map(({ symbol, image, name }) => (
                <Option key={symbol} value={symbol} className="flex items-center p-2 gap-2">
                  <img src={image} alt={symbol} className="h-5 w-5 rounded-full object-cover" />
                  {name}
                </Option>
              ))}
            </Select>
          )}
        />
        <Controller
          name="concept"
          control={control}
          render={({ field }) => (
            <Input
              crossOrigin={undefined}
              {...field}
              id="concept"
              type="text"
              className={styled}
              onChange={(e) => {
                field.onChange(e);
              }}
              value={field.value ?? ''}
              disabled={loading || isSubmitting}
              placeholder="Añade descripcion del pago"
              label="Concepto"
              labelProps={{
                className: 'text-sm font-bold text-blue-900 mb-1' // Estilo del label
              }}
              error={Boolean(errors.concept?.message)}
            />
          )}
        />
        <Button
          type="submit"
          placeholder="Continuar"
          className="relative min-w-full flex justify-center items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-opacity-90 bg-blue-500 active:bg-blue-600 py-4 text-white">
          {isSubmitting ? (
            <Spinner></Spinner>
          ) : (
            <Typography placeholder={undefined}>Continuar</Typography>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default PaymentForm;
