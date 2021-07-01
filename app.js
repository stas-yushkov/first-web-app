const express = require('express');
const exhbs = require('express-handlebars');
const products = require('./products.json');

const PORT = process.env.PORT || 4444;

const app = express();

const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./.private/organic-cursor-318504-6301b5623502.json'); 
const doc = new GoogleSpreadsheet('1FH1dotvaK2wp2yGlcICgmn7rclXpGziP0-7236sx5Uc');


app.use(express.static('public'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  exhbs({
    extname: 'hbs',
  }),
);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about', { cssFileName: 'about', pageTitle: 'О нас' });
});

app.get('/products', (req, res) => {
  res.render('products', {
    products,
    cssFileName: 'products',
    pageTitle: 'Наши продукты',
  });
});

app.get('/product/:productId', (req, res) => {
  console.log(req.params);

  const product = products.find(p => p.id === req.params.productId);

  res.render('product', { product });
});

app.listen(PORT, () => {
  console.log(`Application server is running on port ${PORT}`);
});

(async function() {
  await doc.useServiceAccountAuth(creds);
}());


// // or preferably, loading that info from env vars / config instead of the file
// (async function() {
// await doc.useServiceAccountAuth({
//   client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//   private_key: process.env.GOOGLE_PRIVATE_KEY,
// });

// }());

// example using impersonation - NOTE: your service account must have "domain-wide delegation" enabled
// see https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority
(async function() {
  await doc.useServiceAccountAuth(creds, 'test-406@organic-cursor-318504.iam.gserviceaccount.com');
}());

(async function() {
  await doc.loadInfo(); // loads document properties and worksheets  
  // console.log(doc.title);
  console.log('🚀 ~ console.log(doc.title)', (doc.title));

    
  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  // console.log(sheet.title);
  console.log('🚀 ~ console.log(sheet.title)', (sheet.title));
  // console.log(sheet.rowCount);
  console.log('🚀 ~ console.log(sheet.rowCount)', (sheet.rowCount));

  // read rows
  const rows = await sheet.getRows(); // can pass in { limit, offset }

  // read/write row values
  // console.log(rows[0]); // 'Larry Page'
  console.log('🚀 ~   console.log(rows[0])',   (rows[0]));
  // console.log(rows[1]); // 'Larry Page'
  console.log('🚀 ~ console.log(rows[1])', (rows[1]));
  // console.log(rows[0].a1); // 'Larry Page'
  console.log('🚀 ~ console.log(rows[0].a1)', (rows[0].a1));
  // console.log(rows.headerValues); // 'Larry Page'
  console.log('🚀 ~ console.log(rows.headerValues)', (rows.headerValues));
}());

