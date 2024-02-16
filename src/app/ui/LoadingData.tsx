'use client';
import { Typography, Spinner, Card, Button } from '@material-tailwind/react';

const LoadingData = () => {
  return (
    <Card
      className="gap-4 w-full mt-2 p-8 flex flex-col justify-center items-center bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm md:max-w-md lg:max-w-lg"
      placeholder={undefined}>
      <Typography variant="h1" color="blue" placeholder={undefined}>
        Loading data
      </Typography>
      <Spinner color="blue" className="h-16 w-16"></Spinner>
    </Card>
  );
};

export default LoadingData;
