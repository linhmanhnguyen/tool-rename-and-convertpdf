const fs = require('fs').promises;
const path = require('path');

const folderPath = '/Users/nguyenmanhlinh/Desktop/form2'; 

async function renameFilesInDirectory(directory, parentFolderName = '') {
  try {
    const items = await fs.readdir(directory, { withFileTypes: true });

    let fileIndex = 1; 

    for (let item of items) {
      const originalPath = path.join(directory, item.name);

      if (item.isDirectory()) {
        await renameFilesInDirectory(originalPath, item.name);
      } else {
        const newName = item.name
          .replace(/Mau so (\d+)/, 'Mauso$1')
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D")
          .replace(/\s+/g, '')
          .replace(/[^\w.]/gi, '') 
          .toLowerCase();

        const formattedName = `${parentFolderName ? parentFolderName + '-' : ''}mauso${fileIndex}-${newName}`;
        const newPath = path.join(directory, formattedName);

        await fs.rename(originalPath, newPath);
        console.log(`Renamed: ${originalPath} -> ${newPath}`);

        fileIndex++;
      }
    }
  } catch (error) {
    console.error('Error renaming files:', error);
  }
}

renameFilesInDirectory(folderPath);

