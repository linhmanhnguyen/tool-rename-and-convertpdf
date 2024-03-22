'use strict';

const path = require('path');
const fs = require('fs').promises;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

async function convertToPDF(inputPath, outputPath) {
    const ext = '.pdf';
    try {
        const docxBuf = await fs.readFile(inputPath);
        const pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
        
        await fs.writeFile(outputPath, pdfBuf);
        console.log(`Chuyển đổi thành công: ${inputPath} -> ${outputPath}`);
    } catch (error) {
        console.error(`Lỗi khi chuyển đổi file ${inputPath}:`, error);
    }
}

async function walkDir(dir) {
    try {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
            const itemPath = path.join(dir, item.name);

            if (item.isDirectory()) {
                await walkDir(itemPath);
            } else {
                const ext = path.extname(item.name).toLowerCase();
                if (ext === '.doc' || ext === '.docx') {
                    const outputName = item.name.replace(/\.[^.]+$/, '.pdf');
                    const outputPath = path.join(dir, outputName);
                    await convertToPDF(itemPath, outputPath);
                }
            }
        }
    } catch (error) {
        console.error('Lỗi khi duyệt thư mục:', error);
    }
}

const directoryPath = '/Users/nguyenmanhlinh/Desktop/form2'; // Thay đổi đường dẫn đến thư mục của bạn
walkDir(directoryPath);
