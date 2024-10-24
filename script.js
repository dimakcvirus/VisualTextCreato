const db = []; // массив с папками
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

let folderPath = "./TEst";

// Добавление названий папок в массив
async function addNameFolderMass() {
  try {
    const redsyncfs = await fs.readdir(folderPath);
    redsyncfs.forEach((folder) => db.push(folder));
    console.log("Папки добавлены в массив:", db);
  } catch (error) {
    console.error("Ошибка при чтении папок:", error.message);
  }
}

// Обработка папок
async function selectFolderArray() {
  while (db.length > 0) {
    const folder = db.shift();
    console.log("Обрабатываем папку:", folder);
    const folderPath1 = path.join(folderPath, folder);

    try {
      const countFilePapca = await fs.readdir(folderPath1);
      console.log("Количество файлов в папке:", countFilePapca.length);

      for (const file of countFilePapca) {
        const filePath = path.join(folderPath1, file);
        const nameFiles = path.basename(filePath, path.extname(filePath));
        console.log("Обрабатываем файл:", filePath);
        await checkingFileName(nameFiles, folderPath1, filePath);
      }
    } catch (error) {
      console.error("Ошибка при обработке файлов в папке:", error.message);
    }
  }
}

// Проверка имени файла и переименование
async function checkingFileName(nameFiles, folderPath1, filePath) {
  if (nameFiles[0] !== "*") {
    const newPath = path.join(
      folderPath1,
      `*${nameFiles}${path.extname(filePath)}`
    );
    await getImg(filePath, newPath, nameFiles); // Передаем имя файла в функцию для текста
    await deleteOriginalFile(filePath); // Удаляем исходный файл
  } else {
    console.log("Файлы не надо переименовывать");
  }
}

// Удаление исходного файла
async function deleteOriginalFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log("Исходный файл удален:", filePath);
  } catch (error) {
    console.error("Ошибка при удалении исходного файла:", error.message);
  }
}

// Добавление текста на изображение с использованием Sharp
async function getImg(imagePath, outputPath, originalName) {
  try {
    const { width, height } = await sharp(imagePath).metadata();
    console.log("Ширина:", width, "Высота:", height);

    await sharp(imagePath)
      .composite([
        {
          input: Buffer.from(
            `<svg width="${width}" height="${height}">
              <text x="50%" y="85%" font-size="36" fill="white" stroke="black" stroke-width="1" text-anchor="middle" alignment-baseline="middle">${originalName}</text>
            </svg>`
          ),
          gravity: "center",
        },
      ])
      .toFile(outputPath);

    console.log("Изображение успешно сохранено по пути:", outputPath);
  } catch (error) {
    console.error("Ошибка при обработке изображения:", error.message);
  }
}

addNameFolderMass().then(selectFolderArray);
