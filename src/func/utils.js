import RNSmtpMailer from "react-native-smtp-mailer";
export function checkEmail (email) {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(String(email).toLowerCase())
}

export async function initUser (token) {
  try {
  let response = await fetch('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + token)
      let json = await response.json();

      return {success:true,value:json}

  }
  catch (error) {
      console.error(error);
      return {success:false}
      }
}
export function FormatExpiry(expiry) {
  const removeNonNumber = (string = "") => string.replace(/[^\d]/g, "");
  const limitLength = (string = "", maxLength) => string.substr(0, maxLength);
  const sanitized = limitLength(removeNonNumber(expiry), 4);
  if (sanitized.match(/^[2-9]$/)) { return `0${sanitized}`; }
  if (sanitized.length > 2) { return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`; }
  return sanitized;
};
export function sendEmail(email,mailhost,port,categoryID,subCategoryID,mytext) {
  let body=`<h1>${mytext}</h1>`
  let subject='Opinia kategoria='+categoryID+' pytanie='+subCategoryID
  RNSmtpMailer.sendMail({
    mailhost: mailhost,
    port: port,
    ssl: false, //if ssl: false, TLS is enabled,**note:** in iOS TLS/SSL is determined automatically, so either true or false is the same
    username: "www@dztax.pl",
    password: "123qwe!@#QWE",
    from: "www@dztax.pl",
    recipients: email,
    subject: subject,
    htmlBody: body,
    attachmentPaths: [],
    attachmentNames: [],
    attachmentTypes: [] //needed
  })
    .then(success => console.log(success))
    .catch(err => console.log(err));
};
export function sendEmailContactUs(email,mailhost,port,mytext) {
  let body=`<h1>${mytext}</h1>`
  let subject='Wiadomość od użytkownika'
  RNSmtpMailer.sendMail({
    mailhost: mailhost,
    port: port,
    ssl: false, //if ssl: false, TLS is enabled,**note:** in iOS TLS/SSL is determined automatically, so either true or false is the same
    username: "www@dztax.pl",
    password: "123qwe!@#QWE",
    from: "www@dztax.pl",
    recipients: email,
    subject: subject,
    htmlBody: body,
    attachmentPaths: [],
    attachmentNames: [],
    attachmentTypes: [] //needed
  })
    .then(success => console.log(success))
    .catch(err => console.log(err));
};

export function romanize (num) {
  if (isNaN(num))
    return NaN;
  var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
        "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
        "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman = "",
      i = 3;
  while (i--)
    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
};








