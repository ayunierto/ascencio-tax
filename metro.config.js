const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar alias para resolver @/* paths
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
};

// Asegurar que Metro pueda encontrar los archivos usando los aliases
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;
