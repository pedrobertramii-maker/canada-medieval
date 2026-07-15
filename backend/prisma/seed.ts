import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🏰 Seeding Canada Medieval database...\n');

  // ============= ADMIN MASTER =============
  const username = process.env.MASTER_ADMIN_USERNAME || 'admin';
  const email = process.env.MASTER_ADMIN_EMAIL || 'admin@canadamedieval.com';
  const password = process.env.MASTER_ADMIN_PASSWORD || 'CanadaMedieval2026!';
  const name = process.env.MASTER_ADMIN_NAME || 'Administrador';

  const existingAdmin = await prisma.admin.findUnique({ where: { username } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: {
        username,
        email,
        passwordHash,
        name,
        role: AdminRole.OWNER,
      },
    });
    console.log(`✅ Master admin criado: ${username} / ${password}`);
  } else {
    console.log(`ℹ️  Admin "${username}" já existe.`);
  }

  // ============= DONOS DA LOJA =============
  const owners = [
    {
      name: 'Ketelez',
      minecraftNick: 'Ketelez',
      role: 'Fundador & Rei',
      description:
        'Fundador do reino Canadá, visionário por trás de cada construção medieval. Responsável pela arquitetura, estratégia e expansão da loja. Mestre ferreiro e arquiteto de plantão.',
      order: 1,
    },
    {
      name: 'Gord1n',
      minecraftNick: 'Gord1n',
      role: 'Co-Fundador & Almirante',
      description:
        'Co-fundador do império medieval canadense. Especialista em comércio, recursos raros e diplomacia entre reinos. Guardião dos tesouros e mentor da nova geração.',
      order: 2,
    },
  ];

  for (const owner of owners) {
    const exists = await prisma.owner.findUnique({
      where: { minecraftNick: owner.minecraftNick },
    });
    if (!exists) {
      await prisma.owner.create({ data: owner });
      console.log(`👑 Dono criado: ${owner.name} (${owner.role})`);
    }
  }

  // ============= CATEGORIAS =============
  const categories = [
    { name: 'Blocos', slug: 'blocos', icon: 'Boxes', color: '#8B6F47', order: 1, description: 'Pedra, madeira, tijolos e blocos raros.' },
    { name: 'Ferramentas', slug: 'ferramentas', icon: 'Pickaxe', color: '#A8A29E', order: 2, description: 'Picaretas, machados, pás e enxadas lendárias.' },
    { name: 'Armaduras', slug: 'armaduras', icon: 'Shield', color: '#3B82F6', order: 3, description: 'Armaduras de ferro, diamante e netherite.' },
    { name: 'Comida', slug: 'comida', icon: 'Apple', color: '#EF4444', order: 4, description: 'Alimentos e poções do reino.' },
    { name: 'Decoração', slug: 'decoracao', icon: 'Sparkles', color: '#F59E0B', order: 5, description: 'Itens decorativos medievais.' },
    { name: 'Encantamentos', slug: 'encantamentos', icon: 'BookOpen', color: '#A855F7', order: 6, description: 'Livros encantados e grimórios.' },
    { name: 'Especiais', slug: 'especiais', icon: 'Crown', color: '#EAB308', order: 7, description: 'Itens lendários e exclusivos do reino.' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`📦 ${categories.length} categorias criadas.\n`);

  // ============= PRODUTOS EXEMPLO =============
  const blocksCat = await prisma.category.findUnique({ where: { slug: 'blocos' } });
  const toolsCat = await prisma.category.findUnique({ where: { slug: 'ferramentas' } });
  const specialCat = await prisma.category.findUnique({ where: { slug: 'especiais' } });

  if (blocksCat && toolsCat && specialCat) {
    const products = [
      {
        name: 'Pacote de Pedra Medieval',
        slug: 'pacote-pedra-medieval',
        description: '64 blocos de pedra polida para construção de castelos e muralhas.',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
        categoryId: blocksCat.id,
        stock: 100,
        featured: true,
      },
      {
        name: 'Troncos de Carvalho Escuro',
        slug: 'troncos-carvalho-escuro',
        description: 'Madeira de carvalho reflorestada, ideal para construções nobres.',
        price: 18.5,
        imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800',
        categoryId: blocksCat.id,
        stock: 80,
        featured: true,
      },
      {
        name: 'Picareta de Ferro Real',
        slug: 'picareta-ferro-real',
        description: 'Picareta de ferro forjada na bigorna do reino. Eficiência III inclusa.',
        price: 89.9,
        oldPrice: 119.9,
        imageUrl: 'https://images.unsplash.com/photo-1583429088551-4b3f15c1d3a4?w=800',
        categoryId: toolsCat.id,
        stock: 25,
        featured: true,
      },
      {
        name: 'Espada de Diamante Lendária',
        slug: 'espada-diamante-lendaria',
        description: 'Espada forjada pelos mestres ferreiros. Afiada, rápida, mortal.',
        price: 249.0,
        imageUrl: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=800',
        categoryId: specialCat.id,
        stock: 5,
        featured: true,
      },
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: p,
        create: p,
      });
    }
    console.log(`🛒 ${products.length} produtos de exemplo criados.\n`);
  }

  // ============= ATUALIZAÇÃO INICIAL =============
  const admin = await prisma.admin.findFirst();
  if (admin) {
    const updateExists = await prisma.update.findUnique({ where: { slug: 'bem-vindo-ao-reino-canada' } });
    if (!updateExists) {
      await prisma.update.create({
        data: {
          title: 'Bem-vindo ao Reino do Canadá',
          slug: 'bem-vindo-ao-reino-canada',
          excerpt: 'A loja medieval mais elegante do servidor foi inaugurada.',
          content:
            'Salve, nobre viajante! O Reino do Canadá abre suas portas para todos os aventureiros. Nossa loja traz os melhores blocos, ferramentas, armaduras e itens lendários do servidor. Construa seu castelo, forje sua espada e escreva sua história. Que a fortuna esteja ao seu lado!',
          imageUrl: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=1600',
          authorId: admin.id,
          pinned: true,
        },
      });
      console.log('📜 Atualização inicial criada.\n');
    }
  }

  // ============= CONFIGURAÇÕES =============
  const settings = [
    { key: 'site_name', value: 'Canadá', type: 'string', group: 'general' },
    { key: 'site_tagline', value: 'Loja Medieval do Reino', type: 'string', group: 'general' },
    { key: 'site_description', value: 'Loja medieval oficial do reino do Canadá no servidor de Minecraft.', type: 'string', group: 'general' },
    { key: 'discord_url', value: 'https://discord.gg/canadamedieval', type: 'string', group: 'social' },
    { key: 'contact_email', value: 'contato@canadamedieval.com', type: 'string', group: 'general' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: s, create: s });
  }

  console.log('✨ Seed concluído com sucesso!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`👑 Admin Master: ${username}`);
  console.log(`🔑 Senha: ${password}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
