const FormatMoney = {
  commafy(char) {
      const str = char.toString().split('.');
      if (str[0].length >= 4) {
          str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1.');
      }
      if (str[1] && str[1].length >= 4) {
          str[1] = str[1].replace(/(\d{3})/g, '$1 ');
      }
      return str.join('.');
  },
  getFormattedMoney: (value, currency) => `${typeof currency === 'string' ? currency : 'Rp'}${value ? FormatMoney.commafy(value) : '0'}`,
};

export default FormatMoney;
