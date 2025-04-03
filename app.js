const express = require('express');
const app = express();
const customersRouter = require('./routes/customers');

app.use(express.json());
app.use('/customers', customersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
