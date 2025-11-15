const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar los resolvers de Metro para manejar los aliases @/*
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Configurar un custom resolver para el alias @/
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@/')) {
    // Convertir @/ a la ruta absoluta desde la raíz del proyecto
    const resolvedPath = path.resolve(__dirname, moduleName.substring(2));
    
    // Intentar resolver con las extensiones por defecto
    return context.resolveRequest(
      context,
      resolvedPath,
      platform
    );
  }
  
  // Dejar que Metro maneje el resto normalmente
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
