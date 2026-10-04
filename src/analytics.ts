/**
 * Analítica anônima (GoatCounter), sem cookies e sem dados pessoais.
 * Desligada por padrão: só envia se houver URL configurada no build, fora do modo de desenvolvimento
 * e sem "Do Not Track". Nenhuma falha aqui pode afetar o jogo.
 */
export interface AnalyticsEnv {
  url: string | undefined;
  dev: boolean;
  doNotTrack: boolean;
  send(src: string): void;
}

export interface Analytics {
  track(event: string): void;
}

export function createAnalytics(env: AnalyticsEnv): Analytics {
  const enabled = Boolean(env.url) && !env.dev && !env.doNotTrack;
  return {
    track(event) {
      if (!enabled) return;
      try {
        const url = new URL('/count', env.url);
        url.searchParams.set('p', event);
        url.searchParams.set('e', 'true');
        url.searchParams.set('rnd', Math.random().toString(36).slice(2));
        env.send(url.toString());
      } catch {
        // Analítica nunca derruba o jogo.
      }
    },
  };
}

export function browserAnalytics(): Analytics {
  return createAnalytics({
    url: import.meta.env.VITE_GOATCOUNTER_URL as string | undefined,
    dev: import.meta.env.DEV,
    doNotTrack: navigator.doNotTrack === '1',
    send: (src) => {
      const pixel = new Image();
      pixel.src = src;
    },
  });
}
