import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App/App';
import reportWebVitals from '../reportWebVitals';
// import { Counter } from './Counter';
import { Navbar, Product } from './components';
import { DataTable } from './components/demo/data-table';
import { columns } from './components/demo/columns';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     // ...
//   ]
// }

root.render(
  <React.StrictMode>
    {/* <Navbar/> */}
    <Product/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
