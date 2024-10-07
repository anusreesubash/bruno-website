import { useFormik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Bruno from 'components/Bruno';
import Navbar from 'components/Navbar';
import GlobalStyle from '../globalStyles';
import { useState, useEffect } from 'react';
import { handleCheckout } from 'components/StripeCheckout';
import { IconInfoCircle } from '@tabler/icons-react';
import { Tooltip } from 'react-tooltip';

const products = [
  { name: 'Golden Edition', price: 49, productType: 'golden-edition-subscription' },
  { name: 'Ultimate Edition', price: 99, productType: 'ultimate-edition-subscription' }
];

const getProductPrice = (productType) => {
  const product = products.find(p => p.productType === productType);
  return product ? product.price : 0;
};

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'IN', name: 'India' },
  // add more countries ( should we use a library for this? )
];

export default function BuyEdition({ selectedProductType = 'golden-edition-subscription' }) {
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const formik = useFormik({
    initialValues: {
      billingEmail: '',
      adminEmail: '',
      noOfLicenses: 1,
      companyName: '',
      product: selectedProductType,
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
    },
    validationSchema: Yup.object({
      billingEmail: Yup.string().email('Invalid email address').required('Required'),
      adminEmail: Yup.string().email('Invalid email address').required('Required'),
      companyName: Yup.string().required('Required'),
      noOfLicenses: Yup.number().min(1, 'Must be at least 1').required('Required'),
      address: Yup.object({
        addressLine1: Yup.string().required('Required'),
        addressLine2: Yup.string(),
        city: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        country: Yup.string().required('Required'),
        postalCode: Yup.string().required('Required'),
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      console.log(values)
      handleCheckout({
        billingEmail: values.billingEmail,
        adminEmail: values.adminEmail || values.billingEmail,
        noOfLicenses: values.noOfLicenses,
        companyName: values.companyName,
        product: values.product,
        address: values.address,
      });
    },
  });

  const handleContinue = () => {
    formik.validateForm().then(() => {
      console.log(formik.errors);
      if (!Object.keys(formik.errors).length) {
        formik.handleSubmit();
      }
    });
  };

  const handleSameAsBilling = () => {
    setSameAsBilling(!sameAsBilling);
    if (!sameAsBilling) {
      formik.setFieldValue('adminEmail', formik.values.billingEmail);
    } else {
      formik.setFieldValue('adminEmail', '');
    }
  };

  useEffect(() => {
    if (sameAsBilling) {
      formik.setFieldValue('adminEmail', formik.values.billingEmail);
    }
  }, [formik.values.billingEmail, sameAsBilling]);

  const productPrice = getProductPrice(formik.values.product);
  const totalAmount = productPrice * formik.values.noOfLicenses;

  return (
    <div className="container flex flex-col root buy-golden-edition-page" style={{ fontFamily: 'Inter', maxWidth: '768px' }}>
      <Head>
        <title>Buy Bruno Edition</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyle />

      <main className="flex flex-grow flex-col px-4">
        <Navbar />
        <section className="bg-white shadow-md rounded-lg p-4 m-auto w-full">
          <div className="flex items-center mb-4">
            <Bruno width={70} />
            <h2 className="text-lg font-bold text-gray-900 ml-2">
              Bruno {products.find(p => p.productType === formik.values.product)?.name}
            </h2>
          </div>

          <div className="space-y-3">
            {/* Billing Email */}
            <div>
              <label htmlFor="billingEmail" className="block text-gray-700 flex items-center">
                Billing Email Address
                <IconInfoCircle
                  size={18}
                  className="ml-2 text-gray-500 hover:text-gray-900 cursor-pointer"
                  data-tooltip-id="billingEmailInfo"
                  data-tooltip-content="This email will be used for billing-related communications."
                />
              </label>
              <input
                type="email"
                id="billingEmail"
                name="billingEmail"
                className={`mt-1 w-full p-1 border rounded-md ${formik.errors.billingEmail ? 'border-red-600' : 'border-gray-300'}`}
                value={formik.values.billingEmail}
                onChange={formik.handleChange}
              />
              {formik.errors.billingEmail && <p className="text-red-600 text-sm mt-1">{formik.errors.billingEmail}</p>}
            </div>

            {/* Admin Email */}
            <div>
              <label htmlFor="adminEmail" className="block text-gray-700 flex items-center">
                License Admin Email
                <IconInfoCircle
                  size={18}
                  className="ml-2 text-gray-500 hover:text-gray-900 cursor-pointer"
                  data-tooltip-id="adminEmailInfo"
                  data-tooltip-content="This email will be used to manage your organization's licenses."
                />
              </label>
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-yellow-600"
                    checked={sameAsBilling}
                    onChange={handleSameAsBilling}
                    disabled={!formik.values.billingEmail}
                  />
                  <span className="ml-1">Same as billing email</span>
                </label>
              </div>
              <input
                type="email"
                id="adminEmail"
                name="adminEmail"
                className={`mt-1 w-full p-1 border rounded-md ${formik.errors.adminEmail ? 'border-red-600' : 'border-gray-300'}`}
                value={formik.values.adminEmail}
                onChange={formik.handleChange}
                disabled={sameAsBilling}
              />
              {formik.errors.adminEmail && <p className="text-red-600 text-sm mt-1">{formik.errors.adminEmail}</p>}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className={`mt-1 w-full p-1 border rounded-md ${formik.errors.companyName ? 'border-red-600' : 'border-gray-300'}`}
                value={formik.values.companyName}
                onChange={formik.handleChange}
              />
            </div>

            {/* Address Section */}
            <div>
              <label htmlFor="address.addressLine1" className="block text-gray-700">
                Address Line 1
              </label>
              <input
                type="text"
                id="address.addressLine1"
                name="address.addressLine1"
                className={`mt-1 w-full p-1 border rounded-md ${formik.errors.address?.addressLine1 ? 'border-red-600' : 'border-gray-300'}`}
                value={formik.values.address?.addressLine1 || ''}
                onChange={formik.handleChange}
              />
              {formik.errors.address?.addressLine1 && <p className="text-red-600 text-sm mt-1">{formik.errors.address?.addressLine1}</p>}
            </div>

            <div>
              <label htmlFor="address.addressLine2" className="block text-gray-700">
                Address Line 2
              </label>
              <input
                type="text"
                id="address.addressLine2"
                name="address.addressLine2"
                className={`mt-1 w-full p-1 border rounded-md ${formik.errors.address?.addressLine2 ? 'border-red-600' : 'border-gray-300'}`}
                value={formik.values.address?.addressLine2 || ''}
                onChange={formik.handleChange}
              />
              {formik.errors.address?.addressLine2 && <p className="text-red-600 text-sm mt-1">{formik.errors.address?.addressLine2}</p>}
            </div>

            {/* City and State */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <label htmlFor="address.city" className="block text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  className={`mt-1 w-full p-1 border rounded-md ${formik.errors.address?.city ? 'border-red-600' : 'border-gray-300'}`}
                  value={formik.values.address?.city || ''}
                  onChange={formik.handleChange}
                />
                {formik.errors.address?.city && <p className="text-red-600 text-sm mt-1">{formik.errors.address?.city}</p>}
              </div>

              <div className="flex-1">
                <label htmlFor="address.state" className="block text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  className={`mt-1 w-full p-1 border rounded-md ${formik.errors.address?.state ? 'border-red-600' : 'border-gray-300'}`}
                  value={formik.values.address?.state || ''}
                  onChange={formik.handleChange}
                />
                {formik.errors.address?.state && <p className="text-red-600 text-sm mt-1">{formik.errors.address?.state}</p>}
              </div>
            </div>

            {/* Country and Postal Code */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <label htmlFor="address.country" className="block text-gray-700">
                  Country
                </label>
                <select
                  id="address.country"
                  name="address.country"
                  className={`mt-1 w-full p-1 border rounded-md ${formik.errors.address?.country ? 'border-red-600' : 'border-gray-300'}`}
                  value={formik.values.address?.country || ''}
                  onChange={formik.handleChange}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {formik.errors.address?.country && <p className="text-red-600 text-sm mt-1">{formik.errors.address?.country}</p>}
              </div>

              <div className="flex-1">
                <label htmlFor="address.postalCode" className="block text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="address.postalCode"
                  name="address.postalCode"
                  className={`mt-1 w-full p-1 border rounded-md ${formik.errors.address?.postalCode ? 'border-red-600' : 'border-gray-300'}`}
                  value={formik.values.address?.postalCode || ''}
                  onChange={formik.handleChange}
                />
                {formik.errors.address?.postalCode && <p className="text-red-600 text-sm mt-1">{formik.errors.address?.postalCode}</p>}
              </div>
            </div>

            {/* Number of Licenses */}
            <div>
              <label htmlFor="noOfLicenses" className="block text-gray-700">
                Number of Licenses
              </label>
              <input
                type="number"
                id="noOfLicenses"
                name="noOfLicenses"
                min={1}
                className={`mt-1 p-1 border rounded-md ${formik.errors.noOfLicenses ? 'border-red-600' : 'border-gray-300'}`}
                value={formik.values.noOfLicenses}
                style={{ width: '70px' }}
                onChange={formik.handleChange}
              />
              {formik.errors.noOfLicenses && <p className="text-red-600 text-sm mt-1">{formik.errors.noOfLicenses}</p>}
            </div>


            {/* Total Amount */}
            <div className="mt-4 border-t border-gray-200 pt-2 text-right">
              <h4 className="text-gray-700 font-bold">
                Total: ${totalAmount} USD
              </h4>
            </div>

            {/* Continue Button */}
            <div className="mt-4">
              <button
                type="button"
                className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700"
                onClick={handleContinue}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </section>
      </main>

      <Tooltip id="billingEmailInfo" className="tooltip" />
      <Tooltip id="adminEmailInfo" className="tooltip" />
    </div>
  );
}
