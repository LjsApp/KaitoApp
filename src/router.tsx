import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Hanya retry 1x dengan delay 500ms — agar fallback cepat tampil
        // bila Supabase sedang pause/timeout (terutama akses pertama)
        retry: 1,
        retryDelay: 500,
        staleTime: 1000 * 60 * 5, // 5 menit
        gcTime: 1000 * 60 * 10,   // 10 menit
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
