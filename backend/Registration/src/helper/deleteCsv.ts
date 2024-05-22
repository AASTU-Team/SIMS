import fs from 'fs';
import path from 'path'
const deleteCsvFile = async (filePath: string) => {
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  module.exports = deleteCsvFile

