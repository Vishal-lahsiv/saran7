import React, { useState, useEffect } from 'react';
import { getInventoryData } from '../Json/Db';
import './Order.css';

const Order = () => {
  const [result, setResult] = useState("");
  const [products, setProducts] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    email: '',
    companyName: '',
    address: '',
    contact: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getInventoryData();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedOrderDetails = [...orderDetails];
    updatedOrderDetails[index] = {
      ...updatedOrderDetails[index],
      [field]: value,
    };
    setOrderDetails(updatedOrderDetails);
  };

  const handleAddProduct = () => {
    setOrderDetails([...orderDetails, { productName: '', quantity: '', brand: '', color: '' }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedOrderDetails = orderDetails.filter((_, i) => i !== index);
    setOrderDetails(updatedOrderDetails);
  };

  const handleSupplierChange = (field, value) => {
    setSupplierInfo({ ...supplierInfo, [field]: value });
  };

  const generateReceipt = () => {
    const { name, companyName, address, contact } = supplierInfo;
    let receipt = `Order Receipt\n\nSupplier Information:\nName: ${name}\nCompany Name: ${companyName}\nAddress: ${address}\nContact: ${contact}\n\nOrder Details:\n`;

    orderDetails.forEach((detail, index) => {
      receipt += `\nProduct ${index + 1}:\n`;
      receipt += `Product Name: ${detail.productName}\n`;
      receipt += `Quantity: ${detail.quantity}\n`;
      receipt += `Brand: ${detail.brand}\n`;
      receipt += `Color: ${detail.color}\n`;
    });

    return receipt;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "e9f64b0b-6f22-457c-852d-b35d0cfcfe6d");
    formData.append("message", generateReceipt());

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      setOrderDetails([]); // Reset order details
      setSupplierInfo({
        name: '',
        email: '',
        companyName: '',
        address: '',
        contact: '',
      });
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2>Supplier Information</h2>
        <div className='formGroup'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            name='name'
            value={supplierInfo.name}
            onChange={(e) => handleSupplierChange('name', e.target.value)}
            required
          />
        </div>
        <div className='formGroup'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            name='email'
            value={supplierInfo.email}
            onChange={(e) => handleSupplierChange('email', e.target.value)}
            required
          />
        </div>
        <div className='formGroup'>
          <label htmlFor='companyName'>Company Name</label>
          <input
            type='text'
            name='companyName'
            value={supplierInfo.companyName}
            onChange={(e) => handleSupplierChange('companyName', e.target.value)}
            required
          />
        </div>
        <div className='formGroup'>
          <label htmlFor='address'>Address</label>
          <input
            type='text'
            name='address'
            value={supplierInfo.address}
            onChange={(e) => handleSupplierChange('address', e.target.value)}
            required
          />
        </div>
        <div className='formGroup'>
          <label htmlFor='contact'>Contact</label>
          <input
            type='text'
            name='contact'
            value={supplierInfo.contact}
            onChange={(e) => handleSupplierChange('contact', e.target.value)}
            required
          />
        </div>

        <h2>Order Details</h2>
        {orderDetails.map((detail, index) => (
          <div key={index} className='orderDetail'>
            <div className='formGroup'>
              <label htmlFor={`productName-${index}`}>Product Name</label>
              <input
                type='text'
                value={detail.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                required
              />
             
            </div>
            <div className='formGroup'>
              <label htmlFor={`quantity-${index}`}>Quantity</label>
              <input
                type='number'
                name={`quantity-${index}`}
                value={detail.quantity}
                onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                required
                min='1'
              />
            </div>
            <div className='formGroup'>
              <label htmlFor={`brand-${index}`}>Brand</label>
              <input
                type='text'
                name={`brand-${index}`}
                value={detail.brand}
                onChange={(e) => handleInputChange(index, 'brand', e.target.value)}
                required
              />
            </div>
            
            <button type='button' onClick={() => handleRemoveProduct(index)}>
              Remove Product
            </button>
          </div>
        ))}
        <button type='button' onClick={handleAddProduct}>
          Add Product
        </button>
        <button type='submit'>Submit Form</button>
      </form>
      <span>{result}</span>
    </div>
  );
};

export default Order;
