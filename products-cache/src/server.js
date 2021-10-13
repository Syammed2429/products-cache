const connect = require('./config/db');
const {app,port} = require('./index');



app.listen(port, async () => {
    await connect()
    console.log(`Listening at ${port}`);
});