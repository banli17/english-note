import path, { normalize } from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue(), vitePluginServerApi()],
});

function vitePluginServerApi() {
  return {
    name: "vite-plugin-server-api",
    async configureServer(server) {
      const app = server.middlewares;
      app.use(helperMiddleware);
      app.use("/localApi/menus", getMenus);
      app.use("/localApi/lesson-data", getLessonData);
    },
  };
  // 自定义参数和方法的中间件
  function helperMiddleware(req, res, next) {
    res.setHeader("Content-Type", "application/json;charset=utf-8");

    function end(res, data, message, code) {
      res.end(
        JSON.stringify({
          code,
          message,
          data,
        })
      );
    }
    res.success = (data = {}, message = "操作成功", code = 200) => {
      end(res, data, message, code);
    };
    res.error = (data = {}, message = "操作失败", code = 500) => {
      end(res, data, message, code);
    };

    if (
      req.method === "POST" &&
      !req.headers["content-type"]?.startsWith("multipart/form-data")
    ) {
      const body = [];
      req.on("data", (data) => {
        body.push(data);
      });
      req.on("end", () => {
        req.body = JSON.parse(Buffer.concat(body).toString());
        next();
      });
    } else {
      next();
    }
  }
}

function getMenus(req, res) {
  const menus = [];
  const dirs = fs.readdirSync(path.resolve(__dirname, "public/data"));

  dirs.forEach((dir) => {
    const menuItem = {
      type: "category",
      name: dir,
      children: fs
        .readdirSync(path.resolve(__dirname, `public/data/${dir}`))
        .map((file) => {
          let str = file.replace(".json", "");
          // 如果是 .srt 文件
          if (str.endsWith(".srt")) {
            str = str.replace(/ \[DownloadYoutubeSubtitles\.com\]\.srt/, "");
            const lang = !str.includes("[Chinese") ? "en" : "ch";
            return {
              type: "lesson",
              normalizedName: str.replace(/\[(.+?)$/, "").trim(),
              name: str,
              file: path.resolve(__dirname, `public/data/${dir}`, file),
              content: fs.readFileSync(
                path.resolve(__dirname, `public/data/${dir}`, file),
                "utf-8"
              ),
              lang,
            };
          } else if (str.endsWith(".txt")) {
            return {
              type: "lesson",
              normalizedName: str.replace(/\[(.+?)$/, "").trim(),
              name: str,
              file: path.resolve(__dirname, `public/data/${dir}`, file),
              content: fs.readFileSync(
                path.resolve(__dirname, `public/data/${dir}`, file),
                "utf-8"
              ),
            };
          }
        })
        .reduce((acc, cur) => {
          const key = cur.normalizedName;
          if (!acc[key]) {
            acc[key] = {};
          }
          console.log("key", key, cur.lang);
          acc[key][cur.lang] = cur;
          return acc;
        }, {}),
    };

    console.log(menuItem);
    menus.push(menuItem);
  });

  res.success(menus);
}

function getLessonData(req, res) {}
