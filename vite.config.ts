import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Mounts the real /api/contact handler (a Vercel-style Web handler) into the
 * Vite dev server, so the contact form actually sends email locally with
 * plain `npm run dev` — no `vercel dev` required. Production uses the same
 * file as a Vercel function.
 */
function contactApiDev(): Plugin {
  return {
    name: 'contact-api-dev',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/contact', (req: IncomingMessage, res: ServerResponse) => {
        void (async () => {
          try {
            const mod = (await server.ssrLoadModule('/api/contact.ts')) as {
              default: (r: Request) => Promise<Response>
            }
            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(chunk as Buffer)
            const headers = new Headers()
            for (const [key, value] of Object.entries(req.headers)) {
              if (typeof value === 'string') headers.set(key, value)
              else if (Array.isArray(value)) headers.set(key, value.join(', '))
            }
            const request = new Request(`http://localhost/api/contact`, {
              method: req.method ?? 'POST',
              headers,
              body: req.method === 'POST' && chunks.length ? Buffer.concat(chunks) : undefined,
            })
            const response = await mod.default(request)
            res.statusCode = response.status
            response.headers.forEach((v, k) => res.setHeader(k, v))
            res.end(Buffer.from(await response.arrayBuffer()))
          } catch (err) {
            console.error('[contact-api-dev]', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Dev API error — see terminal' }))
          }
        })()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Expose non-VITE_ vars (RESEND_API_KEY etc.) to the dev API handler
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value
  }

  return {
    plugins: [react(), tailwindcss(), contactApiDev()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 1400,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('three') || id.includes('@react-three')) return 'three'
            if (id.includes('framer-motion') || id.includes('gsap') || id.includes('motion')) return 'motion'
            if (id.includes('tsparticles')) return 'particles'
            return 'vendor'
          },
        },
      },
    },
  }
})
