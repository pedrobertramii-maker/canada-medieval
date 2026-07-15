import { createApp } from './app';
import { env } from './lib/env';
import { prisma } from './lib/prisma';

async function bootstrap() {
  const app = createApp();

  // Testa conexão com banco
  try {
    await prisma.$connect();
    console.log('✅ Banco de dados conectado');
  } catch (e) {
    console.error('❌ Erro ao conectar no banco:', e);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🏰 Canada Medieval API`);
    console.log(`🌍 Ambiente: ${env.nodeEnv}`);
    console.log(`🚀 Servidor: http://localhost:${env.port}`);
    console.log(`📚 Storage: ${env.storage.provider}`);
    console.log(`🎮 Skin API: ${env.skinApi.provider}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
  });
}

bootstrap().catch((e) => {
  console.error('Falha ao iniciar:', e);
  process.exit(1);
});
