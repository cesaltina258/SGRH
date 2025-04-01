import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";
import appConfigs from "@/app/appConfigurations";
import { fakeBackendService } from "@/app/http/httpServiceProvider";
import { useRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const title = "Sistema Integrado de Gestão de Recursos Humanos";

router.beforeEach((to, from, next) => {
  const auth = appConfigs.auth;
  const router = useRouter();

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title + " | " + title || title;
  }

  const isAuthRequired = to.meta.authRequired;

  if (!isAuthRequired) {
    return next();
  }
  if (auth === "fakebackend") {
    const user = fakeBackendService.getUser();
    const isUserLoggedIn = Object.keys(user).length > 0;

    if (isAuthRequired && isUserLoggedIn) {
      next();
    } else {
      router.push("/signin");
    }
  } else {
    next();
  }
});

export default router;
