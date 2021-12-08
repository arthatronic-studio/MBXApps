import validation from 'validate.js';

const constraints = {
  phoneNumber: {
    presence: { allowEmpty: false, message: '^Mohon isi nomor telepon Anda terlebih dulu' },
    length: { minimum: 9, message: '^Nomor telepon minimal 9 karakter' },
  },
  pulsa_nominal: {
    presence: { allowEmpty: false, message: '^Mohon pilih jumlah pulsa yang diinginkan' }
  },
  subscriberNumber: {
    presence: { allowEmpty: false, message: '^Mohon isi nomor telepon Anda terlebih dulu' },
    length: { minimum: 9, message: '^Nomor telepon minimal 9 karakter' },
  },
  selectedProvider: {
    presence: { allowEmpty: false, message: '^Mohon pilih provider terlebih dulu' }
  },
};

export default function validate(fieldName, value) {
  const formValues = { [fieldName]: value };
  const formFields = { [fieldName]: constraints[fieldName] };
  const errors = validation(formValues, formFields);

  if (errors) {
    return errors[fieldName][0];
  }

  return null;
}
