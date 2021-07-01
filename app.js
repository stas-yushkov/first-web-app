const express = require('express');
const exhbs = require('express-handlebars');
const products = require('./products.json');


const PORT = process.env.PORT || 4444;

const app = express();

const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./.private/organic-cursor-318504-6301b5623502.json'); 
const doc = new GoogleSpreadsheet('1FH1dotvaK2wp2yGlcICgmn7rclXpGziP0-7236sx5Uc');

const getProducts = async () => {
  await doc.useServiceAccountAuth(creds);
  await doc.useServiceAccountAuth(creds, 'test-406@organic-cursor-318504.iam.gserviceaccount.com');
  await doc.loadInfo();
  
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  
  const productsFromSheet = [];

  for (let i = 0; i < rows.length; i++) {
    const productFromSheet = {};

    sheet.headerValues.forEach((headerValue) => {
      productFromSheet[headerValue] = rows[i][headerValue];
    })

    productsFromSheet.push(productFromSheet)
  }
  
  // console.log('🚀 ~  productsFromSheet', productsFromSheet);
  // // JSON.parse(productsFromSheet)
  // console.log('🚀 ~ JSON.stringify(productsFromSheet)', JSON.stringify(productsFromSheet) );
  // // JSON.parse(JSON.stringify(productsFromSheet))
  // console.log('🚀 ~ JSON.parse(JSON.stringify(productsFromSheet))', JSON.parse(JSON.stringify(productsFromSheet)));

  return productsFromSheet;
};

getProducts().then(productsFromSheet => {
  productsFromSheet

  console.log('🚀 ~ productsFromSheet', productsFromSheet);
}
);


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



