
/**
 * キャッシュコントロール
 * CACHE_STORAGE_NAME: キャッシュ名
 *     バージョンアップごとにカウントアップ（再キャッシュ用）
 * files_to_cache: 対象ファイルリスト
 *     ここにないとキャッシュされない
 *     パス「../enchant_moriy」にて
 *     以下のコマンドを実行する
 *     $ find . -type f | grep "enchant_moriy" | grep -v ".git" | sed 's/^\.//'
 */
const CACHE_STORAGE_NAME = 'v1';
const files_to_cache = `
/enchant_moriy/AdBlock.html
/enchant_moriy/apad.png
/enchant_moriy/assets/image/char_chiken_white.png
/enchant_moriy/assets/image/char_eagle_brown.png
/enchant_moriy/assets/image/doors.png
/enchant_moriy/assets/image/dummy.gif
/enchant_moriy/assets/image/effects.png
/enchant_moriy/assets/image/enchant.png
/enchant_moriy/assets/image/GameMsg_Clear.png
/enchant_moriy/assets/image/GameMsg_Oops.png
/enchant_moriy/assets/image/GameMsg_SelectEpisode.png
/enchant_moriy/assets/image/GameMsg_Start.png
/enchant_moriy/assets/image/GamePadUR-L.png
/enchant_moriy/assets/image/god_of_sailene_statue.png
/enchant_moriy/assets/image/god_of_what_bright.png
/enchant_moriy/assets/image/god_of_what_dark.png
/enchant_moriy/assets/image/hero_c1_dash.gif
/enchant_moriy/assets/image/mapChipOriginal.gif
/enchant_moriy/assets/image/mapLikeObject.gif
/enchant_moriy/assets/image/monster_bat_darkgreen.png
/enchant_moriy/assets/image/monster_giant_blue.png
/enchant_moriy/assets/sound/BellE_at_11.mp3
/enchant_moriy/assets/sound/ClothD_at_16.mp3
/enchant_moriy/assets/sound/CockM_at_11.mp3
/enchant_moriy/assets/sound/DoorCloseB_at_11.mp3
/enchant_moriy/assets/sound/DoorCloseD_at_16.mp3
/enchant_moriy/assets/sound/DoorOpenB_at_11.mp3
/enchant_moriy/assets/sound/DoorOpenD_at_16.mp3
/enchant_moriy/assets/sound/fire_on_wax_FireB_at_11.mp3
/enchant_moriy/assets/sound/gameover.mp3
/enchant_moriy/assets/sound/jump.mp3
/enchant_moriy/assets/sound/MetalD_at_11.mp3
/enchant_moriy/assets/sound/SwitchC_at_11.mp3
/enchant_moriy/assets/sound/SwitchF00_at_11.mp3
/enchant_moriy/change.log
/enchant_moriy/effect0.gif
/enchant_moriy/enchant.js
/enchant_moriy/enchant.plugins/animation.enchant.js
/enchant_moriy/enchant.plugins/avatar.enchant.js
/enchant_moriy/enchant.plugins/bone.gl.enchant.js
/enchant_moriy/enchant.plugins/box2d.enchant.js
/enchant_moriy/enchant.plugins/canvas.enchant.js
/enchant_moriy/enchant.plugins/collada.gl.enchant.js
/enchant_moriy/enchant.plugins/extendMap.enchant.js
/enchant_moriy/enchant.plugins/gl.enchant.js
/enchant_moriy/enchant.plugins/glMatrix-0.9.5.min.js
/enchant_moriy/enchant.plugins/libs/ammo.js
/enchant_moriy/enchant.plugins/libs/Box2dWeb-2.1.a.3.js
/enchant_moriy/enchant.plugins/libs/glMatrix-0.9.6.min.js
/enchant_moriy/enchant.plugins/memory.enchant.js
/enchant_moriy/enchant.plugins/mmd.gl.enchant.js
/enchant_moriy/enchant.plugins/nineleap.enchant.js
/enchant_moriy/enchant.plugins/physics.gl.enchant.js
/enchant_moriy/enchant.plugins/primitive.gl.enchant.js
/enchant_moriy/enchant.plugins/socket.enchant.js
/enchant_moriy/enchant.plugins/tl.enchant.js
/enchant_moriy/enchant.plugins/twitter.enchant.js
/enchant_moriy/enchant.plugins/ui.enchant.js
/enchant_moriy/enchant.plugins/util.enchant.js
/enchant_moriy/firstSeedEnchant.js
/enchant_moriy/font.png
/enchant_moriy/icon0.gif
/enchant_moriy/index.html
/enchant_moriy/initMoriy.js
/enchant_moriy/LICENSE
/enchant_moriy/manifest.webmanifest
/enchant_moriy/pad.png
/enchant_moriy/promote/iconimage_moriy_512x512.png
/enchant_moriy/promote/mapChipOriginal_number.gif
/enchant_moriy/promote/promotion.png
/enchant_moriy/promote/screenshot_2013-01-06_1853.png
/enchant_moriy/promote/screenshot_2013-01-06_1854.png
/enchant_moriy/promote/screenshot_2013-01-06_2122.png
/enchant_moriy/promote/titleimage_moriy.png
/enchant_moriy/pwa.html
/enchant_moriy/pwabuilder-sw.js
/enchant_moriy/README.md
/enchant_moriy/registpwa.js
/enchant_moriy/select.html
/enchant_moriy/siteimg/epimg_brightness.png
/enchant_moriy/siteimg/epimg_core.png
/enchant_moriy/siteimg/epimg_dungeon.png
/enchant_moriy/siteimg/epimg_epilogue.png
/enchant_moriy/siteimg/epimg_forecourt.png
/enchant_moriy/siteimg/epimg_loophole.png
/enchant_moriy/siteimg/epimg_lyra.png
/enchant_moriy/siteimg/epimg_mausoleum.png
/enchant_moriy/siteimg/epimg_maze.png
/enchant_moriy/siteimg/epimg_passkey.png
/enchant_moriy/siteimg/epimg_prolog.png
/enchant_moriy/siteimg/epimg_ribbons.png
/enchant_moriy/siteimg/lamp_off.png
/enchant_moriy/siteimg/lamp_on.png
/enchant_moriy/siteimg/logo.png
/enchant_moriy/siteimg/scrollarrow-L.png
/enchant_moriy/siteimg/scrollarrow-R.png
/enchant_moriy/stage00.html
/enchant_moriy/stage00.js
/enchant_moriy/stage00.ui
/enchant_moriy/stage01.html
/enchant_moriy/stage01.js
/enchant_moriy/stage01.ui
/enchant_moriy/stage02.html
/enchant_moriy/stage02.js
/enchant_moriy/stage02.ui
/enchant_moriy/stage03.html
/enchant_moriy/stage03.js
/enchant_moriy/stage03.ui
/enchant_moriy/stage04.html
/enchant_moriy/stage04.js
/enchant_moriy/stage04.ui
/enchant_moriy/stage05.html
/enchant_moriy/stage05.js
/enchant_moriy/stage05.ui
/enchant_moriy/stage06.html
/enchant_moriy/stage06.js
/enchant_moriy/stage06.ui
/enchant_moriy/stage07.html
/enchant_moriy/stage07.js
/enchant_moriy/stage07.ui
/enchant_moriy/stage08.html
/enchant_moriy/stage08.js
/enchant_moriy/stage08.ui
/enchant_moriy/stage09.html
/enchant_moriy/stage09.js
/enchant_moriy/stage09.ui
/enchant_moriy/stage10.html
/enchant_moriy/stage10.js
/enchant_moriy/stage10.ui
/enchant_moriy/stage11.html
/enchant_moriy/stage11.js
/enchant_moriy/stage11.ui
/enchant_moriy/stage12.html
/enchant_moriy/stage12.js
`.split("\n")
.map(function(line){
  return line.replace(/^\s+|\s+$/g, "");
})
.filter(function(line){
  return !!line;
});





// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
// const offlineFallbackPage = "ToDo-replace-this-name.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE_STORAGE_NAME)
      .then((cache) => cache.addAll(files_to_cache))
      // .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE_STORAGE_NAME);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
