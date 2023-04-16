const nunjucks = require("nunjucks");
const fs = require("fs");
const path = require("path");

const data = JSON.parse(process.argv[2]);

// Set up Nunjucks environment
nunjucks.configure({ autoescape: true });

const reactTemplatePath = "react-starter-app";
const baseDirectoryPath = path.join(__dirname, "..", reactTemplatePath);
const outputDir = "output";
const outputPath = path.join(__dirname, "..", outputDir);

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

function traverse(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = path.join(directoryPath + "/" + file);
    const stats = fs.statSync(filePath);
    const baseEnd = filePath.replace(baseDirectoryPath, "");
    if (stats.isFile()) {
      const template = nunjucks.render(filePath, data);
      const outputPath = path.join(__dirname, "..", `${outputDir}/${baseEnd}`);
      const directorToMake = outputPath.split("/").slice(0, -1).join("/");
      if (!fs.existsSync(directorToMake)) {
        fs.mkdirSync(directorToMake, { recursive: true });
      }
      fs.writeFileSync(outputPath, template);
    } else if (stats.isDirectory()) {
      traverse(filePath);
    }
  });
}

traverse(baseDirectoryPath);