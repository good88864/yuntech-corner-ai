import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("."));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/generate", async (req, res) => {

  const {
    corner,
    place,
    personality,
    afterClass,
    stress
} = req.body;

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
使用者資料：

角落：${corner}
喜歡的環境：${place}
個性：${personality}
下課習慣：${afterClass}
面對壓力：${stress}

請以校園明信片的風格撰寫內容。

規則：

- 使用繁體中文
- 不要出現 AI分析
- 不要出現 專屬明信片文案
- 不要出現編號
- 不要出現 Markdown
- 不要出現星號 *
- 第一段描述使用者與角落的連結
- 第二段是一句適合印在明信片上的句子
- 語氣溫柔、有故事感
- 總字數控制在100字內

範例格式：

你習慣在忙碌的日常中保留自己的步調，也總能從平凡的風景裡找到值得停留的片刻。

把青春留在此刻，也把夢想留給未來。

角落特徵：

圖書館前草地：溫柔、陪伴、安定
雲夢湖：感性、思考、沉靜
設計學院走廊：創意、好奇、想像力
操場司令台：自信、行動力、領導
校門口：期待、開始、探索
學生活動中心：熱情、社交、活力
宿舍前廣場：歸屬感、陪伴、日常
樹蔭長椅：療癒、觀察、獨處
`
    });

    res.json({
      result: response.text
    });

  } catch (error) {

    console.error(error);

    if (error.status === 429) {

        res.json({
            result: "目前體驗人數較多，請稍後約1分鐘再試一次🫶"
        });

        return;
    }

    res.json({
        result: "系統忙碌中，請稍後再試一次🫶"
    });

}

});

app.listen(3000, () => {
  console.log("Server Running");
});