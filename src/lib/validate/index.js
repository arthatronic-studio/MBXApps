import validation from 'validate.js';

const constraints = {
  email: {
    presence: { allowEmpty: false, message: '^Mohon isi email Anda' },
    format: { pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/, message: '^Mohon isi email Anda dengan benar', },
    email: true,
  },
  username: {
    presence: { allowEmpty: false, message: '^Mohon isi username Anda' },
  },
  idNumber: {
    presence: { allowEmpty: false, message: '^Mohon isi NIK dengan benar' },
  },
  password0: {
    presence: { allowEmpty: false, message: '^Mohon isi kata sandi lama Anda' },
    length: { minimum: 6, message: '^Kata sandi minimal 6 karakter' },
  },
  password: {
    presence: { allowEmpty: false, message: '^Mohon isi kata sandi Anda' },
    length: { minimum: 6, message: '^Kata sandi minimal 6 karakter' },
  },
  password2: {
    presence: { allowEmpty: false, message: '^Mohon isi kata sandi konfirmasi' },
    length: { minimum: 6, message: '^Kata sandi minimal 6 karakter' },
  },
  phoneNumber: {
    presence: { allowEmpty: false, message: '^Mohon isi nomor telepon dengan benar' },
    length: { minimum: 11, message: '^No telpon minimal 11 karakter' },
  },
  fullName: {
    presence: { allowEmpty: false, message: '^Mohon isi nama lengkap Anda' },
  },
  firstName: {
    presence: { allowEmpty: false, message: '^Mohon isi data Anda dengan benar' },
  },
  lastName: {
    presence: { allowEmpty: false, message: '^Mohon isi data Anda dengan benar' },
  },
  alamat: {
    presence: { allowEmpty: false, message: '^Mohon isi data Anda dengan benar' },
  },
  postalCode: {
    presence: { allowEmpty: false, message: '^Mohon isi data Anda dengan benar' },
  },
  city: {
    presence: { allowEmpty: false, message: '^Mohon isi data Anda dengan benar' },
  },
  country: {
    presence: { allowEmpty: false, message: '^Mohon isi data Anda dengan benar' },
  },
  dateOfBirth: {
    presence: { allowEmpty: false, message: '^Mohon isi data Anda dengan benar' },
  },
};

export default function validate(fieldName, value) {
    const formValues = { [fieldName]: value };
    const formFields = { [fieldName]: constraints[fieldName] };
    const errors = validation(formValues, formFields);

    if (errors) return errors[fieldName][0];
    return null;
};