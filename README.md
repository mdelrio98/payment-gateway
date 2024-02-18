# Pasarela de Pagos

## Descripción

Este proyecto tiene como objetivo la creación de una pasarela de pagos que permita transacciones con criptodivisas en un entorno de testnet. La documentación detallada de los endpoints y los contratos de las criptodivisas de testnet se encuentra disponible [aquí](enlace a la documentación).

### Requisitos

Para realizar peticiones a los endpoints, se debe incluir el Identificador (`X-Device-Id`) en el Header, proporcionado por email.

### Tecnologías Utilizadas

- React.js con hooks
- Next.js Pages Router
- TypeScript
- Tailwind CSS
- Material Tailwind
- Websockets
- HookForm

## Desarrollo

### 1. Crear Pago y Selección de Moneda

El Merchant puede crear un pago ingresando el importe, concepto y seleccionando la criptodivisa. Se utilizará el endpoint `POST orders` para crear el pago y el endpoint `GET currencies` para listar las criptodivisas disponibles. La pantalla debe seguir el diseño proporcionado en Figma. Es importante tener en cuenta el importe máximo y mínimo permitido para cada moneda.

### 2. Pasarela de Pago QR

Una vez creado el pago, se deben mostrar los detalles del resumen y la información necesaria para que el Cliente pueda realizar el pago. Estos datos se obtienen mediante el endpoint `GET orders/info`. La pasarela de pago debe actualizarse en tiempo real a través de un websocket. Se debe tener en cuenta el tiempo de expiración de los pagos y redirigir a una pantalla de error (KO) si caduca, y a una pantalla de éxito (OK) si el pago se realiza correctamente.

### Web3 (Opcional)

Se valorará positivamente la implementación de una opción para añadir una wallet mediante Web3, como METAMASK.

### Ejemplo de Websocket

`javascript`
const socket = new WebSocket('wss://payments.pre-bnvo.com/ws/<identifier>');

Simplemente habría que añadir en cada caso el identifier que devuelve el endpoint al crear
un pago.
Hay que tener en cuenta que los pagos tienen un tiempo de expiración y que debe llevarnos
a una pantalla KO si caduca (estado “EX” o “OC”). En cambio, si el pago se realiza
correctamente (estado “CO” o “AC”), nos llevará a una pantalla OK.

Opcional: Se valorará muy positivamente la opción de añadir mediante Web3 alguna wallet,
como puede ser METAMASK.
Para realizar pagos puede utilizar esta web de XRP o la aplicación de test de BTC.
Si lo ve conveniente puede utilizar el endpoint GET orders para comprobar los pagos que ha
creado.


### Cambios pendientes

- Se podria hacer un manejo de estados con redux para ser mas eficientes a la hora de pedir data al backend. 'CASO CURRENCIES'. Ya que la pido en dos pantallas distintas.
- Solucionar la comunicacion mediante websockets
- Cambios UI - Detalles.
- Opcional: agregar wallet de metamask.
- Hacer testing
