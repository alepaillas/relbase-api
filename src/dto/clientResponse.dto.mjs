export const clientResponseDto = (customerData) => {
  return {
    id: customerData.id,
    typeCustomer: customerData.type_customer,
    rut: customerData.rut,
    name: customerData.name,
    nameFantasy: customerData.name_fantasy,
    address: customerData.address,
    businessActivity: customerData.business_activity,
    cityId: customerData.city_id,
    communeId: customerData.commune_id,
    active: customerData.active,
    code: customerData.code,
    namePayment: customerData.name_payment,
    phonePayment: customerData.phone_payment,
    email: customerData.email, // assuming it's a single string or already an array of strings
    businessContact: customerData.business_contact,
    emailCommercial: customerData.email_commercial, // assuming it's already an array of strings
    phone: customerData.phone,
    mobile: customerData.mobile,
    reference: customerData.reference,
    discount: customerData.discount,
    credit: customerData.credit,
    typePaymentId: customerData.type_payment_id,
    creditAmount: customerData.credit_amount,
    isOverdueInvoice: customerData.is_overdue_invoice,
    daysOverdue: customerData.days_overdue,
    priceListId: customerData.price_list_id,
    priceListName: customerData.price_list_name,
    isPriceListDefault: customerData.is_price_list_default,
  };
};
