'use client';
import { Typography, Button, Card } from '@material-tailwind/react';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Success = () => {
  const router = useRouter();

  const redirectToCreatePayment = () => {
    router.push('/payment-creation');
  };

  return (
    <Card
      className="w-full mt-2  p-8 gap-8 flex justify-center items-center bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm md:max-w-md lg:max-w-lg h-full"
      placeholder={undefined}>
      <div>
        <Image
          src="/tick-circle.svg"
          alt="Pago completado"
          width={80}
          height={80}
          className="mx-auto"
        />
        <Typography
          variant="h1"
          className="text-center text-extrabold text-xl mt-4"
          placeholder={undefined}>
          ¡Pago completado!
        </Typography>
      </div>
      <Typography variant="paragraph" className="text-center" placeholder={undefined}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa fuga sint fugit consectetur
        ipsa excepturi laboriosam rem porro odio et iure pariatur iste quia quam, amet nostrum optio
        non. Voluptates?
      </Typography>
      <Button
        type="submit"
        placeholder="Crear nuevo pago"
        onClick={redirectToCreatePayment}
        className="relative min-w-full flex justify-center items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-opacity-90 bg-blue-500 active:bg-blue-600 py-4 text-white">
        Crear nuevo pago
      </Button>
    </Card>
  );
};

export default Success;
