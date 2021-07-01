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
  await doc.loadInfo(); // loads document properties and worksheets  
  // // console.log(doc.title);
  // console.log('🚀 ~ console.log(doc.title)', (doc.title));
    
  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  // console.log('🚀 ~ sheet', sheet);

  // // console.log(sheet.title);
  // console.log('🚀 ~ console.log(sheet.title)', (sheet.title));

  // // console.log(sheet.rowCount);
  // console.log('🚀 ~ console.log(sheet.rowCount)', (sheet.rowCount));

  // // read rows
  const rows = await sheet.getRows(); // can pass in { limit, offset }
  // console.log('🚀 ~ rows', rows);
  
  // // console.log(rows.length); // 2
  // console.log('🚀 ~ rows.length', rows.length);
  // // console.log(rows[0].name); // 'Larry Page'
  // // console.log(rows[0].email); // 'larry@google.com'


  // // read/write row values
  // // console.log(rows[0]); // 'Larry Page'
  // console.log('🚀 ~   console.log(rows[0])',   (rows[0]));
  // // console.log(rows[1]); // 'Larry Page'
  // console.log('🚀 ~ console.log(rows[1])', (rows[1]));
  // // console.log(rows[0].a1); // 'Larry Page'
  // console.log('🚀 ~ console.log(rows[0].name)', (rows[0].name));
  // console.log('🚀 ~ console.log(rows[0].email)', (rows[0].email));
  // console.log('🚀 ~ console.log(rows[1].name)', (rows[1].name));
  // // console.log(rows.headerValues); // 'Larry Page'
  // console.log('🚀 ~ console.log(rows.headerValues)', (rows.headerValues));
  // [...rows].forEach((row) => {
  //   console.log(row.name);
  //   console.log(row.email);
  // })


  // rows.headerValues
  // console.log('🚀 ~ rows.headerValues', rows.headerValues);
  // JSON.parse(rows)
  // console.log('🚀 ~ JSON.parse(rows)', JSON.parse(rows));
  // rows.json()
  // console.log('🚀 ~ rows.json()', rows.json());
  // sheet.headerValues


  // console.log('🚀 ~ sheet.headerValues', sheet.headerValues);
  // sheet.headerValues.forEach((headerValue) => {
  //   console.log(headerValue);

  //   [...rows].forEach((row) => {
  //   console.log(row[headerValue]);
  //   })
  // })

  // for (let i = 0; i < rows.length; i += 1) {
  //   row[i].map((rowContent) => {
  //     sheet.headerValues.forEach((headerValue) => {
  //       console.log(rowContent.headerValue);
  //     }
  //   }, )
  // }


  // for (let i = 0; i < rows.length; i++) {
  //   console.log('🚀 ~ i', i);
  //   console.log('🚀 ~   rows[i]',   rows[i]);
  //     sheet.headerValues.forEach((headerValue) => {
  //       console.log(headerValue);

  //       [...rows].forEach((row) => {
  //         console.log(row[headerValue]);
  //         //  rows[i].headerValue
  //         // console.log('🚀 ~ [...rows].forEach ~  rows[i].headerValue',  rows[i].headerValue);
  //         //  row._rawData
  //         console.log('🚀 ~ [...rows].forEach ~ row._rawData', row._rawData);
          

  //       })
  //     })
  // }
  // console.log();

  const productsFromSheet = [];
  for (let i = 0; i < rows.length; i++) {
    const productFromSheet = {};
    // console.log('🚀 ~ i', i);
    sheet.headerValues.forEach((headerValue) => {
      // console.log(headerValue);
      // console.log('🚀 ~ sheet.headerValues.forEach ~ rows[i][headerValue]', rows[i][headerValue]);
      productFromSheet[headerValue] = rows[i][headerValue];
    })
    productsFromSheet.push(productFromSheet)
  }
  console.log('🚀 ~  productsFromSheet', productsFromSheet);
  // JSON.parse(productsFromSheet)
  console.log('🚀 ~ JSON.stringify(productsFromSheet)', JSON.stringify(productsFromSheet) );
  // JSON.parse(JSON.stringify(productsFromSheet))
  console.log('🚀 ~ JSON.parse(JSON.stringify(productsFromSheet))', JSON.parse(JSON.stringify(productsFromSheet)));
  
}());

