import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { fileURLToPath as fu } from 'url';

const __filename = fu(import.meta.url);
const __dirname = dirname(__filename);

const test = resolve(__dirname, '../../cafe.db');
console.log('__dirname:', __dirname);
console.log('test path:', test);
console.log('exists:', existsSync(test));
console.log('exists cafe.db:', existsSync(resolve(__dirname, '../../cafe.db')));
console.log('exists cafe:', existsSync('D:/chuyende/billard-coffe/billard-coffe/cafe.db'));
