// @ts-expect-error
import { startServer } from "../legacy/index.mjs";


try {
    startServer();
} catch (error) {
    console.log(`Error occurred while starting http server `, error);
}


