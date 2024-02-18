'use client';
import { Badge, Button, Card, Typography } from '@material-tailwind/react';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Divider from '../ui/Divider';
import LoadingData from '../ui/LoadingData';
import { getOrderInfo, getCurrencies } from '../lib/data';
import { ICurrency, OrderInfoResponse, Status } from '../lib/definitions';
import { useSearchParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { textColorIndigo } from '../lib/utils';

const PaymentSummary = () => {
  const router = useRouter();
  const params = useSearchParams();
  const identifier = params.get('identifier');
  const socketUrl = `wss://payments.pre-bnvo.com/ws/${identifier}`;
  const [isLoading, setIsLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<OrderInfoResponse>();
  const [isOnQr, setIsOnQr] = useState(false);
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [filteredCurrency, setFilteredCurrency] = useState<ICurrency>();
  const [timeRemaining, setTimeRemaining] = useState<number>(
    orderInfo && orderInfo?.expired_time
      ? Math.floor((new Date(orderInfo?.expired_time).getTime() - Date.now()) / 1000)
      : 0
  );
  const webSocketRef = useRef<WebSocket | null>(null);

  const fetchData = async () => {
    try {
      const response = await getOrderInfo(identifier as string);
      setOrderInfo(response);
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const fetchCurrencies = async () => {
    setIsLoading(true);
    const response = await getCurrencies();
    if (response) {
      setCurrencies(response);
      setIsLoading(false);
    } else {
      router.push(`/error`);
      return;
    }
  };

  useEffect(() => {
    fetchData();
    fetchCurrencies();
  }, []);

  useEffect(() => {
    currencies &&
      setFilteredCurrency(
        currencies.find((currency: ICurrency) => currency.symbol === orderInfo?.currency_id)
      );
  }, [currencies]);

  useEffect(() => {
    orderInfo?.expired_time &&
      setTimeRemaining(Math.floor(new Date(orderInfo?.expired_time).getTime() - Date.now()) / 1000);
  }, [orderInfo]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining((prevTime) => prevTime - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  if (isLoading) {
    return <LoadingData />;
  }

  const handlePaymentStatus = async (status: Status) => {
    switch (status) {
      case Status.CO:
      case Status.AC:
        await router.push(`/payment-summary/success`);
        break;
      case Status.EX:
      case Status.OC:
        await router.push(`/payment-summary/failure`);
        break;
      case Status.PE:
        console.log('Pago Pendiente');
        break;
      case Status.IA:
        console.log('Cantidad Insuficiente');
        break;
      case Status.RF:
        console.log('Pago reembolsado');
        break;
      case Status.FA:
        console.log('Pago Fallido');
        break;
      default:
        console.log(`Estado desconocido: ${status}`);
        break;
    }
  };

  const handleToggle = () => {
    setIsOnQr(!isOnQr);
  };

  return (
    <Card
      className="w-full h-full m-2  p-8 gap-8 flex justify-center flex-row items-center rounded-lg shadow-lg border border-gray-200 "
      placeholder={undefined}>
      <div className="w-2/4 flex justify-center flex-col">
        <div className="mt-2 mb-4 flex items-start">
          <Typography
            variant="h1"
            className={`${textColorIndigo} font-bold text-xl`}
            placeholder={undefined}>
            Resumen del pedido
          </Typography>
        </div>
        <Card
          className=" p-8 gap-8 rounded-sm bg-blue-100 mt-2  items-center"
          placeholder={undefined}>
          <div className="w-full flex flex-col space-y-4">
            <div className="flex justify-between w-full">
              <div>
                <Typography
                  variant="paragraph"
                  className={`${textColorIndigo} font-bold`}
                  placeholder={undefined}>
                  Importe:
                </Typography>
              </div>
              <div>
                <Typography
                  variant="paragraph"
                  className={`${textColorIndigo} font-bold`}
                  placeholder={undefined}>
                  {orderInfo ? `${String(orderInfo?.fiat_amount)} ${orderInfo?.fiat}` : '-'}
                </Typography>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between w-full">
              <div>
                <Typography
                  variant="paragraph"
                  className={`${textColorIndigo} font-bold`}
                  placeholder={undefined}>
                  Moneda <br></br>seleccionada:
                </Typography>
              </div>
              <div>
                <div className="flex items-center">
                  {filteredCurrency ? (
                    <>
                      <Image
                        src={filteredCurrency.image}
                        alt={filteredCurrency.symbol}
                        width={24}
                        height={24}
                        className="rounded-full object-cover mr-2"
                      />
                      <Typography
                        variant="paragraph"
                        className={`${textColorIndigo} font-bold`}
                        placeholder={undefined}>
                        {filteredCurrency.name}
                      </Typography>
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
            <Divider />

            <div className="flex flex-col space-y-4">
              <div className="flex justify-between w-full">
                <div>
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} font-bold`}
                    placeholder={undefined}>
                    Comercio:
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} font-semibold`}
                    placeholder={undefined}>
                    {orderInfo?.merchant_device ? orderInfo?.merchant_device : '-'}
                  </Typography>
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div>
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} font-bold`}
                    placeholder={undefined}>
                    Fecha:
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} font-semibold`}
                    placeholder={undefined}>
                    {orderInfo && orderInfo?.created_at
                      ? format(new Date(orderInfo?.created_at), 'dd/MM/yyyy HH:mm')
                      : '-'}
                  </Typography>
                </div>
              </div>

              <Divider />
              <div className="flex justify-between w-full">
                <div>
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} font-bold `}
                    placeholder={undefined}>
                    Concepto:
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} font-semibold`}
                    placeholder={undefined}>
                    {orderInfo?.notes ? orderInfo?.notes : '-'}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-2/4 h-full flex justify-center flex-col">
        <div className="mt-2 mb-4">
          <Typography
            variant="h1"
            className={`${textColorIndigo} font-bold text-xl`}
            placeholder={undefined}>
            Realiza el pago
          </Typography>
        </div>
        <Card
          className="mt-2 p-8 gap-8 items-center rounded-lg shadow-lg border border-gray-200"
          placeholder={undefined}>
          <div className="w-full flex flex-col space-y-4">
            <div className="w-full flex justify-center items-center gap-1 leading-4">
              <div>
                <Image src="/clock.svg" alt="Clock" width={24} height={24} />
              </div>
              <div>
                <Typography
                  variant="paragraph"
                  className={`${textColorIndigo} font-bold`}
                  placeholder={undefined}>
                  {timeRemaining ? format(new Date(timeRemaining), 'mm:ss') : 'Sin expiracion'}
                </Typography>
              </div>
            </div>
            <div className="flex justify-center items-center gap-1 w-full">
              <div className="flex gap-2">
                <Button
                  onClick={handleToggle}
                  className={`${isOnQr ? 'bg-indigo-600 text-white' : ' bg-gray-100 text-gray-700'}  px-4 py-2 rounded-full focus:outline-none}`}
                  placeholder={undefined}>
                  Smart QR
                </Button>
                <Button
                  onClick={handleToggle}
                  className={`${!isOnQr ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}  px-4 py-2 rounded-full  focus:outline-none}`}
                  placeholder={undefined}>
                  Web3
                </Button>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex justify-center ">
                <div className="h-max p-4 rounded-lg shadow-lg">
                  {isOnQr ? (
                    <QRCode
                      size={128}
                      value={orderInfo && orderInfo?.address ? orderInfo?.address : ''}
                      viewBox={`0 0 128 128`}
                    />
                  ) : (
                    <div className="h-max w-max">
                      <Image src="/metamask.svg" alt="Metamask" width={128} height={128} />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center flex-col w-full">
                <div className="flex justify-center">
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} font-bold mr-2`}
                    placeholder={undefined}>
                    Enviar
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} font-bold`}
                    placeholder={undefined}>
                    {orderInfo && filteredCurrency
                      ? `${String(orderInfo?.crypto_amount)} ${filteredCurrency.name}`
                      : '-'}
                  </Typography>
                </div>
                <div className="flex justify-center">
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} text-xs font-normal`}
                    placeholder={undefined}>
                    {orderInfo ? orderInfo?.address : '-'}
                  </Typography>
                </div>
              </div>
              <div className="flex justify-center w-full">
                <div>
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} text-xs font-bold mr-2`}
                    placeholder={undefined}>
                    Etiqueta de destino:
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="paragraph"
                    className={`${textColorIndigo} text-xs font-semibold`}
                    placeholder={undefined}>
                    {orderInfo ? orderInfo?.reference : '-'}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};
export default PaymentSummary;
