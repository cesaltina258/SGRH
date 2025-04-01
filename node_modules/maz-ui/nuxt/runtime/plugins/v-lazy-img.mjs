import { defineNuxtPlugin } from "#imports";
import { vLazyImgInstall } from "maz-ui";
export default defineNuxtPlugin(({ vueApp, $config }) => {
  const vLazyImgOptions = $config.public.mazUi?.installVLazyImg;
  const options = typeof vLazyImgOptions === "object" ? vLazyImgOptions : void 0;
  vueApp.use(vLazyImgInstall, options);
});
