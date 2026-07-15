import { env } from './env';

const PROVIDERS = {
  crafatar: {
    base: 'https://crafatar.com',
    avatar: (uuid: string, size = 256) => `https://crafatar.com/avatars/${uuid}?size=${size}&overlay`,
    head: (uuid: string, size = 256) => `https://crafatar.com/renders/head/${uuid}?scale=10&overlay`,
    body: (uuid: string, scale = 6) => `https://crafatar.com/renders/body/${uuid}?scale=${scale}&overlay`,
    uuid: (nick: string) => `https://api.crafatar.com/users/profiles/minecraft/${nick}`,
  },
  mineatar: {
    base: 'https://mineatar.io',
    avatar: (uuid: string, size = 256) => `https://mineatar.io/armor/body/${uuid}/${size}`,
    head: (uuid: string, size = 256) => `https://mineatar.io/armor/head/${uuid}/${size}`,
    body: (uuid: string, scale = 6) => `https://mineatar.io/armor/body/${uuid}`,
    uuid: (nick: string) => `https://api.mojang.com/users/profiles/minecraft/${nick}`,
  },
  'mc-heads': {
    base: 'https://mc-heads.net',
    avatar: (uuid: string, size = 256) => `https://mc-heads.net/avatar/${uuid}/${size}`,
    head: (uuid: string, size = 256) => `https://mc-heads.net/head/${uuid}/${size}`,
    body: (uuid: string, scale = 6) => `https://mc-heads.net/body/${uuid}`,
    uuid: (nick: string) => `https://api.mojang.com/users/profiles/minecraft/${nick}`,
  },
  minotar: {
    base: 'https://minotar.net',
    avatar: (uuid: string, size = 256) => `https://minotar.net/helm/${uuid}/${size}.png`,
    head: (uuid: string, size = 256) => `https://minotar.net/armor/head/${uuid}/${size}.png`,
    body: (uuid: string, scale = 6) => `https://minotar.net/armor/body/${uuid}/${scale * 100}.png`,
    uuid: (nick: string) => `https://api.mojang.com/users/profiles/minecraft/${nick}`,
  },
} as const;

const provider = PROVIDERS[env.skinApi.provider];

// Cache de UUID em memória (evita rate limit do Mojang)
const uuidCache = new Map<string, { uuid: string; expires: number }>();
const UUID_TTL = 1000 * 60 * 60; // 1h

export async function getUuidByNick(nick: string): Promise<string | null> {
  const cached = uuidCache.get(nick.toLowerCase());
  if (cached && cached.expires > Date.now()) return cached.uuid;

  try {
    // Tenta Mojang primeiro
    let uuid: string | null = null;
    try {
      const res = await fetch(provider.uuid(nick));
      if (res.ok) {
        const data: any = await res.json();
        uuid = data.id || null;
      }
    } catch {
      // fallback
    }

    // Fallback para crafatar (que aceita nick direto)
    if (!uuid) {
      const res = await fetch(`https://api.crafatar.com/users/profiles/minecraft/${nick}`);
      if (res.ok) {
        const data: any = await res.json();
        uuid = data.id || null;
      }
    }

    if (uuid) {
      uuidCache.set(nick.toLowerCase(), { uuid, expires: Date.now() + UUID_TTL });
    }
    return uuid;
  } catch (e) {
    console.error('Erro ao buscar UUID:', e);
    return null;
  }
}

export function getSkinUrls(nick: string, avatarSize = 256) {
  // Para mc-heads e minotar, podemos usar o nick diretamente
  if (env.skinApi.provider === 'mc-heads' || env.skinApi.provider === 'minotar') {
    return {
      avatar: provider.avatar(nick, avatarSize),
      head: provider.head(nick, avatarSize),
      body: provider.body(nick),
    };
  }
  return {
    avatar: provider.avatar(nick, avatarSize),
    head: provider.head(nick, avatarSize),
    body: provider.body(nick),
  };
}

export async function getSkinData(nick: string) {
  const uuid = await getUuidByNick(nick);
  return {
    uuid,
    nick,
    ...getSkinUrls(uuid || nick),
  };
}
