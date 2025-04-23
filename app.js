import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = express();

// Phục vụ các tệp tĩnh từ thư mục dist
app.use(express.static(join(__dirname, 'dist')));

// Xử lý mọi yêu cầu bằng cách trả về index.html
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'httpdocs', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
