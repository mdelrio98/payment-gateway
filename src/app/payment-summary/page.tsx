'use client';
import { Badge, Button, Card, Typography } from '@material-tailwind/react';
import React, { Suspense, useEffect, useState } from 'react';
import Divider from '../ui/Divider';
import LoadingData from '../ui/LoadingData';
import { getOrderInfo, getCurrencies } from '../lib/data';
import { ICurrency, OrderInfoResponse, Status } from '../lib/definitions';
import { useSearchParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const PaymentSummary = () => {
  const router = useRouter();
  const params = useSearchParams();
  const identifier = params.get('identifier');
  const socketUrl = `wss://payments.pre-bnvo.com/ws/${identifier}`;
  const [isLoading, setIsLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<OrderInfoResponse>();
  const [isOn, setIsOn] = useState(false);
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [filteredCurrency, setFilteredCurrency] = useState<ICurrency>();
  const [timeRemaining, setTimeRemaining] = useState<number>(
    orderInfo && orderInfo?.expired_time
      ? Math.floor((new Date(orderInfo?.expired_time).getTime() - Date.now()) / 1000)
      : 0
  );
  let socket = new WebSocket(socketUrl || '');

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
    orderInfo?.expired_time &&
      setTimeRemaining(Math.floor(new Date(orderInfo?.expired_time).getTime() - Date.now()) / 1000);
  }, [orderInfo]);

  useEffect(() => {
    currencies &&
      setFilteredCurrency(
        currencies.find((currency: ICurrency) => currency.symbol === orderInfo?.currency_id)
      );
  }, [currencies]);

  useEffect(() => {
    socket.onopen = (event) => {
      fetchData();
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === Status.AC || data.status === Status.CO) {
          router.push('/success');
        } else if (data.status === Status.PE || data.status === Status.NR) {
          fetchData();
        } else if (
          data.status === Status.EX ||
          data.status === Status.OC ||
          data.status === Status.FA
        ) {
          router.push('/failed');
        }
      };
    };

    return () => {
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, [socket]);

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

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <Card
      className="w-full h-full m-2  p-8 gap-8 flex justify-center flex-row items-center rounded-lg shadow-lg border border-gray-200 "
      placeholder={undefined}>
      <Card placeholder={undefined} className="w-2/4 flex justify-center flex-col">
        <div className="mt-2 mb-4 flex items-start">
          <Typography variant="h1" className="font-bold text-xl" placeholder={undefined}>
            Resumen del pedido
          </Typography>
        </div>
        <Card
          className="min-w-[500px] p-8 gap-8 rounded-sm bg-blue-100 mt-2  items-center"
          placeholder={undefined}>
          <div className="w-full flex flex-col space-y-4">
            <div className="flex justify-between w-full">
              <div>
                <Typography variant="paragraph" className="text-gray-700" placeholder={undefined}>
                  Importe:
                </Typography>
              </div>
              <div>
                <Typography variant="h2" className="font-bold" placeholder={undefined}>
                  {orderInfo ? `${String(orderInfo?.fiat_amount)} ${orderInfo?.fiat}` : '-'}
                </Typography>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between w-full">
              <div>
                <Typography variant="paragraph" className="text-gray-700" placeholder={undefined}>
                  Moneda <br></br>seleccionada:
                </Typography>
              </div>
              <div>
                <div className="flex items-center">
                  {filteredCurrency ? (
                    <>
                      <img
                        src={filteredCurrency.image}
                        alt={filteredCurrency.symbol}
                        className="h-5 w-5 rounded-full object-cover mr-2"
                      />
                      <Typography variant="h2" className="font-bold" placeholder={undefined}>
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
                  <Typography variant="paragraph" className="text-gray-700" placeholder={undefined}>
                    Comercio:
                  </Typography>
                </div>
                <div>
                  <Typography variant="h2" className="font-semibold" placeholder={undefined}>
                    {orderInfo?.merchant_device ? orderInfo?.merchant_device : '-'}
                  </Typography>
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div>
                  <Typography variant="paragraph" className="text-gray-700" placeholder={undefined}>
                    Fecha:
                  </Typography>
                </div>
                <div>
                  <Typography variant="h2" className="font-semibold" placeholder={undefined}>
                    {orderInfo && orderInfo?.created_at
                      ? format(new Date(orderInfo?.created_at), 'dd/MM/yyyy HH:mm')
                      : '-'}
                  </Typography>
                </div>
              </div>

              <Divider />
              <div className="flex justify-between w-full">
                <div>
                  <Typography variant="paragraph" className="text-gray-700" placeholder={undefined}>
                    Concepto:
                  </Typography>
                </div>
                <div>
                  <Typography variant="h2" className="font-semibold" placeholder={undefined}>
                    {orderInfo?.notes ? orderInfo?.notes : '-'}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Card>

      <Card
        placeholder={undefined}
        className="min-w-[500px] w-2/4 h-full flex justify-center flex-col">
        <div className="mt-2 mb-4">
          <Typography variant="h1" className="font-bold text-xl" placeholder={undefined}>
            Realiza el pago
          </Typography>
        </div>
        <Card
          className="mt-2 p-8 gap-8 items-center rounded-lg shadow-lg border border-gray-200"
          placeholder={undefined}>
          <div className="w-full flex flex-col space-y-4">
            <div className="w-full flex justify-center items-center gap-1 leading-4">
              <div>
                <img src="/clock.svg" alt="Clock" className="h-5 w-5"></img>
              </div>
              <div>
                <Typography variant="h2" className="font-bold" placeholder={undefined}>
                  {timeRemaining ? format(new Date(timeRemaining), 'mm:ss') : 'Sin expiracion'}
                </Typography>
              </div>
            </div>
            <div className="flex justify-center items-center gap-1 w-full">
              <div className="flex gap-2">
                <Button
                  onClick={handleToggle}
                  className={`${isOn ? 'bg-indigo-600 text-white' : ' bg-gray-100 text-gray-700'}  px-4 py-2 rounded-full focus:outline-none}`}
                  placeholder={undefined}>
                  Smart QR
                </Button>
                <Button
                  onClick={handleToggle}
                  className={`${!isOn ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}  px-4 py-2 rounded-full  focus:outline-none}`}
                  placeholder={undefined}>
                  Web3
                </Button>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex justify-center ">
                <div className="h-max p-4 rounded-lg shadow-lg">
                  <QRCode size={128} value={'asd'} viewBox={`0 0 128 128`} />
                </div>
              </div>
              <div className="flex justify-center flex-col w-full">
                <div className="flex justify-center">
                  <Typography
                    variant="paragraph"
                    className="text-gray-700 mr-2"
                    placeholder={undefined}>
                    Enviar
                  </Typography>
                  <Typography variant="h2" className="font-bold" placeholder={undefined}>
                    {orderInfo && filteredCurrency
                      ? `${String(orderInfo?.crypto_amount)} ${filteredCurrency.name}`
                      : '-'}
                  </Typography>
                </div>
                <div className="flex justify-center">
                  <Typography
                    variant="h1"
                    className="text-xs font-semibold"
                    placeholder={undefined}>
                    {orderInfo ? orderInfo?.address : '-'}
                  </Typography>
                </div>
              </div>
              <div className="flex justify-center w-full">
                <div>
                  <Typography
                    variant="paragraph"
                    className="text-xs text-gray-700 mr-2"
                    placeholder={undefined}>
                    Etiqueta de destino:
                  </Typography>
                </div>
                <div>
                  <Typography variant="h2" className="text-xs font-bold" placeholder={undefined}>
                    {orderInfo ? orderInfo?.reference : '-'}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </Card>
  );
};
export default PaymentSummary;
